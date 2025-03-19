
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Types for Open Dental API responses
export interface OpenDentalPatient {
  patientId: string;
  name: string;
  phoneNumber: string;
  email: string;
  preferredContactMethod: string;
}

export interface OpenDentalAppointment {
  appointmentId: string;
  patientId: string;
  patientName: string;
  procedureCode: string;
  procedureDescription: string;
  appointmentDate: string;
  appointmentStatus: string;
  providerName: string;
  notes: string;
}

export interface OpenDentalCancellation extends OpenDentalAppointment {
  cancellationReason: string;
  cancellationDate: string;
}

export interface FollowUpTask {
  id: string;
  patientId: string;
  patientName: string;
  followUpType: string;
  dueDate: string;
  status: string;
  priority: string;
  contactInfo: string;
  notes: string;
  appointmentId?: string;
}

// Supabase API endpoints
// Get tomorrow's cancellations
export const fetchTomorrowCancellations = async (): Promise<OpenDentalCancellation[]> => {
  try {
    // Format tomorrow's date as YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('cancellations')
      .select('*')
      .eq('appointment_date', tomorrowFormatted);
    
    if (error) {
      throw error;
    }
    
    // Map Supabase data to our interface format
    return data.map(item => ({
      appointmentId: item.appointment_id,
      patientId: item.patient_id,
      patientName: item.patient_name,
      procedureCode: item.procedure_code,
      procedureDescription: item.procedure_description,
      appointmentDate: item.appointment_date,
      appointmentStatus: 'Cancelled',
      providerName: item.provider_name,
      notes: item.notes || '',
      cancellationReason: item.cancellation_reason,
      cancellationDate: item.cancellation_date
    }));
  } catch (error) {
    console.error("Failed to fetch tomorrow's cancellations:", error);
    throw error;
  }
};

// Get patient details
export const fetchPatientDetails = async (patientId: string): Promise<OpenDentalPatient> => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', patientId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      patientId: data.id,
      name: data.name,
      phoneNumber: data.phone_number || '',
      email: data.email || '',
      preferredContactMethod: data.preferred_contact_method
    };
  } catch (error) {
    console.error(`Failed to fetch patient details for ${patientId}:`, error);
    // Return a default patient if not found
    return { 
      patientId, 
      name: "Unknown Patient", 
      phoneNumber: "", 
      email: "",
      preferredContactMethod: "phone"
    };
  }
};

// Get follow-up tasks
export const fetchFollowUpTasks = async (): Promise<FollowUpTask[]> => {
  try {
    const { data, error } = await supabase
      .from('follow_up_tasks')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data.map(item => ({
      id: item.id,
      patientId: item.patient_id,
      patientName: item.patient_name,
      followUpType: item.follow_up_type,
      dueDate: item.due_date,
      status: item.status,
      priority: item.priority,
      contactInfo: item.contact_info,
      notes: item.notes || '',
      appointmentId: item.appointment_id
    }));
  } catch (error) {
    console.error("Failed to fetch follow-up tasks:", error);
    throw error;
  }
};

// Create a new follow-up task
export const createFollowUpTask = async (task: Omit<FollowUpTask, "id">): Promise<FollowUpTask> => {
  try {
    const { data, error } = await supabase
      .from('follow_up_tasks')
      .insert({
        patient_id: task.patientId,
        patient_name: task.patientName,
        follow_up_type: task.followUpType,
        due_date: task.dueDate,
        status: task.status,
        priority: task.priority,
        contact_info: task.contactInfo,
        notes: task.notes,
        appointment_id: task.appointmentId
      })
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name,
      followUpType: data.follow_up_type,
      dueDate: data.due_date,
      status: data.status,
      priority: data.priority,
      contactInfo: data.contact_info,
      notes: data.notes || '',
      appointmentId: data.appointment_id
    };
  } catch (error) {
    console.error("Failed to create follow-up task:", error);
    throw error;
  }
};

// Update a follow-up task
export const updateFollowUpTask = async (taskId: string, updates: Partial<FollowUpTask>): Promise<FollowUpTask> => {
  try {
    // Convert from camelCase to snake_case for Supabase
    const supabaseUpdates: any = {};
    if (updates.patientId) supabaseUpdates.patient_id = updates.patientId;
    if (updates.patientName) supabaseUpdates.patient_name = updates.patientName;
    if (updates.followUpType) supabaseUpdates.follow_up_type = updates.followUpType;
    if (updates.dueDate) supabaseUpdates.due_date = updates.dueDate;
    if (updates.status) supabaseUpdates.status = updates.status;
    if (updates.priority) supabaseUpdates.priority = updates.priority;
    if (updates.contactInfo) supabaseUpdates.contact_info = updates.contactInfo;
    if (updates.notes) supabaseUpdates.notes = updates.notes;
    if (updates.appointmentId) supabaseUpdates.appointment_id = updates.appointmentId;
    
    // Add updated_at timestamp
    supabaseUpdates.updated_at = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('follow_up_tasks')
      .update(supabaseUpdates)
      .eq('id', taskId)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return {
      id: data.id,
      patientId: data.patient_id,
      patientName: data.patient_name,
      followUpType: data.follow_up_type,
      dueDate: data.due_date,
      status: data.status,
      priority: data.priority,
      contactInfo: data.contact_info,
      notes: data.notes || '',
      appointmentId: data.appointment_id
    };
  } catch (error) {
    console.error(`Failed to update follow-up task ${taskId}:`, error);
    throw error;
  }
};

