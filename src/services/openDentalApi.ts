
import { useQuery, useMutation } from "@tanstack/react-query";

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

// Mock API endpoints for development
// In production, these would connect to the actual Open Dental API endpoints
const API_BASE_URL = "https://api.opendentalsoft.com/api/v1";
const API_KEY = "YOUR_OPEN_DENTAL_API_KEY"; // Replace with actual API key in production

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_KEY}`,
    ...options.headers
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// Get tomorrow's cancellations
export const fetchTomorrowCancellations = async (): Promise<OpenDentalCancellation[]> => {
  try {
    // Format tomorrow's date as YYYY-MM-DD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    // In development, we'll return mock data
    // In production, this would call the actual API
    // return await fetchWithAuth(`/appointments/cancellations?date=${tomorrowFormatted}`);
    
    // Mock data for development
    return [
      { 
        appointmentId: "1", 
        patientId: "P1001",
        patientName: "Sarah Johnson", 
        procedureCode: "D7140",
        procedureDescription: "Tooth Extraction",
        appointmentDate: tomorrowFormatted,
        appointmentStatus: "Cancelled",
        providerName: "Dr. Smith",
        notes: "Patient requested a call back to reschedule.",
        cancellationReason: "Personal emergency",
        cancellationDate: new Date().toISOString().split('T')[0]
      },
      { 
        appointmentId: "2", 
        patientId: "P1002",
        patientName: "Michael Chen", 
        procedureCode: "D1110",
        procedureDescription: "Cleaning",
        appointmentDate: tomorrowFormatted,
        appointmentStatus: "Cancelled",
        providerName: "Dr. Johnson",
        notes: "Patient needs to reschedule due to work conflict.",
        cancellationReason: "Work conflict",
        cancellationDate: new Date().toISOString().split('T')[0]
      },
      { 
        appointmentId: "3", 
        patientId: "P1003",
        patientName: "Emily Williams", 
        procedureCode: "D2140",
        procedureDescription: "Filling",
        appointmentDate: tomorrowFormatted,
        appointmentStatus: "Cancelled",
        providerName: "Dr. Davis",
        notes: "",
        cancellationReason: "Scheduling conflict",
        cancellationDate: new Date().toISOString().split('T')[0]
      },
      { 
        appointmentId: "4", 
        patientId: "P1004",
        patientName: "David Taylor", 
        procedureCode: "D2790",
        procedureDescription: "Crown",
        appointmentDate: tomorrowFormatted,
        appointmentStatus: "Cancelled",
        providerName: "Dr. Wilson",
        notes: "Patient requested to be seen sooner if possible.",
        cancellationReason: "Feeling better",
        cancellationDate: new Date().toISOString().split('T')[0]
      },
      { 
        appointmentId: "5", 
        patientId: "P1005",
        patientName: "Jessica Brown", 
        procedureCode: "D0140",
        procedureDescription: "Consultation",
        appointmentDate: tomorrowFormatted,
        appointmentStatus: "Cancelled",
        providerName: "Dr. Miller",
        notes: "",
        cancellationReason: "Transportation issues",
        cancellationDate: new Date().toISOString().split('T')[0]
      },
    ];
  } catch (error) {
    console.error("Failed to fetch tomorrow's cancellations:", error);
    throw error;
  }
};

// Get patient details
export const fetchPatientDetails = async (patientId: string): Promise<OpenDentalPatient> => {
  try {
    // In production: return await fetchWithAuth(`/patients/${patientId}`);
    
    // Mock data for development
    const patients: Record<string, OpenDentalPatient> = {
      "P1001": { 
        patientId: "P1001", 
        name: "Sarah Johnson", 
        phoneNumber: "(555) 123-4567", 
        email: "sarah.j@example.com",
        preferredContactMethod: "phone"
      },
      "P1002": { 
        patientId: "P1002", 
        name: "Michael Chen", 
        phoneNumber: "(555) 987-6543", 
        email: "m.chen@example.com",
        preferredContactMethod: "email"
      },
      "P1003": { 
        patientId: "P1003", 
        name: "Emily Williams", 
        phoneNumber: "(555) 456-7890", 
        email: "e.williams@example.com",
        preferredContactMethod: "phone"
      },
      "P1004": { 
        patientId: "P1004", 
        name: "David Taylor", 
        phoneNumber: "(555) 321-6547", 
        email: "d.taylor@example.com",
        preferredContactMethod: "email"
      },
      "P1005": { 
        patientId: "P1005", 
        name: "Jessica Brown", 
        phoneNumber: "(555) 789-0123", 
        email: "j.brown@example.com",
        preferredContactMethod: "phone"
      },
    };
    
    return patients[patientId] || { 
      patientId, 
      name: "Unknown Patient", 
      phoneNumber: "", 
      email: "",
      preferredContactMethod: "phone"
    };
  } catch (error) {
    console.error(`Failed to fetch patient details for ${patientId}:`, error);
    throw error;
  }
};

// Get follow-up tasks
export const fetchFollowUpTasks = async (): Promise<FollowUpTask[]> => {
  try {
    // In production: return await fetchWithAuth('/followup-tasks');
    
    // Mock data for development
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
    
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);
    const dayAfterFormatted = dayAfter.toISOString().split('T')[0];
    
    return [
      { 
        id: "1", 
        patientId: "P1001",
        patientName: "Sarah Johnson", 
        followUpType: "cancellation", 
        dueDate: today, 
        status: "pending", 
        priority: "high",
        contactInfo: "(555) 123-4567",
        notes: "Patient requested a call back to reschedule.",
        appointmentId: "1"
      },
      { 
        id: "2", 
        patientId: "P1002",
        patientName: "Michael Chen", 
        followUpType: "reschedule", 
        dueDate: today, 
        status: "pending", 
        priority: "medium",
        contactInfo: "(555) 987-6543",
        notes: "Patient needs to reschedule due to work conflict.",
        appointmentId: "2"
      },
      { 
        id: "3", 
        patientId: "P1003",
        patientName: "Emily Williams", 
        followUpType: "treatment", 
        dueDate: today, 
        status: "completed", 
        priority: "medium",
        contactInfo: "(555) 456-7890",
        notes: "Called to check on recovery after wisdom tooth extraction."
      },
      { 
        id: "4", 
        patientId: "P1004",
        patientName: "David Taylor", 
        followUpType: "payment", 
        dueDate: tomorrowFormatted, 
        status: "pending", 
        priority: "high",
        contactInfo: "(555) 321-6547",
        notes: "Outstanding balance of $450 - needs to discuss payment plan."
      },
      { 
        id: "5", 
        patientId: "P1005",
        patientName: "Jessica Brown", 
        followUpType: "cancellation", 
        dueDate: today, 
        status: "cancelled", 
        priority: "low",
        contactInfo: "(555) 789-0123",
        notes: "Appointment cancelled due to illness.",
        appointmentId: "5"
      },
      { 
        id: "6", 
        patientId: "P1006",
        patientName: "Robert Martinez", 
        followUpType: "treatment", 
        dueDate: tomorrowFormatted, 
        status: "pending", 
        priority: "medium",
        contactInfo: "(555) 234-5678",
        notes: "Follow up on crown placement."
      },
      {
        id: "7",
        patientId: "P1007",
        patientName: "Amanda Lewis",
        followUpType: "treatment",
        dueDate: dayAfterFormatted,
        status: "pending",
        priority: "medium",
        contactInfo: "(555) 876-5432",
        notes: "Check healing after extraction"
      },
      {
        id: "8",
        patientId: "P1008",
        patientName: "Thomas Garcia",
        followUpType: "payment",
        dueDate: dayAfterFormatted,
        status: "pending",
        priority: "high",
        contactInfo: "(555) 345-6789",
        notes: "Discussing insurance claim rejection"
      }
    ];
  } catch (error) {
    console.error("Failed to fetch follow-up tasks:", error);
    throw error;
  }
};

// Create a new follow-up task
export const createFollowUpTask = async (task: Omit<FollowUpTask, "id">): Promise<FollowUpTask> => {
  try {
    // In production, this would call the actual API
    // return await fetchWithAuth('/followup-tasks', {
    //   method: 'POST',
    //   body: JSON.stringify(task)
    // });
    
    // Mock response for development
    const newId = Math.floor(Math.random() * 1000).toString();
    return {
      id: newId,
      ...task
    };
  } catch (error) {
    console.error("Failed to create follow-up task:", error);
    throw error;
  }
};

// Update a follow-up task
export const updateFollowUpTask = async (taskId: string, updates: Partial<FollowUpTask>): Promise<FollowUpTask> => {
  try {
    // In production: return await fetchWithAuth(`/followup-tasks/${taskId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify(updates)
    // });
    
    // Mock response for development
    return {
      id: taskId,
      patientId: updates.patientId || "unknown",
      patientName: updates.patientName || "Unknown",
      followUpType: updates.followUpType || "other",
      dueDate: updates.dueDate || new Date().toISOString().split('T')[0],
      status: updates.status || "pending",
      priority: updates.priority || "medium",
      contactInfo: updates.contactInfo || "",
      notes: updates.notes || "",
      ...updates
    };
  } catch (error) {
    console.error(`Failed to update follow-up task ${taskId}:`, error);
    throw error;
  }
};

