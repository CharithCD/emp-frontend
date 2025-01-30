// app/admin/employees/new/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function AddEmployeePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    dateOfEmployment: new Date(),
    manager: "",
    salary: 0,
    status: "active",
    photo: "",
    leaveBalance: 20,
  });

  const [managers, setManagers] = useState<any[]>([]);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await axios.get("/api/employees?managers=true");
        setManagers(response.data.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error loading managers",
          description: "Could not fetch manager data. Please try again.",
        });
      }
    };

    fetchManagers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await axios.post("/api/employees", employee);
      
      toast({
        title: "Employee created",
        description: "New employee has been added successfully",
      });
      
      router.push("/admin/employees");
    } catch (error:any) {
      toast({
        variant: "destructive",
        title: "Error creating employee",
        description: error.response?.data?.message || "Could not create employee. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add New Employee</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={employee.phone}
              onChange={(e) => setEmployee({ ...employee, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Input
              value={employee.department}
              onChange={(e) => setEmployee({ ...employee, department: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Position</Label>
            <Input
              value={employee.position}
              onChange={(e) => setEmployee({ ...employee, position: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Employment Date</Label>
            <Calendar
              mode="single"
              selected={employee.dateOfEmployment}
              onSelect={(date) => date && setEmployee({ ...employee, dateOfEmployment: date })}
              className="rounded-md border"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Manager</Label>
            <Select
              value={employee.manager}
              onValueChange={(value) => setEmployee({ ...employee, manager: value })}
            >
              {/* <SelectTrigger>
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Manager</SelectItem>
                {managers.map((manager) => (
                  <SelectItem key={manager._id} value={manager._id}>
                    {manager.name}
                  </SelectItem>
                ))}
              </SelectContent> */}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Salary</Label>
            <Input
              type="number"
              value={employee.salary}
              onChange={(e) => setEmployee({ ...employee, salary: Number(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={employee.status}
              onValueChange={(value) => setEmployee({ ...employee, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Leave Balance</Label>
            <Input
              type="number"
              value={employee.leaveBalance}
              onChange={(e) => setEmployee({ ...employee, leaveBalance: Number(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/employees")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Employee
          </Button>
        </div>
      </form>
    </div>
  );
}