"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import axios from "axios";
import { CalendarIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import React, { JSX } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Calendar } from "@/components/ui/calendar";

const leaveSchema = z.object({
  startDate: z.date().refine((date) => date > new Date(), {
    message: "Start date must be in the future",
  }),
  endDate: z.date().refine((date) => date > new Date(), {
    message: "End date must be in the future",
  }), 
  leaveType: z.enum(["annual", "sick", "unpaid", "maternity", "paternity"]),
  reason: z.string().optional(),
});

const Page = (): JSX.Element => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<formData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      reason: "",
    },
  });

  type formData = z.infer<typeof leaveSchema>;

  const onSubmit = async (values: formData) => {
    try {
      const response = await axios.post("http://localhost:8000/api/v1/leaves/request", values, {withCredentials: true});
      if (response.status >= 200 && response.status < 300) {
        // router.push("http://localhost:8000/api/v1/leaves/request");
        toast({
          description: "Request submitted successfully",
        });
        //refresh the page and remove the data from the form
        form.reset();
        
      } else {
        toast({
          variant: "destructive",
          title: "Failed",
          description: "Failed. Please try again.",
        });
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const { data } = error.response;
        const errorMessage =
          data?.error || "An error occurred during inserting";
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: errorMessage,
        });
      } else if (error instanceof z.ZodError) {
        error.errors.forEach((errorItem) => {
          const field = errorItem.path.join(".");
          form.setError(field as keyof formData, {
            type: "server",
            message: errorItem.message,
          });
        });
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "An unexpected error occurred during inserting",
        });
      }
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Please fill the following Details
        </h1>
        <Button asChild variant="secondary">
          <Link href={"/dashboard/leaves"}>Go Back</Link>
        </Button>
      </div>
      <div className="flex flex-1 rounded-lg border border-dashed shadow-sm">
        <div className="p-8 w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="lg:w-2/3 space-y-4"
            >
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Leave Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger >
                          <SelectValue placeholder="Select a leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="sick">Sick</SelectItem>
                        <SelectItem value="unpaid">Unpaid</SelectItem>
                        <SelectItem value="maternity">Maternity</SelectItem>
                        <SelectItem value="paternity">Paternity</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel htmlFor="reason">Reason</FormLabel>
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </FormItem>

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" /> Please wait...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default Page;
