import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGet } from "@/utils/fetchUtils";
import { supabase } from "@/config/supabase";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

// ==================== end of imports ====================

type Exhibition = {
  id: number;
  date: string;
  time?: string;
  title: string;
  organizer: string;
  location?: string;
  status: string
};

type GetRegistrationsResponse = {
  success: boolean
  exhibitions: Exhibition[]
}


export default function RegisteredExhibitions() {
  const [rows, setRows] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadRegistrations() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      try {
        const res = await fetchGet<GetRegistrationsResponse>("/getregistrations", {
          Authorization: `Bearer ${data.session.access_token}`,
        })
        if (res.success) {
          setRows(res.exhibitions)
          console.log(res.exhibitions)
        }

      }
      catch (err) {
        console.error("Failed to load exhibitions", err);
      } finally {
        setLoading(false);
      }
    }

    loadRegistrations()
  }, [])

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-6">Prijavljene izložbe</h1>
        {loading ? (
          <div>Učitavanje radionica...</div>
        ) : rows.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Nema prijavljenih izložbi</EmptyTitle>
              <EmptyDescription>Trenutno nema prijavljenih izložbi za prikaz.</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="link" onClick={() => {navigate("/exhibitions")}}>
                Pregledaj izložbe
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
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
              {rows.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.date.substring(0, 9)}</TableCell>
                  <TableCell>{e.time ?? "-"}</TableCell>
                  <TableCell>
                    <span className="truncate inline-block max-w-[300px] align-middle">{e.title}</span>
                  </TableCell>
                  <TableCell>{e.organizer}</TableCell>
                  <TableCell className="text-muted-foreground">{e.location}</TableCell>
                  {e.status == "ODOBRENO" ?
                    (
                      <TableCell className="text-right  text-green-600">
                        {e.status}
                      </TableCell>) :
                    (
                      <TableCell className="text-right">
                        {e.status}
                      </TableCell>
                    )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
    </div>
  );
}
