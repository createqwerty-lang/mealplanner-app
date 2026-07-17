import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, UserCog, Save, LogOut } from "lucide-react";

const STORAGE_KEY = "ketokitchen-admin-auth";
const DEFAULT_ADMIN = {
  username: "Admin",
  password: "Allo123!",
  email: "angel.jmartel@gmail.com",
};

function getStoredAdmin() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ADMIN;
    const parsed = JSON.parse(raw);
    return {
      username: parsed.username || DEFAULT_ADMIN.username,
      password: parsed.password || DEFAULT_ADMIN.password,
      email: parsed.email || DEFAULT_ADMIN.email,
    };
  } catch {
    return DEFAULT_ADMIN;
  }
}

function saveStoredAdmin(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export default function WpAdmin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [admin, setAdmin] = useState(getStoredAdmin());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredAdmin();
    setAdmin(stored);
    const savedAuth = sessionStorage.getItem("ketokitchen-admin-session");
    if (savedAuth === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const response = await api.get("/subscribers");
      return response.data;
    },
    enabled: isLoggedIn,
    retry: false,
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post('/auth/login', {
        username: credentials.username,
        password: credentials.password,
      });

      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken || '');
        sessionStorage.setItem('ketokitchen-admin-session', 'true');
        setIsLoggedIn(true);
        setMessage('Connexion réussie.');
      } else {
        setError('Identifiants invalides.');
      }
    } catch (err) {
      setError('Identifiants invalides ou compte non autorisé.');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', { refreshToken: localStorage.getItem('refreshToken') });
    } catch {
      // ignore
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('ketokitchen-admin-session');
    setIsLoggedIn(false);
    setCredentials({ username: "", password: "" });
    setMessage("");
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const next = {
      ...admin,
      username: admin.username.trim() || DEFAULT_ADMIN.username,
      password: admin.password.trim() || DEFAULT_ADMIN.password,
      email: admin.email.trim() || DEFAULT_ADMIN.email,
    };

    try {
      await api.put('/auth/profile', {
        name: next.username,
        password: next.password,
      });
      saveStoredAdmin(next);
      setAdmin(next);
      setMessage('Paramètres enregistrés avec succès.');
    } catch (err) {
      setError('Impossible d’enregistrer les modifications.');
    }
  };

  const summary = useMemo(() => ({
    total: subscribers.length,
    latest: subscribers[0]?.email || "Aucun abonnement",
  }), [subscribers]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Connexion au dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Nom d’utilisateur</label>
                <Input
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Votre nom d’utilisateur"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Mot de passe</label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Votre mot de passe"
                />
              </div>
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
              {message && <Alert><AlertDescription>{message}</AlertDescription></Alert>}
              <Button type="submit" className="w-full">Se connecter</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">Dashboard newsletter</h1>
            <p className="text-muted-foreground mt-1">Gérez les abonnés et les réglages d’accès.</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" /> Déconnexion
          </Button>
        </div>

        {message && <Alert><AlertDescription>{message}</AlertDescription></Alert>}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" /> Abonnés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{summary.total}</p>
              <p className="text-sm text-muted-foreground mt-2">Dernier abonnement : {summary.latest}</p>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCog className="w-5 h-5" /> Paramètres</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Nom d’utilisateur</label>
                    <Input
                      value={admin.username}
                      onChange={(e) => setAdmin({ ...admin, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Adresse email</label>
                    <Input
                      value={admin.email}
                      onChange={(e) => setAdmin({ ...admin, email: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Mot de passe</label>
                  <Input
                    type="password"
                    value={admin.password}
                    onChange={(e) => setAdmin({ ...admin, password: e.target.value })}
                  />
                </div>
                <Button type="submit" className="gap-2">
                  <Save className="w-4 h-4" /> Enregistrer
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste des personnes inscrites</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Chargement…</p>
            ) : subscribers.length === 0 ? (
              <p className="text-muted-foreground">Aucun abonnement pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground border-b">
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Prénom</th>
                      <th className="py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b last:border-0">
                        <td className="py-3 pr-4">{subscriber.email}</td>
                        <td className="py-3 pr-4">{subscriber.firstName || "—"}</td>
                        <td className="py-3">{new Date(subscriber.createdAt).toLocaleDateString("fr-FR")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