// Get follow-up task counts for dashboard
export const fetchFollowUpCounts = async () => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Count today's follow-ups
    const { count: todaysCount, error: todaysError } = await supabase
      .from('follow_up_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('due_date', today);
      
    if (todaysError) throw todaysError;
    
    // Count pending follow-ups
    const { count: pendingCount, error: pendingError } = await supabase
      .from('follow_up_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
      
    if (pendingError) throw pendingError;
    
    // Count completed follow-ups
    const { count: completedCount, error: completedError } = await supabase
      .from('follow_up_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');
      
    if (completedError) throw completedError;
    
    // Count urgent (high priority) tasks
    const { count: urgentCount, error: urgentError } = await supabase
      .from('follow_up_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('priority', 'high')
      .eq('status', 'pending');
      
    if (urgentError) throw urgentError;
    
    return {
      todaysFollowUps: todaysCount || 0,
      pendingFollowUps: pendingCount || 0,
      completedFollowUps: completedCount || 0,
      urgentTasks: urgentCount || 0
    };
  } catch (error) {
    console.error("Failed to fetch follow-up counts:", error);
    throw error;
  }
};

// Contact patient (phone or email)
export const contactPatient = async (patientId: string, method: 'phone' | 'email'): Promise<boolean> => {
  try {
    // In a real implementation, this would initiate a call or send an email
    // For now, we'll just log it and simulate a successful contact
    console.log(`Contacting patient ${patientId} via ${method}`);
    
    // You could log the contact attempt to a separate table if needed
    // await supabase.from('patient_contacts').insert({
    //   patient_id: patientId,
    //   contact_method: method,
    //   timestamp: new Date()
    // });
    
    return true;
  } catch (error) {
    console.error(`Failed to contact patient ${patientId} via ${method}:`, error);
    throw error;
  }
};

// Get stats for the dashboard - updated to use real counts for follow-ups
export const fetchDashboardStats = async () => {
  try {
    // Get follow-up counts first
    const followUpCounts = await fetchFollowUpCounts();
    
    // Then get the rest of the dashboard stats
    const { data, error } = await supabase
      .from('dashboard_stats')
      .select('*')
      .order('last_updated', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      throw error;
    }
    
    // Merge follow-up counts with other dashboard stats
    return {
      // Use real counts for follow-ups
      todaysFollowUps: followUpCounts.todaysFollowUps,
      pendingFollowUps: followUpCounts.pendingFollowUps,
      completedFollowUps: followUpCounts.completedFollowUps,
      urgentTasks: followUpCounts.urgentTasks,
      
      // Use existing data for other stats
      lowStockItems: data.low_stock_items,
      restockedItems: data.restocked_items,
      todayInventoryUpdates: data.today_inventory_updates,
      staffOnDuty: data.staff_on_duty,
      pendingTimeOff: data.pending_time_off,
      shiftsCompleted: data.shifts_completed,
      pendingPayments: data.pending_payments,
      clearedPayments: data.cleared_payments,
      todayTransactions: data.today_transactions,
      nextDayCancellations: data.next_day_cancellations
    };
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    throw error;
  }
};

// React Query hooks
export function useTomorrowCancellations() {
  return useQuery({
    queryKey: ['cancellations', 'tomorrow'],
    queryFn: fetchTomorrowCancellations
  });
}

export function usePatientDetails(patientId: string) {
  return useQuery({
    queryKey: ['patient', patientId],
    queryFn: () => fetchPatientDetails(patientId),
    enabled: !!patientId
  });
}

export function useFollowUpTasks() {
  return useQuery({
    queryKey: ['followUpTasks'],
    queryFn: fetchFollowUpTasks
  });
}

export function useFollowUpCounts() {
  return useQuery({
    queryKey: ['followUpCounts'],
    queryFn: fetchFollowUpCounts
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats
  });
}

export function useCreateFollowUpTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createFollowUpTask,
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['followUpTasks'] });
      queryClient.invalidateQueries({ queryKey: ['followUpCounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    }
  });
}

export function useUpdateFollowUpTask() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string, updates: Partial<FollowUpTask> }) => 
      updateFollowUpTask(taskId, updates),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['followUpTasks'] });
      queryClient.invalidateQueries({ queryKey: ['followUpCounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
    }
  });
}

export function useContactPatient() {
  return useMutation({
    mutationFn: ({ patientId, method }: { patientId: string, method: 'phone' | 'email' }) => 
      contactPatient(patientId, method)
  });
}
