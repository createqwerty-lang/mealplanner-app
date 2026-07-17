import React, { useState } from "react";
import api from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import { Mail, CheckCircle, Leaf, CalendarDays, ShoppingCart, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SubscriberExport from "@/components/newsletter/SubscriberExport";

const perks = [
  { icon: CalendarDays, title: "Meal Planner hebdomadaire", desc: "Recevez chaque semaine un plan de repas keto complet prêt à l'emploi." },
  { icon: ShoppingCart, title: "Liste de courses incluse", desc: "La liste d'ingrédients ajustée automatiquement selon le nombre de personnes." },
  { icon: ChefHat, title: "Nouvelles recettes en exclusivité", desc: "Découvrez nos recettes avant tout le monde, directement dans votre boîte mail." },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const { data: currentUser } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const response = await api.get('/auth/me');
      return response.data.user;
    },
    retry: false,
  });

  const isAdmin = currentUser?.role === "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Veuillez entrer votre adresse email."); return; }

    setLoading(true);

    // Check if already subscribed
    const existing = await api.post('/subscribers', { email, firstName });
    if (existing.data?.id) {
      setError("Cette adresse email est déjà inscrite à notre newsletter.");
      setLoading(false);
      return;
    }

    await api.post('/subscribers', { email, firstName });

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Leaf className="w-3.5 h-3.5" />
            Newsletter Keto
          </span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-4">
            Votre meal planner keto
            <br />
            <span className="text-primary">livré chaque semaine</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Inscrivez-vous gratuitement et recevez chaque lundi votre plan de repas cétogène complet avec la liste de courses.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {perks.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-2xl bg-card border border-border/50 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-semibold mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-2xl border border-border/50 p-8 shadow-sm">
            {success ? (
              <div className="text-center py-6">
                <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
                <h2 className="font-heading text-2xl font-bold mb-2">Bienvenue !</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Vous êtes inscrit(e) 🎉 Vérifiez votre boîte mail pour confirmer votre inscription. Votre premier meal planner arrive lundi !
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-lg">S'inscrire gratuitement</h2>
                    <p className="text-xs text-muted-foreground">Aucune carte de crédit requise</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Prénom (optionnel)</label>
                    <Input
                      placeholder="Votre prénom"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Adresse email *</label>
                    <Input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="rounded-xl"
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <Button type="submit" className="w-full rounded-xl h-11 gap-2" disabled={loading}>
                    {loading ? "Inscription en cours…" : (
                      <>
                        <Mail className="w-4 h-4" />
                        Recevoir mon meal planner
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Pas de spam. Désabonnement en un clic.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {isAdmin && <SubscriberExport />}
    </div>
  );
}