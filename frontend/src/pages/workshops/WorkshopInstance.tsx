import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import { supabase } from "@/config/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Logo, LogoImage, LogoFallback } from "@/components/ui/logo";
import { Banner, BannerImage, BannerFallback } from "@/components/ui/banner";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/context/AuthProvider";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Info,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Euro,
  ShieldAlert,
  Users,
  Loader2
} from "lucide-react";

/* ---------------- Types ---------------- */
type Photo = { id: number; url: string; }

type Workshop = {
  id: number;
  organizer_id: number;
  title: string;
  description: string;
  duration: string;
  date_time: string;
  location: string;
  capacity: number;
  price: number;
  places_left: number
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

const WorkshopPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);

  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) return;
      try {
        const workshopRes = await fetchGet<{ success: boolean; workshop: Workshop }>(`/workshops/${id}`);
        if (workshopRes.success) {
          setWorkshop(workshopRes.workshop);
          const organizerRes = await fetchGet<Organizer>(`/organizers/${workshopRes.workshop.organizer_id}`);
          setOrganizer(organizerRes);

          if (user && user.role != "organizator") {
            const regCheck = await fetchGet<{ registered: boolean }>(`/workshops/${id}/check-reservation`, {
              Authorization: `Bearer ${data.session.access_token}`,
            });
            setIsRegistered(regCheck.registered);
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


  if (loading) return (
    <div className="flex flex-1 justify-center items-center">
      <p>Učitavanje radionice...</p>
    </div>

  );

  if (!workshop) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

      {/* --- Workshop Detail Card --- */}
      <Card className="border-none shadow-xl overflow-hidden bg-card">
        <div className="bg-primary/5 p-8 border-b border-border/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border-primary/20">Radionica</Badge>
              {workshop.places_left <= 2 && workshop.places_left > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  Skoro popunjeno!
                </Badge>
              )}
              {workshop.places_left == 0 && (
                <Badge variant="destructive" >
                  POPUNJENO
                </Badge>
              )}

            </div>
            <h1 className="text-4xl font-extrabold text-foreground tracking-tight">{workshop.title}</h1>

            <div className="flex flex-wrap gap-5 text-muted-foreground font-medium text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                {new Date(workshop.date_time).toLocaleDateString("hr-HR")}
              </div>
              {/* Extracted time from date_time */}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                {new Date(workshop.date_time).toLocaleTimeString("hr-HR", {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="flex items-center gap-2">
                <Euro className="w-4 h-4 text-primary" />
                {workshop.price}€
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                {workshop.location}
              </div>
              {/* Places left display */}
              <div className="flex items-center gap-2 px-2 py-0.5 rounded-md bg-muted/50 text-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>{workshop.places_left} / {workshop.capacity} slobodnih mjesta</span>
              </div>
            </div>
          </div>

          {/* --- Reservation Logic & Organizer Message --- */}
          <div className="w-full md:w-[300px]"> {/* Fixed width for PayPal buttons */}
            {user?.role !== "polaznik" ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-3 text-amber-800 shadow-sm">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <p className="text-sm font-bold text-left">Samo polaznici smiju <br /> rezervirati radionicu.</p>
              </div>
            ) : isRegistered ? (
              <Button disabled className="w-full bg-primary/20 text-primary border border-primary/30 rounded-xl px-8 py-6 h-auto font-bold text-lg">
                <CheckCircle2 className="mr-2 h-6 w-6" /> Mjesto rezervirano
              </Button>
            ) : workshop.places_left === 0 ? (
              <Button disabled className="w-full rounded-xl py-6 font-bold text-lg">Popunjeno</Button>
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center md:text-left">
                  Osigurajte mjesto uplatom:
                </p>
                {/* 3. The Actual PayPal Button */}

                {registering ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />

                ) : (
                  <div>
                    <PayPalButtons

                      createOrder={async () => {
                        const res = await fetchPost<{ id: string }>("/api/paypal/create-order", {
                          workshopId: workshop.id
                        });
                        return res.id;
                      }}
                      onApprove={async (data) => {
                        setRegistering(true)
                        const dbdata = (await supabase.auth.getSession()).data;
                        if (!dbdata.session) return;
                        const res = await fetchPost<{ success: boolean }>("/api/paypal/capture-order", {
                          orderID: data.orderID,
                          workshopId: workshop.id
                        }, {
                          Authorization: `Bearer ${dbdata.session.access_token}`
                        });
                        if (res.success) {
                          setIsRegistered(true);
                          setRegistering(false)
                        }
                      }}
                    />
                  </div>
                )}

              </div>
            )}
          </div>
        </div>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-3">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                <Info className="w-5 h-5 text-primary" /> O radionici
              </h3>
              <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap">
                {workshop.description}
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-2xl border border-border h-fit">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 text-center md:text-left">
                Trajanje
              </h4>
              <div className="flex items-center justify-center md:justify-start gap-3 text-xl font-bold text-primary">
                {workshop.duration}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Organizer Info Section --- */}
      {organizer && (
        <div className="space-y-8">
          <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
            <h2 className="text-2xl font-bold text-foreground">O organizatoru</h2>
          </div>

          <Card className="border-border bg-card shadow-md overflow-hidden">
            <Banner className="h-48 md:h-64">
              {organizer.banner_url ? <BannerImage src={organizer.banner_url} /> : <BannerFallback className="bg-muted">No banner</BannerFallback>}
            </Banner>

            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex flex-col items-center md:items-start gap-4">
                  <Logo className="w-32 h-32 md:w-40 md:h-40 border-4 border-background shadow-lg -mt-20">
                    {organizer.logo_url ? <LogoImage src={organizer.logo_url} /> : (
                      <LogoFallback className="text-3xl font-bold bg-primary text-primary-foreground">{organizer.profile_name?.[0]}</LogoFallback>
                    )}
                  </Logo>
                  <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                    {organizer.profile_name}
                    {organizer.approved_by_admin && <CheckCircle2 className="w-5 h-5 text-primary" />}
                  </h2>
                </div>

                {/* Contact Info Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-2xl border border-border self-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">E-mail</p>
                    <a href={`mailto:${organizer.mail}`} className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"><Mail className="w-4 h-4" /> {organizer.mail || "Nije navedeno"}</a>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Telefon</p>
                    <p className="flex items-center gap-2 text-foreground font-medium"><Phone className="w-4 h-4" /> {organizer.phone || "Nije navedeno"}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Adresa</p>
                    <p className="flex items-center gap-2 text-foreground font-medium"><MapPin className="w-4 h-4" /> {organizer.address || "Nije navedeno"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-foreground mb-2">Opis</h3>
                <p className="text-foreground/70 leading-relaxed italic">"{organizer.description}"</p>
              </div>

              {/* Gallery */}
              {organizer.photos && organizer.photos.length > 0 && (
                <div className="mt-12 space-y-6">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <h3 className="text-xl font-bold text-foreground">Slike s prethodnih događaja</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {organizer.photos.map((photo) => (
                      <div key={photo.id} className="group aspect-square rounded-xl overflow-hidden border border-border shadow-sm">
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
  );
};

export default WorkshopPage;