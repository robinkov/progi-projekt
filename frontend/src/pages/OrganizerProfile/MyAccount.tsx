import { useState, useEffect } from "react"
import { supabase } from "@/config/supabase"
import { fetchGet } from "@/utils/fetchUtils"
import {
    Wallet,
    ShoppingBag,
    Users,
    Mail,
    AlertCircle,
    TrendingUp,
    ArrowUpRight,
    Clock
} from "lucide-react"

// shadcn/ui komponente
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

/* ---------------- Types ---------------- */
type WorkshopReservationTransaction = {
    id: number,
    workshop_title: string,
    participant_mail: string,
    amount: number,
    date_time: string
}

type ProductPurchaseTransaction = {
    id: number,
    product_name: string,
    participant_mail: string,
    amount: number,
    date_time: string
}

export default function MyAccount() {
    const [productPurchaseTransactions, setProductPurchaseTransactions] = useState<ProductPurchaseTransaction[]>([])
    const [workshopReservationTransactions, setWorkshopReservationTransactions] = useState<WorkshopReservationTransaction[]>([])
    const [loading, setLoading] = useState(true)

    // Računanje ukupne zarade
    const totalEarned = [...productPurchaseTransactions, ...workshopReservationTransactions]
        .reduce((sum, t) => sum + t.amount, 0)

    async function fetchData() {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        try {
            const [prodRes, workRes] = await Promise.all([
                fetchGet<{ success: boolean, transactions: ProductPurchaseTransaction[] }>("/organizer/transactions/products", {
                    Authorization: `Bearer ${data.session.access_token}`,
                }),
                fetchGet<{ success: boolean, transactions: WorkshopReservationTransaction[] }>("/organizer/transactions/workshops", {
                    Authorization: `Bearer ${data.session.access_token}`,
                })
            ]);

            if (prodRes.success) setProductPurchaseTransactions(prodRes.transactions);
            if (workRes.success) setWorkshopReservationTransactions(workRes.transactions);
        } catch (err) {
            console.error("Failed to load transactions", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) return <div className="p-10 text-center animate-pulse text-muted-foreground">Učitavanje podataka o računu...</div>

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-8">

            {/* --- TOP SECTION: Total Earnings --- */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 bg-primary text-primary-foreground shadow-2xl border-none overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp className="w-32 h-32" />
                    </div>
                    <CardContent className="p-8 space-y-2">
                        <p className="text-primary-foreground/80 font-medium tracking-wider uppercase text-xs">Vaša ukupna zarada na Clayplayu</p>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black">{totalEarned.toFixed(2)}</span>
                            <span className="text-2xl font-bold text-primary-foreground/70">EUR</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm bg-white/10 w-fit px-3 py-1 rounded-full mt-4">
                            <ArrowUpRight className="w-4 h-4" />
                            <span>Osvježite stranicu za najnovije podatke</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50 border-amber-200 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3 text-amber-700">
                            <AlertCircle className="w-6 h-6 shrink-0" />
                            <h3 className="font-bold leading-tight">Važna napomena o dostavi</h3>
                        </div>
                        <p className="text-sm text-amber-800 leading-relaxed">
                            Aplikacija ne upravlja dostavom proizvoda. Molimo vas da stupite u kontakt s kupcima putem maila kako biste dogovorili detalje isporuke.
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* --- TRANSACTIONS SECTION --- */}
            <Tabs defaultValue="products" className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-bold tracking-tight">Povijest transakcija</h2>
                        <p className="text-muted-foreground text-sm">Pregledajte sve uplate vaših kupaca i polaznika.</p>
                    </div>
                    <TabsList className="bg-muted/50 p-1 rounded-xl">
                        <TabsTrigger value="products" className="rounded-lg px-6">
                            <ShoppingBag className="w-4 h-4 mr-2" /> Proizvodi
                        </TabsTrigger>
                        <TabsTrigger value="workshops" className="rounded-lg px-6">
                            <Users className="w-4 h-4 mr-2" /> Radionice
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* --- Product Transactions Content --- */}
                <TabsContent value="products" className="space-y-4">
                    {productPurchaseTransactions.length > 0 ? (
                        <div className="grid gap-4">
                            {productPurchaseTransactions.map((t) => (
                                <TransactionCard key={t.id} title={t.product_name} amount={t.amount} mail={t.participant_mail} date={t.date_time} type="product" />
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Nema prodanih proizvoda." />
                    )}
                </TabsContent>

                {/* --- Workshop Transactions Content --- */}
                <TabsContent value="workshops" className="space-y-4">
                    {workshopReservationTransactions.length > 0 ? (
                        <div className="grid gap-4">
                            {workshopReservationTransactions.map((t) => (
                                <TransactionCard key={t.id} title={t.workshop_title} amount={t.amount} mail={t.participant_mail} date={t.date_time} type="workshop" />
                            ))}
                        </div>
                    ) : (
                        <EmptyState message="Nema rezervacija radionica." />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

/* --- Reusable Sub-components --- */

function TransactionCard({ title, amount, mail, date, type }: { title: string, amount: number, mail: string, date: string, type: 'product' | 'workshop' }) {
    return (
        <Card className="group hover:border-primary/50 transition-colors">
            <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full">
                    <div className={`p-3 rounded-2xl ${type === 'product' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                        {type === 'product' ? <ShoppingBag className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                    </div>
                    <div className="space-y-1 flex-1">
                        <h4 className="font-bold text-foreground leading-none">{title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground pt-1">
                            <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" /> {mail}
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {new Date(date).toLocaleDateString('hr-HR')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-right">
                        <p className="text-lg font-black text-foreground">+{amount.toFixed(2)} €</p>
                        <Badge variant="outline" className="text-[10px] uppercase font-bold text-green-600 border-green-200 bg-green-50">Uplaćeno</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="text-center py-20 bg-muted/20 rounded-4xl border-2 border-dashed border-border">
            <Wallet className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">{message}</p>
        </div>
    )
}