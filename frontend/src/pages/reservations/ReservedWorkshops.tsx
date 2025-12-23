import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { computeEventStatus, isCancellationAllowed } from "@/utils/statusUtils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ==================== end of imports ====================

type Workshop = {
  id: number;
  date: string;
  time?: string;
  title: string;
  instructor: string;
  location?: string;
};

const mockReserved: Workshop[] = [
  { id: 1, date: "17.12.25", time: "10:00 – 12:30", title: "Lonci", instructor: "Mihael Ivanković", location: "Brezevica" },
  { id: 2, date: "04.01.26", time: "20:30 – 21:30", title: "Vaze", instructor: "Katerina B.", location: "Zagreb, Zapad" },
  { id: 3, date: "10.01.26", time: "17:00 – 19:00", title: "Skulptura", instructor: "Ana Perić", location: "Online" },
];

export default function ReservedWorkshops() {
  const [rows, setRows] = useState<Workshop[]>(mockReserved);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const cancelReservation = (id: number) => {
    setRows((prev) => prev.filter((w) => w.id !== id));
    setShowConfirmation(true);
    // TODO: Pozvati backend za stvarno otkazivanje rezervacije
  };

  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Rezervirane radionice</h1>

        <Table>
          <TableCaption>Popis tvojih rezerviranih radionica.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Datum</TableHead>
              <TableHead>Vrijeme</TableHead>
              <TableHead>Naziv</TableHead>
              <TableHead>Instruktor</TableHead>
              <TableHead>Lokacija</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Akcija</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-medium">{w.date.substring(0, 5)}</TableCell>
                <TableCell>{w.time}</TableCell>
                <TableCell>
                  <span className="truncate inline-block max-w-[300px] align-middle">{w.title}</span>
                </TableCell>
                <TableCell>{w.instructor}</TableCell>
                <TableCell className="text-muted-foreground">{w.location}</TableCell>
                <TableCell>{computeEventStatus(w.date, w.time)}</TableCell>
                <TableCell className="text-right">
                  {isCancellationAllowed(w.date, w.time) ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">OTKAŽI</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Želiš li otkazati rezervaciju?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ova radnja se ne može poništiti. Otkazat ćeš rezervaciju radionice "{w.title}"
                            zakazane za {w.date}{w.time ? ` u ${w.time}` : ""}. Radionicu više nećeš moći ponovno prijaviti.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Odustani</AlertDialogCancel>
                          <AlertDialogAction onClick={() => cancelReservation(w.id)}>Potvrdi</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <span className="inline-block">
                          <Button variant="destructive" size="sm" disabled>OTKAŽI</Button>
                        </span>
                      </HoverCardTrigger>
                      <HoverCardContent>
                        <p>Otkazivanje rezervacije moguće je najkasnije 48 sati prije početka radionice.</p>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Rezervacija je otkazana</AlertDialogTitle>
              <AlertDialogDescription>
                Vaša rezervacija za radionicu je uspješno otkazana.
                Dobit ćete potvrdu putem e-pošte.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowConfirmation(false)}>U redu</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MainColumn>
    </PageLayout>
  );
}
