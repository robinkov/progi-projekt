import MembershipCard, { AdminMembershipCard } from "@/components/app/MembershipCard";
import { useAuth } from "@/components/context/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { membershipPlanToModel, type MembershipPlan } from "@/models/membershipModel";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { cn } from "@/utils/styleUtils";
import { formatMillisToRemainingTime } from "@/utils/timeUtils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function Membership() {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>();
  const [currentPlan, setCurrentPlan] = useState<MembershipPlan | null>(null);
  const [planPurchaseDate, setPlanPurchaseDate] = useState<Date | null>(null);
  const [membershipPrices, setMembershipPrices] = useState<number[]>([]);

  useEffect(() => {
    setIsLoading(true);

    if (user?.role === "organizer") {
      fetchGet("/memberships/active", { "Authorization": `Bearer ${token}` })
        .then((res: any) => {
          let data = res["data"] as any;
          if (data) {
            setCurrentPlan(membershipPlanToModel(data));
            setPlanPurchaseDate(new Date(data["transaction_date"]))
            return Promise.reject(); // skip to finally
          }
          return fetchGet("/memberships", { "Authorization": `Bearer ${token}` });
        })
        .then((res: any) => {
          let data = res["data"] as any[];
          let membershipPlans = data.map((plan) => membershipPlanToModel(plan)) as MembershipPlan[];
          setMembershipPlans(membershipPlans);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      fetchGet("/memberships", { "Authorization": `Bearer ${token}` })
        .then((res: any) => {
          let data = res["data"] as any[];
          let membershipPlans = data.map((plan) => membershipPlanToModel(plan)) as MembershipPlan[];
          setMembershipPlans(membershipPlans);
          setMembershipPrices(membershipPlans.sort((planA, planB) => planA.id - planB.id).map((plan) => plan.price));
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    console.log(membershipPrices)
  }, [membershipPrices]);

  function goToMembership(planId: number) {
    navigate(`/membership/${planId}`);
  }

  function savePriceChange(planId: number, price: number) {
    setIsLoading(true);
    fetchPost("/memberships/update",
      { planId: planId, price: price },
      { "Authorization": `Bearer ${token}` }
    )
    .then(() => location.reload())
    .catch((err) => alert(err))
    .finally(() => setIsLoading(false));
  }

  return (
    <div className={cn(
      "flex flex-col lg:flex-row flex-1 justify-center items-center gap-4",
      user?.role !== "admin" && "lg:gap-10"
      )}
    >
      { isLoading &&
        <div className="flex flex-col items-center gap-2">
          <Spinner className="size-10 stroke-primary" />
          <p className="animate-pulse">Učitavanje članskih paketa</p>
        </div>
      }
      {
        !isLoading && currentPlan && planPurchaseDate &&
        <CurrentActivePlanWidget membership={currentPlan} planPurchaseDate={planPurchaseDate} />
      }
      { !isLoading && membershipPlans?.sort((planA, planB) => planA.id - planB.id).map((plan) => {
          const MemCard = user?.role === "admin" ? AdminMembershipCard : MembershipCard;
          const cardCallback = () => user?.role === "admin" ?
            savePriceChange(plan.id, membershipPrices[plan.id - 1]) :
            goToMembership(plan.id);
          return (
            <MemCard
              key={plan.id}
              title={plan.name}
              description={plan.description}
              numberOfMonths={plan.durationMonths}
              price={membershipPrices[plan.id - 1]}
              priceSetter={(price) => {
                const newPrices = [...membershipPrices];
                newPrices[plan.id - 1] = price;
                setMembershipPrices(newPrices);
              }}
              className={plan.id === 2 && user?.role !== "admin" ? "lg:scale-110" : ""}
              callback={cardCallback}
            />
          )
        })
      }
    </div>
  );
}

type CurrentActivePlanWidgetProps = {
  membership: MembershipPlan,
  planPurchaseDate: Date
}

function CurrentActivePlanWidget({
  membership, planPurchaseDate
}: CurrentActivePlanWidgetProps) {

  const durationMonthsMillis = membership.durationMonths * 30 * 86400 * 1000;
  const expiryDateMs = new Date(planPurchaseDate).getTime() + durationMonthsMillis;
  
  const remainingTime = expiryDateMs - Date.now();
  const remainingTimeFormatted = formatMillisToRemainingTime(remainingTime);

  return (
    <Card className="w-full max-w-[650px]">
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Badge>Aktivan</Badge>
          <div>
            <h1 className="text-2xl font-bold">{ membership.name }</h1>
            <p className="text-sm">{ membership.description }</p>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-muted-foreground">
            Preostalo:&nbsp;
            <span className="text-primary font-semibold">
              {remainingTimeFormatted}
            </span>
          </p>
          <Progress value={(remainingTime / durationMonthsMillis) * 100} />
        </div>
      </CardContent>
    </Card>
  );
}
