
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { OfficeManagerDashboard, DashboardSection } from "@/components/OfficeManagerDashboard";

const Index = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const section = searchParams.get('section') as DashboardSection | null;

  return (
    <Layout>
      <OfficeManagerDashboard initialSection={section || "followups"} />
    </Layout>
  );
};

export default Index;
