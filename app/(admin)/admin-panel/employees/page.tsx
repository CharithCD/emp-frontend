"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  dateOfEmployment: Date;
  manager?: { name: string };
  salary: number;
  status: string;
  leaveBalance: number;
}

export default function EmployeeList() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/v1/employees", {withCredentials: true});
      setEmployees(response.data.data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error fetching employees",
        description: "Could not fetch employee data. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Employee Management</h1>
        <Link href="/admin-panel/employees/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Employment Date</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Leave Balance</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Loading employees...
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((employee) => (
                <TableRow key={employee._id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    {/* {format(new Date(employee.dateOfEmployment), "MMM dd, yyyy")} */}
                  </TableCell>
                  <TableCell>
                    {employee.manager?.name || "No Manager"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={employee.status === "active" ? "default" : "destructive"}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{employee.leaveBalance} days</TableCell>
                  <TableCell>
                    <Link href={`/admin-panel/employees/${employee._id}`}>
                      <Button variant="outline" size="sm">
                        View/Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}