"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import axios from "axios";

const Logoutbutton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // Clear user session

    const response = await axios.post("http://localhost:8000/api/v1/users/logout", {}, { withCredentials: true });

    if (response.status === 200) {
      router.push("/login");
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="ml-auto h-8 w-8"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      <span className="sr-only">Logout</span>
    </Button>
  );
};

export default Logoutbutton;
