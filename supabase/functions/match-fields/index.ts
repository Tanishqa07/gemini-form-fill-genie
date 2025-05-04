
// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/examples/supabase

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.1';

interface FormField {
  fieldName: string;
  fieldType: string;
  required: boolean;
  placeholder?: string;
  label?: string;
}

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the logged-in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get the current user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Get the request body
    const { detectedFields, userData } = await req.json();

    // In a real implementation, we would call the Gemini API here
    // For now, we'll use a simple matching algorithm
    const matches: Record<string, any> = {};

    detectedFields.forEach((field: FormField) => {
      // Simple matching based on field name or label
      const fieldName = field.fieldName.toLowerCase();
      const fieldLabel = field.label?.toLowerCase() || '';

      // Try direct matches first
      if (userData[fieldName]) {
        matches[fieldName] = userData[fieldName];
      } else if (userData[fieldLabel]) {
        matches[fieldName] = userData[fieldLabel];
      } else {
        // Try fuzzy matching
        if (fieldName.includes('name') || fieldLabel.includes('name')) {
          matches[fieldName] = userData.fullName || '';
        } else if (
          fieldName.includes('email') || 
          fieldLabel.includes('email') || 
          fieldName.includes('mail') || 
          fieldLabel.includes('mail')
        ) {
          matches[fieldName] = userData.email || '';
        } else if (
          fieldName.includes('phone') || 
          fieldLabel.includes('phone') || 
          fieldName.includes('mobile') || 
          fieldLabel.includes('mobile')
        ) {
          matches[fieldName] = userData.phone || '';
        } else if (
          fieldName.includes('address') || 
          fieldLabel.includes('address')
        ) {
          matches[fieldName] = userData.address || '';
        } else if (
          fieldName.includes('birth') || 
          fieldLabel.includes('birth') ||
          fieldName.includes('dob') || 
          fieldLabel.includes('dob')
        ) {
          matches[fieldName] = userData.dateOfBirth || '';
        }
      }
    });

    // Save the form fill event in the database
    const { error: historyError } = await supabaseClient
      .from('form_history')
      .insert({
        user_id: user.id,
        website_url: req.headers.get('Referer') || 'unknown',
        field_name: 'multiple',
        field_value: 'multiple fields matched',
        field_type: 'form',
        date_filled: new Date().toISOString(),
        form_title: 'Form Fill Request'
      });

    if (historyError) {
      console.error('Error saving form history:', historyError);
    }

    return new Response(
      JSON.stringify({ matches }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
