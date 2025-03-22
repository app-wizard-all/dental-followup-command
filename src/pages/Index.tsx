
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { OfficeManagerDashboard, DashboardSection } from "@/components/OfficeManagerDashboard";
import { ProviderDashboard, ProviderSection } from "@/components/ProviderDashboard";

const Index = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const section = searchParams.get('section');
  const role = searchParams.get('role') || 'officeManager';

  return (
    <Layout>
      {role === 'provider' ? (
        <ProviderDashboard initialSection={section as ProviderSection} />
      ) : (
        <OfficeManagerDashboard initialSection={section as DashboardSection} />
      )}
    </Layout>
  );
};

export default Index;
