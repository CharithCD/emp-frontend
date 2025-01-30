"use client";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  const showErrorToast = (description: string) => {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description,
    });
  };

  const showSuccessToast = (description: string) => {
    toast({
      description,
    });
  };

  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const [leaves, setLeaves] = useState<Leaves[]>([]);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  const filteredLeaves = leaves.filter((leave) =>
    selectedStatus === "all" ? true : leave.status === selectedStatus
  );

  useEffect(() => {
    if (hasFetched) return;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/leaves",
          { withCredentials: true }
        );

        if (response.status === 200) {
          setHasFetched(true);
          const data = response.data.data;
          setLeaves(data);
          console.log(data);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          showErrorToast(error.response?.data.message);
        } else {
          showErrorToast("An unexpected error occurred");
        }
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
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Leave Management</h1>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border h-[600px] overflow-auto">
            <Table className="relative">
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  <TableHead className="w-[200px]">Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[250px]">Dates</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[300px]">Comment</TableHead>
                  <TableHead className="w-[200px]">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredLeaves.map((leave) => (
                  <TableRow key={leave._id}>
                    <TableCell className="font-medium">
                      {leave.employee}
                    </TableCell>
                    <TableCell className="capitalize">
                      {leave.leaveType}
                    </TableCell>
                    <TableCell>
                      {new Date(leave.startDate).toLocaleDateString()} -
                      {new Date(leave.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{leave.noDays}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {leave.reason}
                    </TableCell>
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
                    <TableCell>
                      <Input
                        placeholder="Add comment..."
                        value={commentMap[leave._id] || ""}
                        onChange={(e) =>
                          setCommentMap((prev) => ({
                            ...prev,
                            [leave._id]: e.target.value,
                          }))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Select
                          value={statusMap[leave._id] || leave.status}
                          onValueChange={(value) =>
                            setStatusMap((prev) => ({
                              ...prev,
                              [leave._id]: value,
                            }))
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Approve</SelectItem>
                            <SelectItem value="rejected">Reject</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="sm"
                          // onClick={() => handleStatusChange(leave._id)}
                        >
                          Update
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}
