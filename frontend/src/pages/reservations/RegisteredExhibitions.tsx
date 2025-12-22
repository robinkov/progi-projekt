import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
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
  date: string;
  time?: string;
  title: string;
  organizer: string;
  location?: string;
};

const mockRegistered: Exhibition[] = [
  { id: 1, date: "14.12", time: "18:00", title: "Keramika u pokretu", organizer: "ClayPlay", location: "Zagreb, Centar" },
  { id: 2, date: "18.12", time: "19:30", title: "Suvremena glina", organizer: "Galerija Forma", location: "Split" },
  { id: 3, date: "22.12", title: "Minimalističke forme", organizer: "Studio Terra", location: "Online" },
];

export default function RegisteredExhibitions() {
  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Prijavljene izložbe</h1>

        <Table>
          <TableCaption>Popis prijavljenih izložbi.</TableCaption>
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
            {mockRegistered.map((e) => (
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
                    PRIJAVLJENO
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
