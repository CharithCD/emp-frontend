"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
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
  employee: { name: string; _id: string }; // Updated to match backend response
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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [leaves, setLeaves] = useState<Leaves[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [commentMap, setCommentMap] = useState<Record<string, string>>({});
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});

  const filteredLeaves = leaves.filter((leave) =>
    selectedStatus === "all" ? true : leave.status === selectedStatus
  );

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/v1/leaves", {
        withCredentials: true,
      });
      setLeaves(response.data.data);
      // Initialize comment map with existing comments
      const initialComments = response.data.data.reduce(
        (acc: Record<string, string>, leave: Leaves) => {
          if (leave.comment) acc[leave._id] = leave.comment;
          return acc;
        },
        {}
      );
      setCommentMap(initialComments);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          variant: "destructive",
          title: "Error fetching leave data",
          description: error.response?.data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error fetching leave data",
          description: "Could not fetch leaves. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleStatusChange = async (leaveId: string) => {
    try {
      setUpdatingId(leaveId);
      const response = await axios.put(
        `http://localhost:8000/api/v1/leaves/${leaveId}/review`,
        {
          status: statusMap[leaveId],
          comment: commentMap[leaveId],
        },
        { withCredentials: true }
      );

      // Update local state with new data
      setLeaves((prev) =>
        prev.map((leave) =>
          leave._id === leaveId ? response.data.data : leave
        )
      );

      toast({
        title: "Status updated",
        description: "Leave request has been updated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update leave status. Please try again.",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm">
        <div className="p-6 space-y-4 w-full">
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-[500px] text-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                      Loading leaves...
                    </TableCell>
                  </TableRow>
                ) : filteredLeaves.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-[500px] text-center">
                      No leaves found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeaves.map((leave) => (
                    <TableRow key={leave._id}>
                      <TableCell className="font-medium">
                        {leave.employee.name}
                      </TableCell>
                      <TableCell className="capitalize">
                        {leave.leaveType}
                      </TableCell>
                      <TableCell>
                        {new Date(leave.startDate).toLocaleDateString()} -{" "}
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
                            disabled={updatingId === leave._id}
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
                            onClick={() => handleStatusChange(leave._id)}
                            disabled={updatingId === leave._id}
                          >
                            {updatingId === leave._id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Update
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  );
}
