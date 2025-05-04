
import React from "react";
import { useSupabase } from "../contexts/SupabaseContext";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const { user, signOut } = useSupabase();

  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-white rounded-md p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0047AB"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M9 14v1" />
              <path d="M9 8v1" />
              <path d="M9 11h6" />
              <path d="M15 14v1" />
              <path d="M12 14v4" />
              <path d="M12 8v3" />
              <path d="M15 8v1" />
            </svg>
          </div>
          <span className="font-bold text-lg">FormFillGenie</span>
        </Link>

        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline">Welcome, {user.user_metadata?.full_name || user.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Logout
            </Button>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </header>
  );
};

export default Header;
