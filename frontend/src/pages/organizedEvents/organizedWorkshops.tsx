import { useEffect, useState } from "react";
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
import { fetchPost, fetchDelete } from "@/utils/fetchUtils";
import { supabase } from "@/config/supabase";
import ConfirmCard from "@/components/ui/cardConfirm";

type Workshop = {
  id: number;
  date: string;
  time?: string;
  title: string;
  organizer: string;
  location?: string;
};

export default function MyWorkshops() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmWorkshop, setConfirmWorkshop] = useState<Workshop | null>(null);

  useEffect(() => {
    async function loadWorkshops() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.error("Not logged in");
          setLoading(false);
          return;
        }

        const token = sessionData.session.access_token;

        const res = await fetchPost<{ success: boolean; workshops: Workshop[] }>(
          "/workshops/my",
          {},
          { Authorization: `Bearer ${token}` }
        );

        if (res.success) setWorkshops(res.workshops);
      } catch (err) {
        console.error("Failed to fetch workshops", err);
      } finally {
        setLoading(false);
      }
    }

    loadWorkshops();
  }, []);

  const handleDelete = async () => {
    if (!confirmWorkshop) return;

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;

    const token = sessionData.session.access_token;

    try {
      setDeletingId(confirmWorkshop.id);
      await fetchDelete(`/workshops/delete/${confirmWorkshop.id}`, {
        Authorization: `Bearer ${token}`,
      });
      setWorkshops((prev) => prev.filter((w) => w.id !== confirmWorkshop.id));
      setConfirmWorkshop(null);
    } catch (err) {
      console.error("Failed to delete workshop", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Moje radionice</h1>

        {loading ? (
          <p>Učitavanje...</p>
        ) : (
          <Table>
            <TableCaption>Popis mojih radionica</TableCaption>

            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Datum</TableHead>
                <TableHead>Vrijeme</TableHead>
                <TableHead>Naziv</TableHead>
                <TableHead>Lokacija</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Akcija</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {workshops.map((w) => {
                const status = computeEventStatus(w.date, w.time);
                const canCancel = status !== "u tijeku..." && status !== "završeno";

                return (
                  <TableRow key={w.id}>
                    <TableCell className="font-medium">{w.date.substring(0, 9)}</TableCell>
                    <TableCell>{w.time ?? "-"}</TableCell>
                    <TableCell>
                      <span className="truncate inline-block max-w-[300px] align-middle">{w.title}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{w.location ?? "-"}</TableCell>
                    <TableCell>{status}</TableCell>
                    <TableCell className="text-right">
                      {canCancel ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setConfirmWorkshop(w)}
                        >
                          Otkaži
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" disabled>
                          -
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </MainColumn>

      {confirmWorkshop && (
        <ConfirmCard
          title="Potvrdi brisanje radionice"
          message={`Za brisanje radionice morate upisati naziv radionice: "${confirmWorkshop.title}"`}
          confirmText={deletingId === confirmWorkshop.id ? "Brisanje..." : "Obriši"}
          expectedText={confirmWorkshop.title} // <-- workshop name here
          onCancel={() => setConfirmWorkshop(null)}
          onConfirm={handleDelete}
        />
      )}

    </PageLayout>
  );
}
