import { useState, useEffect } from "react";
import { supabase } from '@/config/supabase';
import { fetchGet, fetchPost } from "@/utils/fetchUtils";
import {
  UserCircle,
  ShieldCheck,
  CreditCard,
  ShoppingBag,
  Calendar,
  Settings2,
  BellRing,
  BellOff,
  Check,
  ArrowRight,
  Info,
  Loader2
} from "lucide-react";

// shadcn components
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

type Notification = {
  id: number,
  type: string,
  title: string,
  subtitle: string,
  body: string,
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [needsApproval, setNeedsApproval] = useState(true)
  const [needsMembership, setNeedsMembership] = useState(true)
  const [needsUsername, setNeedsUsername] = useState(true)
  const [newProductNotifications, setnewProductNotifications] = useState(true)
  const [newWorkshopNotifications, setNewWorkshopNotifications] = useState(true)

  async function fetchData() {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    try {
      const res = await fetchGet<{
        success: boolean;
        needsUsername: boolean;
        needsApproval: boolean;
        needsMembership: boolean;
        newWorkshopNotifications: boolean;
        newProductNotifications: boolean;
        notifications: Notification[]
      }>("/", {
        Authorization: `Bearer ${data.session.access_token}`,
      });

      if (res.success) {
        setNeedsApproval(res.needsApproval);
        setNeedsMembership(res.needsMembership);
        setNeedsUsername(res.needsUsername);
        setNotifications(res.notifications);
        setnewProductNotifications(res.newProductNotifications)
        setNewWorkshopNotifications(res.newWorkshopNotifications)
      }
    } catch (err) {
      console.error("Failed", err);
    } finally {
      setLoading(false);
    }
  }

  const markAsRead = async (id: number) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    setNotifications(prev => prev.filter(n => n.id !== id));
    await fetchPost("/mark-notification-read", { id }, {
      Authorization: `Bearer ${data.session.access_token}`,
    });
  };

  const toggleNotifs = async (type: 'workshop' | 'product', currentVal: boolean) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    if (type === 'workshop') setNewWorkshopNotifications(!currentVal);
    else setnewProductNotifications(!currentVal);

    await fetchPost("/toggle-notification-settings", { type: type, enabled: !currentVal }, { Authorization: `Bearer ${data.session.access_token}` });
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">Pripremanje početne stranice...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 space-y-10">

      {/* --- SECTION 1: Account Setup Alerts --- */}
      {(needsUsername || needsApproval || needsMembership) && (
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <Info className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Potrebne akcije</h2>
          </div>

          <div className="grid gap-4">
            {needsUsername && (
              <Card className="border-l-4 border-l-amber-500 bg-amber-50/30">
                <CardContent className="p-5 flex items-start gap-4">
                  <UserCircle className="w-6 h-6 text-amber-600 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-amber-900 leading-relaxed">
                      Vaše korisničko ime za objavljivanje komentara i ocjena nije postavljeno. Drugi korisnici će Vas vidjeti kao anonimnog korisnika.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-amber-700 font-bold mt-2" onClick={() => window.location.href = '/profile'}>
                      Promijenite to u Menu <ArrowRight className=" w-3 h-3" /> Profil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {needsApproval && (
              <Card className="border-l-4 border-l-blue-500 bg-blue-50/30">
                <CardContent className="p-5 flex items-start gap-4">
                  <ShieldCheck className="w-6 h-6 text-blue-600 mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-900 leading-relaxed">
                      Vaš profil organizacije čeka odobrenje administratora. Ono je potrebno za korištenje naše platforme kao organizator. Kako bi dobili odobrenje na profil morate dodati podatke o organizaciji i slike.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-blue-700 font-bold mt-2" onClick={() => window.location.href = '/organizerprofile'}>
                      Učinite to u Menu <ArrowRight className=" w-3 h-3" /> Profil Organizacije
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {needsMembership && (
              <Card className="border-l-4 border-l-destructive bg-destructive/5">
                <CardContent className="p-5 flex items-start gap-4">
                  <CreditCard className="w-6 h-6 text-destructive mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-destructive leading-relaxed font-bold">
                      Za korištenje naše platforme potrebno je imati plaćeno aktivno članstvo.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-destructive font-bold mt-2" onClick={() => window.location.href = '/membership'}>
                      Sve o članarinama možete vidjeti na Menu <ArrowRight className=" w-3 h-3" /> Članarina
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {/* --- SECTION 2: Notification Controls --- */}
      <Card className="bg-card border-border overflow-hidden">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <Settings2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Pretplate na obavijesti</h3>
              <p className="text-sm text-muted-foreground">Prilagodite što želite pratiti na početnoj stranici.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-xl border border-border">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Radionice</span>
              <Switch
                checked={newWorkshopNotifications}
                onCheckedChange={() => toggleNotifs('workshop', newWorkshopNotifications)}
              />
            </div>
            <div className="flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-xl border border-border">
              <ShoppingBag className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold">Proizvodi</span>
              <Switch
                checked={newProductNotifications}
                onCheckedChange={() => toggleNotifs('product', newProductNotifications)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- SECTION 3: Notification Feed --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">Novosti za Vas</h2>
          </div>
          <Badge variant="outline" className="rounded-full border-primary/20 text-primary">
            {notifications.length} novih poruka
          </Badge>
        </div>

        {notifications.length > 0 ? (
          <div className="grid gap-4">
            {notifications.map((n) => (
              <Card key={n.id} className="group hover:shadow-md transition-all duration-300 border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-2xl shrink-0 ${n.type === 'workshop' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {n.type === 'workshop' ? <Calendar className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
                      </div>
                      <div className="space-y-1">
                        <Badge variant="secondary" className="mb-1 uppercase text-[10px] tracking-tighter">
                          {n.type === 'workshop' ? 'Nova Radionica' : 'Novi Proizvod'}
                        </Badge>
                        <h4 className="text-lg font-bold text-foreground leading-tight">{n.title}</h4>
                        <p className="text-sm font-semibold text-primary">{n.subtitle}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed pt-2">{n.body}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors shrink-0"
                      onClick={() => markAsRead(n.id)}
                      title="Označi kao pročitano"
                    >
                      <Check className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-[2.5rem] border-2 border-dashed border-border">
            <BellOff className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />


            {(newWorkshopNotifications || newProductNotifications) ? (
              <div><h3 className="text-lg font-bold text-foreground">Trenutno nema novih obavijesti</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                  Sve ste pročitali! Čim se pojavi nešto novo, bit ćete obaviješteni ovdje.
                </p></div>

            ) : (
              <div><h3 className="text-lg font-bold text-foreground">Obavijesti su isključene</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-1">
                  Vaše obavijesti su isključene. Uključite ih kako bi se mogle pojaviti ovdje.
                </p>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}