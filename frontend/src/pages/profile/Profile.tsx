import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, LoadingButton } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/config/supabase";
import { fetchPost } from "@/utils/fetchUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/context/AuthProvider";
import { Spinner } from "@/components/ui/spinner";



type ProfileForm = {
  first_name: string;
  last_name: string;
  username: string;
  address: string;
  phone: string;
  email: string;
  avatar_url: string | null;
};

export default function Profile() {
  const [form, setForm] = useState<ProfileForm>({
    first_name: "",
    last_name: "",
    username: "",
    phone: "",
    email: "",
    address: "",
    avatar_url: null,
  });

  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ---------------- Load profile ---------------- */
  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      try {
        const res = await fetchPost<ProfileForm>(
          "/profile",
          {},
          { Authorization: `Bearer ${data.session.access_token}` }
        );
        setForm(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /* ---------------- Upload avatar ---------------- */
    async function handleAvatarUpload(file: File) {
        setUploading(true);

        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
            setUploading(false);
            return;
        }

        const userId = sessionData.session.user.id;
        const timestamp = Date.now();
        const fileExt = file.name.split(".").pop();
        const filePath = `${userId}_${timestamp}.${fileExt}`; // unique file path

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("photos")
            .upload(filePath, file, { upsert: false }); // don’t overwrite old images

        if (uploadError) {
            console.error("Failed to upload avatar:", uploadError);
            setUploading(false);
            return;
        }

        // Get public URL
        const { data: urlData, error: urlError } = supabase.storage
            .from("photos")
            .getPublicUrl(filePath);

        if (urlError) {
            console.error("Failed to get public URL:", urlError);
            setUploading(false);
            return;
        }

        // Update form state instantly
        setForm((f) => ({ ...f, avatar_url: urlData.publicUrl }));
        setUploading(false);
    }



  /* ---------------- Save profile ---------------- */
  async function handleSave() {
    setSaving(true);

    const { data } = await supabase.auth.getSession();
    if (!data.session) return;

    try {
      await fetchPost(
        "/profile/update",
        {
          first_name: form.first_name,
          last_name: form.last_name,
          username: form.username,
          phone: form.phone,
          address: form.address,
          avatar_url: form.avatar_url
        },
        { Authorization: `Bearer ${data.session.access_token}` }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        loading profile...
      </div>
    );
  }

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-2xl rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-8">
          <h1 className="text-2xl font-semibold">Profile</h1>

          {/* Role */}
            <div>
                <Label>Role</Label>
                <Input value={user?.role ?? "Not assigned"} disabled />
            </div>


          {/* Avatar */}
            <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={form.avatar_url ?? undefined} />

                    {form.avatar_url?(<div></div>):(
                      <AvatarFallback>
                    {form.first_name?.[0]}
                    {form.last_name?.[0]}
                    </AvatarFallback>
                    )}
                    
                </Avatar>

                <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload"
                    className="hidden"
                    onChange={(e) =>
                    e.target.files && handleAvatarUpload(e.target.files[0])
                    }
                />
                <Button
                    variant="outline"
                    disabled={uploading}
                    onClick={() => document.getElementById("avatar-upload")?.click()}
                >
                    {uploading ? "Uploading..." : "Change photo"}
                </Button>
            </div>


          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input value={form.email} disabled />
          </div>

          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>First name</Label>
              <Input
                value={form.first_name} disabled/>
            </div>

            <div>
              <Label>Last name</Label>
              <Input
                value={form.last_name} disabled/>
            </div>
          </div>

          {/* Username */}
          <div>
            <Label>Username</Label>
            <Input
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
            />
          </div>

          {/* Phone */}
          <div>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
          </div>

          {/* Address */}
            <div className="space-y-1">
                <Label>Address</Label>
                <Input
                    value={form.address}
                    onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                    }
                />
            </div>


          <LoadingButton loading={saving} onClick={handleSave}>
            Save changes
          </LoadingButton>
        </CardContent>
      </Card>
    
    
      
    </div>
  );
}