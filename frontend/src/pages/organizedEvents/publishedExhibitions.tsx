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
import { useEffect } from "react";
import { useState } from "react";
import { supabase } from '@/config/supabase';
import { fetchGet } from "@/utils/fetchUtils";

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
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Objavljene izložbe</h1>
        {loading ? (
          <p>Učitavanje...</p>
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
      </MainColumn>
    </PageLayout>
  );
}