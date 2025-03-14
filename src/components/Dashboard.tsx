
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Calendar, 
  CheckCircle, 
  Clock, 
  Phone, 
  Mail, 
  Search,
  AlertCircle,
  PlusCircle,
  Loader2
} from "lucide-react";
import { PatientsList } from "@/components/PatientsList";
import { StatCard } from "@/components/StatCard";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useDashboardStats, useTomorrowCancellations, useContactPatient } from "@/services/openDentalApi";

export function Dashboard() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: cancellations, isLoading: cancellationsLoading } = useTomorrowCancellations();
  const contactPatientMutation = useContactPatient();
  
  const handleCreateTask = () => {
    setIsTaskFormOpen(true);
  };
  
  const handleContactAll = (method: 'phone' | 'email') => {
    if (!cancellations || cancellations.length === 0) {
      toast({
        title: "No patients to contact",
        description: "There are no cancelled appointments to follow up on.",
      });
      return;
    }
    
    toast({
      title: method === 'phone' ? "Calling all patients" : "Emailing all patients",
      description: `Initiating bulk ${method === 'phone' ? 'calls' : 'emails'} to ${cancellations.length} patients`,
    });
    
    // In a real implementation, we would use Promise.all to contact all patients
    // and handle success/error for each one
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Today's Follow-ups" 
          value={statsLoading ? 0 : (stats?.todaysFollowUps || 0)} 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          description={statsLoading 
            ? "Loading..." 
            : `${stats?.pendingFollowUps || 0} pending, ${stats?.completedFollowUps || 0} completed`}
          bgColor="bg-green-50"
        />
        <StatCard 
          title="Next Day Cancellations" 
          value={cancellationsLoading ? 0 : (cancellations?.length || 0)} 
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          description="Needs follow-up" 
          bgColor="bg-amber-50"
        />
        <StatCard 
          title="Urgent Tasks" 
          value={statsLoading ? 0 : (stats?.urgentTasks || 0)} 
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
          description="High priority" 
          bgColor="bg-red-50"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Card className="w-full md:w-2/3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Patient Follow-ups</CardTitle>
              <CardDescription>Manage patient follow-up tasks</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <PlusCircle className="h-4 w-4" />
                    New Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Follow-Up Task</DialogTitle>
                  </DialogHeader>
                  <TaskForm onSave={() => {
                    setIsTaskFormOpen(false);
                    toast({
                      title: "Task created",
                      description: "Follow-up task has been created successfully",
                    });
                  }} />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients or tasks..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="mt-2">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Tasks</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <TaskList filter="all" searchQuery={searchQuery} />
              </TabsContent>
              <TabsContent value="pending">
                <TaskList filter="pending" searchQuery={searchQuery} />
              </TabsContent>
              <TabsContent value="completed">
                <TaskList filter="completed" searchQuery={searchQuery} />
              </TabsContent>
              <TabsContent value="cancelled">
                <TaskList filter="cancelled" searchQuery={searchQuery} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-dental-blue" />
              Next Day Cancellations
              {!cancellationsLoading && cancellations && cancellations.length > 0 && (
                <Badge variant="destructive" className="ml-2">{cancellations.length}</Badge>
              )}
            </CardTitle>
            <CardDescription>Patients who cancelled tomorrow's appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <PatientsList />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={() => handleContactAll('phone')}
              disabled={cancellationsLoading || !cancellations || cancellations.length === 0 || contactPatientMutation.isPending}
            >
              {contactPatientMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Phone className="h-4 w-4" />
              )}
              Call All
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={() => handleContactAll('email')}
              disabled={cancellationsLoading || !cancellations || cancellations.length === 0 || contactPatientMutation.isPending}
            >
              {contactPatientMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              Email All
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
