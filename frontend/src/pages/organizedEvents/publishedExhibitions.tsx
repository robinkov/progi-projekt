import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import { computeEventStatus } from "@/utils/statusUtils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Exhibition = {
  id: number;
  date: string; // DD.MM
  time?: string; // "HH:mm" or "HH:mm – HH:mm"
  title: string;
  organizer: string;
  location?: string;
};

const mockPublished: Exhibition[] = [
  { id: 1, date: "14.12", time: "18:00 – 20:00", title: "Keramika u pokretu", organizer: "ClayPlay", location: "Zagreb, Centar" },
  { id: 2, date: "18.12", time: "19:30 – 21:00", title: "Suvremena glina", organizer: "Galerija Forma", location: "Split" },
  { id: 3, date: "22.12", title: "Minimalističke forme", organizer: "Studio Terra", location: "Online" },
];

export default function PublishedExhibitions() {
  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Objavljene izložbe</h1>
        <Table>
          <TableCaption>Popis objavljenih izložbi</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Datum</TableHead>
              <TableHead>Vrijeme</TableHead>
              <TableHead>Naziv</TableHead>
              <TableHead>Organizator</TableHead>
              <TableHead>Lokacija</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPublished.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.date}</TableCell>
                <TableCell>{e.time ?? "-"}</TableCell>
                <TableCell>
                  <span className="truncate inline-block max-w-[300px] align-middle">{e.title}</span>
                </TableCell>
                <TableCell>{e.organizer}</TableCell>
                <TableCell className="text-muted-foreground">{e.location}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" disabled>
                    {computeEventStatus(e.date, e.time)}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </MainColumn>
    </PageLayout>
  );
}