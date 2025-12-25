import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingButton } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import { fetchPost } from "@/utils/fetchUtils";

/* ---------------- Types ---------------- */

type ExhibitionForm = {
  title: string;
  date_time: string;
  end_time: string;
  location: string;
  price: string;
  description: string;
};

/* ---------------- Component ---------------- */

export default function CreateExhibition() {
  const [form, setForm] = useState<ExhibitionForm>({
    title: "",
    date_time: "",
    end_time: "",
    location: "",
    price: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* ---------------- Save ---------------- */

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setError("You must be logged in.");
      setSaving(false);
      return;
    }

    try {
      await fetchPost(
        "/exhibitions",
        {
          title: form.title,
          date_time: form.date_time,
          end_time: form.end_time || null,
          location: form.location,
          price: Number(form.price),
          description: form.description,
        },
        {
          Authorization: `Bearer ${data.session.access_token}`,
        }
      );

      setSuccess(true);
      setForm({
        title: "",
        date_time: "",
        end_time: "",
        location: "",
        price: "",
        description: "",
      });
    } catch (err: any) {
      setError(err.message || "Failed to create exhibition");
    } finally {
      setSaving(false);
    }
  }

  /* ---------------- Render ---------------- */

  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">
          Kreiraj novu izložbu
        </h1>

        <Card className="w-full max-w-2xl rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-8">

            {/* Title */}
            <div className="space-y-1">
              <Label>Naziv izložbe</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            {/* Date & Time */}
            <div>
              <div className="space-y-1">
                <Label>Početak</Label>
                <Input
                  type="datetime-local"
                  value={form.date_time}
                  onChange={(e) =>
                    setForm({ ...form, date_time: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1">
              <Label>Lokacija</Label>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              />
            </div>


            {/* Description */}
            <div className="space-y-1">
              <Label>Opis izložbe</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {success && (
              <p className="text-sm text-green-600">
                Izložba je uspješno kreirana!
              </p>
            )}

            <LoadingButton loading={saving} onClick={handleSave}>
              Kreiraj izložbu
            </LoadingButton>

          </CardContent>
        </Card>
      </MainColumn>
    </PageLayout>
  );
}
