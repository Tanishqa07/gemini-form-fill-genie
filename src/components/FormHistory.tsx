
import React, { useState } from "react";
import { useFormData } from "../contexts/FormDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Search, Clock, Globe } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const FormHistory: React.FC = () => {
  const { formHistory, isLoading } = useFormData();
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredHistory = formHistory.filter(item => 
    item.website_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.field_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.field_value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Form Fill History</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by website, field name, or value..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p>Loading form history...</p>
          </div>
        ) : formHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No form history yet. Start filling forms to see your history here.</p>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Website</TableHead>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="truncate max-w-[150px]" title={item.website_url}>
                        {new URL(item.website_url).hostname}
                      </span>
                    </TableCell>
                    <TableCell>{item.field_name}</TableCell>
                    <TableCell>
                      <span className="truncate max-w-[150px]" title={item.field_value}>
                        {item.field_value}
                      </span>
                    </TableCell>
                    <TableCell className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span title={new Date(item.date_filled).toLocaleString()}>
                        {formatDistanceToNow(new Date(item.date_filled), { addSuffix: true })}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormHistory;