// Contact patient (phone or email)
export const contactPatient = async (patientId: string, method: 'phone' | 'email'): Promise<boolean> => {
  try {
    // In production: return await fetchWithAuth(`/patients/${patientId}/contact`, {
    //   method: 'POST',
    //   body: JSON.stringify({ method })
    // });
    
    // Mock response for development
    console.log(`Contacting patient ${patientId} via ${method}`);
    return true;
  } catch (error) {
    console.error(`Failed to contact patient ${patientId} via ${method}:`, error);
    throw error;
  }
};

// Get stats for the dashboard
export const fetchDashboardStats = async () => {
  try {
    // In production: return await fetchWithAuth('/dashboard/stats');
    
    // Mock data for development
    return {
      todaysFollowUps: 12,
      pendingFollowUps: 4,
      completedFollowUps: 8,
      nextDayCancellations: 5,
      urgentTasks: 3
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

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats
  });
}

export function useCreateFollowUpTask() {
  return useMutation({
    mutationFn: createFollowUpTask,
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      // This would be implemented with a QueryClient in the actual code
    }
  });
}

export function useUpdateFollowUpTask() {
  return useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string, updates: Partial<FollowUpTask> }) => 
      updateFollowUpTask(taskId, updates),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
    }
  });
}

export function useContactPatient() {
  return useMutation({
    mutationFn: ({ patientId, method }: { patientId: string, method: 'phone' | 'email' }) => 
      contactPatient(patientId, method)
  });
}
