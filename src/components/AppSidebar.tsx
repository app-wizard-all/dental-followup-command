import { 
  Calendar, 
  Users, 
  PackageOpen, 
  DollarSign,
  Settings, 
  Home,
  CheckSquare,
  PlusCircle,
  HelpCircle,
  FileText
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useNavigate, useLocation } from "react-router-dom";
import { DashboardSection } from "./OfficeManagerDashboard";
import { ProviderSection } from "./ProviderDashboard";

const officeManagerItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    section: null, // Dashboard has no section parameter
  },
  {
    title: "Add Task",
    url: "/add-task",
    icon: PlusCircle,
    section: null,
  },
  {
    title: "Follow Ups",
    url: "/?section=followups",
    icon: CheckSquare,
    section: "followups" as DashboardSection,
  },
  {
    title: "Inventory",
    url: "/?section=inventory",
    icon: PackageOpen,
    section: "inventory" as DashboardSection,
  },
  {
    title: "Staff Management",
    url: "/?section=staff",
    icon: Users,
    section: "staff" as DashboardSection,
  },
  {
    title: "Billing & Accounting",
    url: "/?section=billing",
    icon: DollarSign,
    section: "billing" as DashboardSection,
  },
  {
    title: "Help Guide",
    url: "/help-guide",
    icon: HelpCircle,
    section: null,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const providerItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    section: null,
  },
  {
    title: "Patient Notes",
    url: "/?section=patientNotes",
    icon: FileText,
    section: "patientNotes" as ProviderSection,
  },
  {
    title: "Help Guide",
    url: "/help-guide",
    icon: HelpCircle,
    section: null,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentSection = searchParams.get('section');
  const userRole = searchParams.get('role') || 'officeManager';
  const isOnMainDashboard = location.pathname === "/" && !searchParams.has('section');
  const isOnAddTask = location.pathname === "/add-task";
  const isOnHelpGuide = location.pathname === "/help-guide";

  const items = userRole === 'provider' ? providerItems : officeManagerItems;

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, url: string, section?: DashboardSection | ProviderSection | null) => {
    e.preventDefault();
    
    const newSearchParams = new URLSearchParams();
    if (userRole) {
      newSearchParams.set('role', userRole);
    }
    
    if (url === "/" && section === null) {
      navigate(`/?${newSearchParams.toString()}`);
    } else if (url === "/add-task") {
      navigate(`/add-task?${newSearchParams.toString()}`);
    } else if (url === "/help-guide") {
      navigate(`/help-guide?${newSearchParams.toString()}`);
    } else if (section) {
      newSearchParams.set('section', section);
      navigate(`/?${newSearchParams.toString()}`);
    } else {
      if (url.startsWith('/')) {
        navigate(`${url}?${newSearchParams.toString()}`);
      } else {
        navigate(url);
      }
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-center py-4">
          <svg className="w-8 h-8 text-dental-teal" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C7.59 2 4 5.59 4 10c0 2.29.94 4.38 2.47 5.89L12 21.42l5.53-5.53C19.06 14.38 20 12.29 20 10c0-4.41-3.59-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
              fill="currentColor"
            />
          </svg>
          <span className="ml-2 text-lg font-bold text-dental-gray">DentalTrack</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{userRole === 'provider' ? 'Provider' : 'Management'}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.url} 
                      className={`${
                        (item.title === "Dashboard" && isOnMainDashboard) || 
                        (item.section && item.section === currentSection) ||
                        (item.title === "Add Task" && isOnAddTask) ||
                        (item.title === "Help Guide" && isOnHelpGuide)
                          ? "bg-dental-mint/50 text-dental-teal" 
                          : ""
                      }`}
                      onClick={(e) => handleNavigation(e, item.url, item.section)}
                    >
                      <item.icon className={`${
                        (item.title === "Dashboard" && isOnMainDashboard) || 
                        (item.section && item.section === currentSection) ||
                        (item.title === "Add Task" && isOnAddTask) ||
                        (item.title === "Help Guide" && isOnHelpGuide)
                          ? "text-dental-teal" 
                          : "text-dental-gray"
                      }`} />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4 text-sm text-muted-foreground">
          <p className="text-center">DentalTrack v1.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
