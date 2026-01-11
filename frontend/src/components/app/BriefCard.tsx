import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/utils/styleUtils";
import { Calendar, Clock8, MapPin, User } from "lucide-react";

type BriefCardProps = React.ComponentProps<"div"> & {
  timeFrom: string;
  timeTo: string;
  date: string;
  title: string;
  name: string;
  place: string;
}

export default function BriefCard({
  date, title, name, place, timeFrom, timeTo, className, ref
}: BriefCardProps) {
  return (
    <Card
      ref={ref}
      className={cn("gap-3 w-[300px] duration-200", className)}
    >
      <CardHeader className="space-y-1">
        <div className="flex gap-2 items-center">
          <Clock8 className="size-4" />
          { timeTo ? <h2 className="font-semibold">{timeFrom} - {timeTo}</h2>
          : <h2 className="font-semibold">{timeFrom}</h2> }
        </div>
        <div className="flex gap-2 items-center">
          <Calendar className="size-4" />
          <p className="text-xs">{date}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-0.5">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="flex gap-2 items-center">
          <User className="size-4" />
          <p className="text-xs">{name ?? <i>Anonymous</i>}</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex gap-2">
          <MapPin className="size-4" />
          <p className="text-xs text-muted-foreground">{place}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
