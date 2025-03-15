
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useCreateFollowUpTask } from "@/services/openDentalApi";

const formSchema = z.object({
  patientName: z.string().min(2, {
    message: "Patient name must be at least 2 characters.",
  }),
  patientId: z.string().optional(),
  contactInfo: z.string().min(5, {
    message: "Contact information is required.",
  }),
  followUpType: z.string({
    required_error: "Please select a follow-up type.",
  }),
  priority: z.string().default("medium"),
  dueDate: z.date({
    required_error: "A due date is required.",
  }),
  notes: z.string().optional(),
  appointmentId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface TaskFormProps {
  onSave: () => void;
  defaultCategory?: string;
}

export function TaskForm({ onSave, defaultCategory }: TaskFormProps) {
  const createTaskMutation = useCreateFollowUpTask();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: "",
      patientId: "",
      contactInfo: "",
      followUpType: defaultCategory || "",
      priority: "medium",
      notes: "",
      appointmentId: "",
    },
  });

  // Update form when defaultCategory changes
  useEffect(() => {
    if (defaultCategory) {
      form.setValue('followUpType', defaultCategory);
    }
  }, [defaultCategory, form]);

  function onSubmit(data: FormValues) {
    // Format the date as YYYY-MM-DD for the API
    const formattedDueDate = format(data.dueDate, 'yyyy-MM-dd');
    
    createTaskMutation.mutate(
      {
        patientId: data.patientId || `P${Math.floor(Math.random() * 10000)}`, // Generate a random ID for demo
        patientName: data.patientName,
        followUpType: data.followUpType,
        dueDate: formattedDueDate,
        status: "pending",
        priority: data.priority,
        contactInfo: data.contactInfo,
        notes: data.notes || "",
        appointmentId: data.appointmentId
      },
      {
        onSuccess: () => {
          onSave();
          form.reset({
            patientName: "",
            patientId: "",
            contactInfo: "",
            followUpType: defaultCategory || "",
            priority: "medium",
            notes: "",
            appointmentId: "",
          });
        },
        onError: (error) => {
          console.error("Failed to create task:", error);
          // Form will show validation errors automatically
        }
      }
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="patientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter patient name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone or Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter phone or email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="followUpType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Follow-up Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="reschedule">Reschedule</SelectItem>
                    <SelectItem value="cancellation">Cancellation</SelectItem>
                    <SelectItem value="treatment">Treatment Follow-up</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "pl-3 text-left font-normal",
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
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any additional notes here..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onSave}
            disabled={createTaskMutation.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            disabled={createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? "Creating..." : "Create Task"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
