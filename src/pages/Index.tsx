
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { OfficeManagerDashboard, DashboardSection } from "@/components/OfficeManagerDashboard";

const Index = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const section = (searchParams.get('section') || 'followups') as DashboardSection;

  return (
    <Layout>
      <OfficeManagerDashboard initialSection={section} />
    </Layout>
  );
};

export default Index;
