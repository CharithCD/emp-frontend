"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { decryptToken } from "@/lib/decryptToken";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decryptedToken = await decryptToken(token);
      if (decryptedToken) {
        const { id, email, role } = decryptedToken;
        
        if (role === "admin") {
          router.push("/admin-panel");
        } else {
          router.push("/dashboard");
        }
      }
    };
    };
    fetchData();
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <motion.div 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }}
        className="max-w-md w-full p-6"
      >
        <Card className="shadow-lg bg-white rounded-2xl overflow-hidden">
          <CardContent className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Employee Management System</h1>
            <p className="text-gray-600 mb-6">Effortlessly manage your employees with our modern and intuitive system.</p>
            <Button className="w-full text-lg" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
