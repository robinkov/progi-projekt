import { useAuth } from "@/components/context/AuthProvider";
import { LoadingButton } from "@/components/ui/button";
import AuthController from "@/controllers/authController";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Header from "@/components/layout/Header"
import WorkshopsSection from "@/components/workshops/WorkshopsSection";
import ExhibitionsSection from './../../components/exhibitions/ExhibitionsSection';
import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import Sidebar from "@/components/layout/Sidebar";
import ShopSection from "@/components/shop/shopSection"

export default function Home() {
  const auth = useAuth();
  const navigate = useNavigate();

  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  async function handleLogout() {
    setLogoutLoading(true);
    AuthController.logoutUser()
      .catch((error: Error) => {
        alert(error.message);
      })
      .finally(() => {
        setLogoutLoading(false);
      });
  }

  useEffect(() => {
    if (auth.status === "unauthenticated") {
      navigate("/auth", { replace: true });
    }
  }, [auth.status]);

  return (
    <PageLayout
      header={
        <Header
          userEmail={auth.user?.email}
          onLogout={handleLogout}
          logoutLoading={logoutLoading}
        />
      }
    >
      <MainColumn>
        <div>
          <WorkshopsSection></WorkshopsSection>
        </div>
        <div><ExhibitionsSection></ExhibitionsSection></div>
        <div>
          <ShopSection></ShopSection>
        </div>
      </MainColumn>

      <Sidebar>
        <div>
          <LoadingButton><a href="mypage">My Reservations</a></LoadingButton>
        </div>
        <div>Notifications</div>
        <div><LoadingButton>Newsletter</LoadingButton></div>
      </Sidebar>
    </PageLayout>
  );

}
