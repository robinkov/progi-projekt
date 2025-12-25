import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

type BriefCardProps = {
  timeFrom: string;
  timeTo: string;
  date: string;
  title: string;
  name: string;
  place: string;
}

export default function BriefCard({
  date, title, name, place, timeFrom, timeTo
}: BriefCardProps) {
  return (
    <Card className="gap-3 min-w-[300px] w-[300px] duration-200 shadow-sm hover:shadow-lg hover:-translate-y-0.5">
      <CardHeader>
        { timeTo ? <h2 className="font-semibold">{timeFrom} - {timeTo}</h2>
        : <h2 className="font-semibold">{timeFrom}</h2>}
        <p className="text-xs">{date}</p>
      </CardHeader>
      <CardContent>
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-xs">{name}</p>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">{place}</p>
      </CardFooter>
    </Card>
  );
}
