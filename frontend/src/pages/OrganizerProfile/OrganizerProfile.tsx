import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, LoadingButton } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import { fetchPost } from "@/utils/fetchUtils";
import { useAuth } from "@/components/context/AuthProvider";

import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";

/* ---------------- Types ---------------- */

type OrganizerProfileForm = {
  profile_name: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  membership_plan_id: number | null;
  membership_expiry_date: string | null;
  approved_by_admin: boolean | null;
};

/* ---------------- Component ---------------- */

export default function OrganizerProfile() {
  const { user } = useAuth();

  const [form, setForm] = useState<OrganizerProfileForm>({
    profile_name: "",
    description: "",
    logo_url: null,
    banner_url: null,
    membership_plan_id: null,
    membership_expiry_date: null,
    approved_by_admin: null,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingBanner, setUploadingBanner] = useState(false);

  /* ---------------- Load organizer profile ---------------- */

  useEffect(() => {
    async function loadOrganizerProfile() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      try {
        const res = await fetchPost<OrganizerProfileForm>(
          "/organizer/profile",
          {},
          {
            Authorization: `Bearer ${data.session.access_token}`,
          }
        );

        // Make sure null strings become empty strings
        setForm({
          profile_name: res.profile_name ?? "",
          description: res.description ?? "",
          logo_url: res.logo_url,
          banner_url: res.banner_url,
          membership_plan_id: res.membership_plan_id,
          membership_expiry_date: res.membership_expiry_date,
          approved_by_admin: res.approved_by_admin,
        });
      } catch (err) {
        console.error("Failed to load organizer profile", err);
      } finally {
        setLoading(false);
      }
    }

    if (user?.role === "organizator") {
      loadOrganizerProfile();
    }
  }, [user]);

  /* ---------------- Image upload helper ---------------- */

  async function uploadImage(file: File, prefix: string) {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;

    const userId = data.session.user.id;
    const ext = file.name.split(".").pop();
    const path = `organizers/${prefix}_${userId}_${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("photos")
      .upload(path, file, { upsert: false });

    if (error) {
      console.error(error);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(path);

    return urlData.publicUrl;
  }

  /* ---------------- Logo upload ---------------- */

  async function handleLogoUpload(file: File) {
    setUploadingLogo(true);
    const url = await uploadImage(file, "logo");
    if (url) setForm((f) => ({ ...f, logo_url: url }));
    setUploadingLogo(false);
  }

  /* ---------------- Banner upload ---------------- */

  async function handleBannerUpload(file: File) {
    setUploadingBanner(true);
    const url = await uploadImage(file, "banner");
    if (url) setForm((f) => ({ ...f, banner_url: url }));
    setUploadingBanner(false);
  }

  /* ---------------- Save profile ---------------- */

  async function handleSave() {
    setSaving(true);

    const { data } = await supabase.auth.getSession();
    if (!data.session) return;

    try {
      await fetchPost(
        "/organizer/profile/update",
        {
          profile_name: form.profile_name,
          description: form.description,
          logo_url: form.logo_url,
          banner_url: form.banner_url,
        },
        {
          Authorization: `Bearer ${data.session.access_token}`,
        }
      );
    } catch (err) {
      console.error("Failed to save organizer profile", err);
    } finally {
      setSaving(false);
    }
  }

  /* ---------------- Loading ---------------- */

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        Loading organizer profile...
      </div>
    );
  }

  /* ---------------- Render ---------------- */

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-3xl rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-8">
          <h1 className="text-2xl font-semibold">Organizer Profile</h1>

          {/* Approval status */}
          <div>
            <Label>Status</Label>
            <Input
              value={form.approved_by_admin ? "Approved" : "Pending approval"}
              disabled
            />
          </div>

          {/* Banner */}
          <div className="space-y-2">
            <Label>Banner</Label>

            <Banner className="h-48">
              {form.banner_url ? (
                <BannerImage src={form.banner_url} />
              ) : (
                <BannerFallback>No banner uploaded</BannerFallback>
              )}
            </Banner>

            <input
              type="file"
              accept="image/*"
              id="banner-upload"
              className="hidden"
              onChange={(e) =>
                e.target.files && handleBannerUpload(e.target.files[0])
              }
            />

            <Button
              variant="outline"
              disabled={uploadingBanner}
              onClick={() =>
                document.getElementById("banner-upload")?.click()
              }
            >
              {uploadingBanner ? "Uploading..." : "Change banner"}
            </Button>
          </div>

          {/* Logo */}
          <div className="space-y-2">
            <Label>Logo</Label>

            <div className="flex items-center gap-6">
              <Logo>
                {form.logo_url ? (
                  <LogoImage src={form.logo_url} />
                ) : (
                  <LogoFallback>
                    {form.profile_name?.[0] ?? "O"}
                  </LogoFallback>
                )}
              </Logo>

              <input
                type="file"
                accept="image/*"
                id="logo-upload"
                className="hidden"
                onChange={(e) =>
                  e.target.files && handleLogoUpload(e.target.files[0])
                }
              />

              <Button
                variant="outline"
                disabled={uploadingLogo}
                onClick={() =>
                  document.getElementById("logo-upload")?.click()
                }
              >
                {uploadingLogo ? "Uploading..." : "Change logo"}
              </Button>
            </div>
          </div>

          {/* Organizer name */}
          <div>
            <Label>Organizer name</Label>
            <Input
              value={form.profile_name ?? ""}
              onChange={(e) =>
                setForm({ ...form, profile_name: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              value={form.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Membership info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Membership plan</Label>
              <Input
                value={form.membership_plan_id ?? "—"}
                disabled
              />
            </div>

            <div>
              <Label>Expiry date</Label>
              <Input
                value={form.membership_expiry_date ?? "—"}
                disabled
              />
            </div>
          </div>

          <LoadingButton loading={saving} onClick={handleSave}>
            Save changes
          </LoadingButton>
        </CardContent>
      </Card>
    </div>
  );
}
