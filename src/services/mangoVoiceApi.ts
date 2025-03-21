
import { supabase } from "@/integrations/supabase/client";

// MangoVoice API Types
interface MangoVoiceCallResponse {
  success: boolean;
  callId?: string;
  message?: string;
  error?: string;
}

// Get the API key from Supabase
const getMangoVoiceApiKey = async (): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('value')
      .eq('name', 'MANGOVOICE_API_KEY')
      .single();
      
    if (error) {
      console.error("Failed to fetch MangoVoice API key:", error);
      throw new Error("API key not found");
    }
    
    return data.value;
  } catch (error) {
    console.error("Error retrieving MangoVoice API key:", error);
    throw error;
  }
};

// Initialize a call through MangoVoice API
export const initiateCall = async (phoneNumber: string): Promise<MangoVoiceCallResponse> => {
  try {
    // Clean the phone number (remove any non-numeric characters)
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    if (!cleanedPhoneNumber || cleanedPhoneNumber.length < 10) {
      return { 
        success: false, 
        error: "Invalid phone number format" 
      };
    }

    // Get the API key
    const apiKey = await getMangoVoiceApiKey();
    
    // Call the MangoVoice API
    const response = await fetch('https://api.mangovoice.com/v1/call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        destinationNumber: cleanedPhoneNumber,
        // Assuming the call should be initiated from the agent's desk phone
        useAgentDeskPhone: true
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("MangoVoice API error:", data);
      return {
        success: false,
        error: data.message || "Failed to initiate call"
      };
    }
    
    // Log the call attempt to the database
    await supabase.from('call_logs').insert({
      phone_number: cleanedPhoneNumber,
      call_time: new Date().toISOString(),
      call_id: data.callId,
      status: 'initiated'
    });
    
    return {
      success: true,
      callId: data.callId,
      message: "Call initiated successfully"
    };
  } catch (error) {
    console.error("Error initiating MangoVoice call:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
