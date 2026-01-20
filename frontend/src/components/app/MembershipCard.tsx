import { Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { cn } from "@/utils/styleUtils";
import { Input } from "../ui/input";

type MembershipCardProps = React.ComponentProps<"div"> & {
  title: string;
  description: string;
  price: number;
  numberOfMonths: number;
  priceSetter: (price: number) => void;
  callback?: () => void;
}

export default function MembershipCard({
  title, description, price, priceSetter, numberOfMonths, callback, ...rest
}: MembershipCardProps) {

  return (
    <Card className={cn("flex flex-col w-[300px]", rest.className)}>
      <CardHeader>
        <CardTitle className="text-2xl">{ title }</CardTitle>
        <CardDescription className="h-16">{ description }</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-2xl">
                €{ (price / numberOfMonths).toFixed(2) }
              </h1>
              <p className="text-xs text-muted-foreground">/mjesečno</p>
            </div>
            <p className="text-xs text-muted-foreground/80">Naplaćuje se { price } EUR jednokratno.</p>
          </div>
          <ul className="[&_svg]:stroke-primary [&_svg]:size-6 [&_p]:text-sm [&_li]:flex [&_li]:items-center [&_li]:gap-2">
            <li><Check /><p>Upravljanje radionicama</p></li>
            <li><Check /><p>Organizacija izložbi</p></li>
            <li><Check /><p>Prodaja proizvoda na webshopu</p></li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={callback}
          className="w-full text-center"
        >
          Odaberi
        </Button>
      </CardFooter>
    </Card>
  );
}

export function AdminMembershipCard({
  title, description, price, priceSetter, numberOfMonths, callback, ...rest
}: MembershipCardProps) {
  return (
    <Card className={cn("flex flex-col w-[300px]", rest.className)}>
      <CardHeader>
        <CardTitle className="text-2xl">{ title }</CardTitle>
        <CardDescription className="h-16">{ description }</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Input className="w-20 font-semibold " value={price} onChange={(e) => priceSetter(e.target.value ? parseInt(e.target.value) : 0)} />
              <h1 className="font-semibold text-base">
                EUR
              </h1>
            </div>
            <p className="text-xs text-muted-foreground/80">Naplaćuje se €{ (price / numberOfMonths).toFixed(2) }/mjesečno</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={callback}
          className="w-full text-center"
        >
          Spremi
        </Button>
      </CardFooter>
    </Card>
  );
}
