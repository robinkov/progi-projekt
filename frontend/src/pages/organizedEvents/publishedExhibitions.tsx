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
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/config/supabase";
import { fetchGet } from "@/utils/fetchUtils";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";

type Exhibition = {
  id: number;
  date: string; // DD.MM
  time?: string; // "HH:mm" or "HH:mm – HH:mm"
  title: string;
  location?: string;
};

export default function PublishedExhibitions() {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {

    async function loadExhibitions() {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          console.error("Not logged in");
          setLoading(false);
          return;
        }

        const token = sessionData.session.access_token;

        const res = await fetchGet<{ success: boolean; exhibitions: Exhibition[] }>(
          "/exhibitions/my",
          { Authorization: `Bearer ${token}` }
        );

        if (res.success) setExhibitions(res.exhibitions);
      } catch (err) {
        console.error("Failed to fetch exhibitions", err);
      } finally {
        setLoading(false);
      }
    }

    loadExhibitions();
  }, []);
  return (
    <div className="w-full">
      <div>
        <h1 className="text-2xl font-semibold mb-6">Objavljene izložbe</h1>
        {loading ? (
          <p>Učitavanje...</p>
        ) : exhibitions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Nema objavljenih izložbi</EmptyTitle>
              <EmptyDescription>
                Trenutno nema objavljenih izložbi za prikaz.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="link" onClick={() => navigate("/create-event/exhibition")}>
                Kreiraj izložbu
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <Table>
            <TableCaption>Popis objavljenih izložbi</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Datum</TableHead>
                <TableHead>Vrijeme</TableHead>
                <TableHead>Naziv</TableHead>
                <TableHead>Lokacija</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exhibitions.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.date.substring(0, 9)}</TableCell>
                  <TableCell>{e.time ?? "-"}</TableCell>
                  <TableCell>
                    <span className="truncate inline-block max-w-[300px] align-middle">{e.title}</span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{e.location}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" disabled>
                      {computeEventStatus(e.date, e.time)}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>)}
      </div>
    </div>
  );
}