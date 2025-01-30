"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface Leaves {
  _id: string;
  employee: string;
  leaveType: "annual" | "sick" | "unpaid" | "maternity" | "paternity";
  requestDate: Date;
  startDate: Date;
  endDate: Date;
  noDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string | null;
  comment?: string;
}

export default function Page() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [leaves, setLeaves] = useState<Leaves[]>([]);

  useEffect(() => {
    if (hasFetched) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/leaves/employee",
          { withCredentials: true }
        );
        const data = response.data.data;
        setLeaves(data);
        console.log(data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching subject data",
          description: "Could not fetch subjects data. Please try again.",
        });
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [hasFetched]);

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm">
        
        <div className="flex flex-1 flex-col p-4 space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Leave Requests</h1>
            <Link href="/dashboard/leaves/request">
              <Button>New Request</Button>
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.map((leave) => (
                <TableRow key={leave._id}>
                  <TableCell className="capitalize">
                    {leave.leaveType}
                  </TableCell>
                  <TableCell>
                    {new Date(leave.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(leave.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{leave.noDays}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        leave.status === "approved"
                          ? "default"
                          : leave.status === "rejected"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {leave.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {leave.reason}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </main>
  );
}
