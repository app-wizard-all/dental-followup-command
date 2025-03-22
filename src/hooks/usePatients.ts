
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Patient {
  id: string;
  name: string;
  phoneNumber?: string;
  email?: string;
}

export function usePatients(fromDate: Date, toDate: Date) {
  const [patients, setPatients] = useState<Patient[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        // Format dates for the query
        const fromDateStr = fromDate.toISOString().split('T')[0];
        const toDateStr = toDate.toISOString().split('T')[0];
        
        // In a real application, you would fetch scheduled patients for the date range
        // For demo purposes, we'll fetch all patients from the patients table
        const { data, error } = await supabase
          .from('patients')
          .select('id, name, phone_number, email')
          .order('name');
        
        if (error) throw error;
        
        // Map the data to our interface
        const mappedPatients = data.map(p => ({
          id: p.id,
          name: p.name,
          phoneNumber: p.phone_number,
          email: p.email
        }));
        
        setPatients(mappedPatients);
      } catch (err) {
        console.error("Error fetching patients:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, [fromDate, toDate]);

  return { patients, isLoading, error };
}
