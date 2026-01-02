
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button, LoadingButton } from "@/components/ui/button";
import { supabase } from "@/config/supabase";
import { fetchPost, fetchGet, fetchDelete } from "@/utils/fetchUtils";
import { useAuth } from "@/components/context/AuthProvider";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { ImagePlus, X, Grid, Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";


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

type Photo = {
  id: number
  url: string
}

/* ---------------- Component ---------------- */

export default function OrganizerProfile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [idBeingRemoved, setIdBeingRemoved] = useState<number | null>(null)
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
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [loadingPhotos, setLoadingPhotos] = useState(true);


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

    async function loadOrganizerImages() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const res = await fetchGet<{ success: boolean, photos: Photo[] }>(
        "/organizer/photos",
        {
          Authorization: `Bearer ${data.session.access_token}`,
        }
      );
      if (res.photos) {
        setPhotos(res.photos)
        setLoadingPhotos(false)
      }
    }

    if (user?.role === "organizator") {
      loadOrganizerProfile();
      loadOrganizerImages();
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

  async function handleImageUpload(file: File | null) {

    if (!file) {
      return null;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      return;
    }
    const userId = sessionData.session.user.id;
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}_${timestamp}.${fileExt}`; // unique file path

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(filePath, file, { upsert: false }); // don’t overwrite old images

    if (uploadError) {
      console.error("Failed to upload image:", uploadError);
      return;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(filePath);

    if (!urlData) {
      console.error("Failed to get public URL");
      return;
    }
    return urlData.publicUrl
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
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploadingPhoto(true);
    try {
      const publicUrl = await handleImageUpload(file);

      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const res = await fetchPost<{ success: boolean; photo: Photo }>(
        "/organizer/photos/add",
        { url: publicUrl },
        { Authorization: `Bearer ${data.session.access_token}` }
      );

      if (res.success) {
        setPhotos(prev => [...prev, res.photo]);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId: number) => {
    try {
      setIdBeingRemoved(photoId)
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      const res = await fetchDelete<{ success: boolean }>(
        `/organizer/photos/delete/${photoId}`,
        { Authorization: `Bearer ${data.session.access_token}` }
      );

      if (res.success) {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
      }
    } catch (err) {
      console.error("Deletion failed", err);
    } finally {
      setIdBeingRemoved(null)
    }
  };

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
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">
      <Card className="border-border bg-card shadow-lg overflow-hidden">
        {/* ... (Existing Banner and Logo code) ... */}

        <CardContent className="p-8 space-y-6">
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
          </CardContent>
          <LoadingButton loading={saving} onClick={handleSave} className="w-full">
            Save Profile Changes
          </LoadingButton>
        </CardContent>
      </Card>

      {/* --- Previous Work Gallery --- */}
      <Card className="border-border bg-card shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Grid className="w-5 h-5 text-primary" />
              Previous Work
            </CardTitle>
            <CardDescription>
              Showcase photos from your past exhibitions and events.
            </CardDescription>
          </div>

          <div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleGalleryUpload}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
              variant="outline"
              className="rounded-full border-primary/20 text-primary hover:bg-primary/10"
            >
              {uploadingPhoto ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ImagePlus className="w-4 h-4 mr-2" />
              )}
              Add Photo
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loadingPhotos ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
            </div>
          ) : photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border shadow-sm">
                  <img
                    src={photo.url}
                    alt="Previous work"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full shadow-xl"
                      onClick={() => handleDeletePhoto(photo.id)}
                    >
                      {idBeingRemoved == photo.id ? (
                        <Spinner></Spinner>
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl bg-muted/10">
              <p className="text-muted-foreground text-sm font-medium">No photos uploaded yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

