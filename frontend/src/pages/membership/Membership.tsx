import MembershipCard from "@/components/app/MembershipCard";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";
import { membershipPlanToModel, type MembershipPlan } from "@/models/membershipModel";
import { fetchGet } from "@/utils/fetchUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Membership() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>();

  useEffect(() => {
    setIsLoading(true);
    fetchGet("/memberships", { "Authorization": `Bearer ${token}` })
      .then((res: any) => {
        let data = res["data"] as any[];
        let membershipPlans = data.map((plan) => membershipPlanToModel(plan)) as MembershipPlan[];
        setMembershipPlans(membershipPlans);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col lg:flex-row flex-1 justify-center items-center gap-4 lg:gap-10">
      { isLoading &&
        <div className="flex flex-col items-center gap-2">
          <Spinner className="size-10 stroke-primary" />
          <p className="animate-pulse">Učitavanje članskih paketa</p>
        </div>
      }
      { !isLoading && membershipPlans?.map((plan) => (
        <MembershipCard
          key={plan.id}
          title={plan.name}
          description={plan.description}
          numberOfMonths={plan.durationMonths}
          price={plan.price}
          className={plan.id === 2 ? "lg:scale-110" : ""}
          callback={() => navigate(`/membership/${plan.id}`)}
        />
      )) }
    </div>
  );
}
