import { useAuth } from "@/components/context/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { membershipPlanToModel, type MembershipPlan } from "@/models/membershipModel";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { PayPalButtons } from "@paypal/react-paypal-js";
import type { OnApproveData } from "@paypal/paypal-js"
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { cn } from "@/utils/styleUtils";

export default function PurchaseMembership() {
  const { planId } = useParams();
  const { token } = useAuth();

  const [data, setData] = useState<MembershipPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [needs_membership, setNeedsMembership] = useState(true)

  useEffect(() => {
    setIsLoading(true);
    fetchGet(`/memberships/${planId}`, { "Authorization": `Bearer ${token}` })
      .then((res: any) => {
        setData(membershipPlanToModel(res.data));
        setNeedsMembership(res.needs_membership)
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="flex flex-col lg:flex-row flex-1 justify-center items-center gap-4 lg:gap-10">
      {isLoading &&
        <div className="flex flex-col items-center gap-2">
          <Spinner className="size-10 stroke-primary" />
          <p className="animate-pulse">Učitavanje članskog paketa</p>
        </div>
      }
      {error && !isLoading &&
        <div className="text-lg font-semibold text-destructive">
          {error}
        </div>
      }
      {
        !isLoading && !error && data &&
        <div className="flex w-full justify-center">
          <PurchasePlanWidget membershipPlan={data} needs_membership={needs_membership} />
        </div>
      }
    </div>
  )
}

type PurchasePlanWidgetProps = {
  membershipPlan: MembershipPlan,
  needs_membership: boolean
}

function PurchasePlanWidget({
  membershipPlan, needs_membership
}: PurchasePlanWidgetProps) {
  const { token } = useAuth();
  const { id, name, price, durationMonths } = membershipPlan;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null)


  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + durationMonths);
  console.log(needs_membership)
  async function handleCreateOrder() {
    setIsLoading(true);
    let order;
    try {
      order = await fetchPost<{ id: string }>("/api/paypal/create-order/membership", {
        membershipPlanId: id
      });
    } finally {
      setIsLoading(false);
    }
    return order?.id ?? null;
  }

  async function handleApproveOrder(data: OnApproveData) {
    setIsLoading(true);
    try {
      await fetchPost<{ success: boolean }>("/api/paypal/capture-order/membership", {
        orderId: data.orderID,
        membershipPlanId: id
      }, {
        Authorization: `Bearer ${token}`
      }
      );
      setPaymentSuccess(true)
    } catch (err) {
      console.error(err);
      setPaymentSuccess(false)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="flex w-full max-w-5xl border-none px-4 py-8">
      <CardHeader className="flex justify-between">
        <div className="space-y-4">
          <Badge className="text-lg px-4">{name}</Badge>
          <CardTitle className="text-3xl font-extrabold">
            {price.toFixed(2)} EUR
          </CardTitle>
          <CardDescription className="text-base [&_span]:text-primary [&_span]:font-bold">
            <div>
              Vrijedi od&nbsp;
              <span>{startDate.toLocaleDateString().replace(" ", "")}</span>&nbsp;do&nbsp;
              <span>{endDate.toLocaleDateString().replace(" ", "")}</span>
            </div>
          </CardDescription>
        </div>
        <div className={cn("flex flex-col w-[200px] h-full", isLoading && "items-center justify-center")}>
          {
            isLoading &&
            <Spinner className="size-6 stroke-muted-foreground" />
          }
          <div className={cn(isLoading && "hidden")}>
            {(paymentSuccess != true && needs_membership) && (
              <PayPalButtons
                createOrder={handleCreateOrder}
                onApprove={handleApproveOrder}
              />
            )}

            {paymentSuccess == true && (
              <p className="mt-3 text-green-600 font-medium text-sm pt-7">Plaćanje uspješno! Vaše članstvo je aktivno.</p>
            )}
            {paymentSuccess == false && (
              <p className="mt-3 text-red-600 font-medium text-sm pt-7">Plaćanje neuspješno, probajte ponovno</p>
            )}
            {needs_membership == false && (
              <p className="mt-3 text-red-600 font-medium text-sm pt-7">Već imate aktivnu članarinu</p>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
