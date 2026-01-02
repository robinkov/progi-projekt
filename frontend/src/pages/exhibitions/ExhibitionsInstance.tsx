import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from '@/config/supabase';
import { useAuth } from "@/components/context/AuthProvider";
import { ShieldAlert } from "lucide-react";

import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Info,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  UserPlus
} from "lucide-react";

/* ---------------- Types ---------------- */
type Photo = { id: number; url: string; }

type Exhibition = {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  date_time: string;
  location: string;
};

type Organizer = {
  profile_name: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  approved_by_admin: boolean | null;
  photos: Photo[];
  mail: string;
  phone: string;
  address: string;
};

const ExhibitionPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);

  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;

      try {
        const exhibitionRes = await fetchGet<{ success: boolean; exhibition: Exhibition }>(`/exhibitions/${id}`);
        if (exhibitionRes.success) {
          setExhibition(exhibitionRes.exhibition);

          const organizerRes = await fetchGet<Organizer>(`/organizers/${exhibitionRes.exhibition.organizer_id}`);
          setOrganizer(organizerRes);

          if (user) {
            const regCheck = await fetchGet<{ registered: boolean }>(`/exhibitions/${id}/check-registration`, {
              Authorization: `Bearer ${data.session.access_token}`,
            });
            (regCheck.registered);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleRegister = async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    setRegistering(true);
    try {
      const res = await fetchPost<{ success: boolean }>(`/exhibitions/${id}/register`, {}, {
        Authorization: `Bearer ${data.session.access_token}`,
      });
      if (res.success) {
        setIsRegistered(true);
      }
    } catch (error) {
      console.error("Registration failed", error);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Učitavanje izložbe...</p>
      </div>
    );
  }

  if (!exhibition) return null;

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* --- Exhibition Detail Card --- */}
        <Card className="border-none shadow-xl overflow-hidden bg-card">
          <div className="bg-primary/5 p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
              <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                Izložba
              </Badge>
              <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
                {exhibition.title}
              </h1>
              <div className="flex flex-wrap gap-6 text-muted-foreground font-medium text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date(exhibition.date_time).toLocaleDateString("hr-HR", {
                    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  {exhibition.location}
                </div>
              </div>
            </div>

            {/* --- Registration Button Section --- */}
            <div className="w-full md:w-auto">
              {isRegistered ? (
                <Button disabled className="w-full md:w-auto bg-primary/20 text-primary border border-primary/30 rounded-xl px-8 py-6 h-auto font-bold text-lg cursor-default">
                  <CheckCircle2 className="mr-2 h-6 w-6" />
                  Prijavljeni ste
                </Button>
              ) : user && user.role != "polaznik" ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 shadow-sm">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-bold text-left">Samo polaznici smiju <br /> poslati prijavu.</p>
                </div>
              ) : (
                <Button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl px-10 py-6 h-auto font-bold text-lg transition-all active:scale-95"
                >
                  {registering ? (
                    <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-6 w-6" />
                  )}
                  Prijavi se na izložbu
                </Button>
              )}
            </div>
          </div>

          <CardContent className="p-8">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-primary" />
              O izložbi
            </h3>
            <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap">
              {exhibition.description}
            </p>
          </CardContent>
        </Card>

        {/* --- Organizer Info Section --- */}
        {organizer && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
              <h2 className="text-2xl font-bold text-foreground">Informacije o organizatoru</h2>
            </div>

            <Card className="border-border bg-card shadow-md overflow-hidden">
              <Banner className="h-48 md:h-64">
                {organizer.banner_url ? <BannerImage src={organizer.banner_url} /> : <BannerFallback className="bg-muted">Nema naslovne slike</BannerFallback>}
              </Banner>

              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Left Column: Logo & Name */}
                  <div className="flex flex-col items-center md:items-start gap-4">
                    <Logo className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-lg -mt-20">
                      {organizer.logo_url ? <LogoImage src={organizer.logo_url} /> : (
                        <LogoFallback className="text-3xl font-bold bg-primary text-primary-foreground">{organizer.profile_name?.[0]}</LogoFallback>
                      )}
                    </Logo>
                    <div className="text-center md:text-left">
                      <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        {organizer.profile_name}
                        {organizer.approved_by_admin && <CheckCircle2 className="w-6 h-6 text-primary" />}
                      </h2>
                    </div>
                  </div>

                  {/* Right Column: Contact info */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-2xl border border-border self-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">E-mail</p>
                      <a href={`mailto:${organizer.mail}`} className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-medium">
                        <Mail className="w-4 h-4" /> {organizer.mail || "Nije navedeno"}
                      </a>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Telefon</p>
                      <p className="flex items-center gap-2 text-foreground font-medium">
                        <Phone className="w-4 h-4" /> {organizer.phone || "Nije navedeno"}
                      </p>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Adresa</p>
                      <p className="flex items-center gap-2 text-foreground font-medium">
                        <MapPin className="w-4 h-4" /> {organizer.address || "Nije navedeno"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-foreground mb-2">Opis organizatora</h3>
                  <p className="text-foreground/70 leading-relaxed italic">"{organizer.description}"</p>
                </div>

                {/* --- Gallery Section --- */}
                {organizer.photos && organizer.photos.length > 0 && (
                  <div className="mt-12 space-y-6">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-bold text-foreground">Slike s prethodnih događaja</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {organizer.photos.map((photo) => (
                        <div key={photo.id} className="group aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                          <img src={photo.url} alt="Rad" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default ExhibitionPage;