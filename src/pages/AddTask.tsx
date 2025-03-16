
import React from "react";
import { Layout } from "@/components/Layout";
import { TaskForm } from "@/components/TaskForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleTaskFormSave = () => {
    toast({
      title: "Task created",
      description: "Follow-up task has been created successfully",
    });
    
    // Navigate to the Follow-ups section after creating a task
    navigate("/?section=followups");
  };

  return (
    <Layout>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Follow-Up Task</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm onSave={handleTaskFormSave} />
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AddTask;
