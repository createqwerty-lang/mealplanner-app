import React, { useState } from "react";
import api from "@/api/client";
import { useQuery } from "@tanstack/react-query";
import JSZip from "jszip";
import { Download, Loader2, Users, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SubscriberExport() {
  const [exporting, setExporting] = useState(false);

  const { data: subscribers = [], isLoading } = useQuery({
    queryKey: ["newsletter-subscribers"],
    queryFn: async () => {
      const response = await api.get('/subscribers');
      return response.data;
    },
  });

  const toCSV = (rows) => {
    const headers = ["email", "first_name", "created_date"];
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push(headers.map((h) => escape(r[h])).join(","));
    }
    return lines.join("\n");
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const zip = new JSZip();

      zip.file("abonnes.csv", toCSV(subscribers));

      zip.file(
        "abonnes.json",
        JSON.stringify(
          subscribers.map((s) => ({
            email: s.email,
            first_name: s.first_name || "",
            created_date: s.created_date,
          })),
          null,
          2
        )
      );

      zip.file(
        "README.txt",
        `Newsletter KetoKitchen - Export des abonnés\n` +
          `Date d'export : ${new Date().toLocaleString("fr-FR")}\n` +
          `Nombre d'abonnés : ${subscribers.length}\n\n` +
          `Fichiers inclus :\n` +
          `  - abonnes.csv  (format CSV, encodé UTF-8)\n` +
          `  - abonnes.json (format JSON)\n`
      );

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `newsletter-ketokitchen-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
      <div className="bg-card rounded-2xl border border-border/50 p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg">Gestion des abonnés</h2>
            <p className="text-xs text-muted-foreground">Exportez la liste complète des inscrits</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">
              {isLoading ? "…" : `${subscribers.length} abonné${subscribers.length > 1 ? "s" : ""}`}
            </span>
          </div>
          <Button
            onClick={handleExport}
            disabled={exporting || isLoading || subscribers.length === 0}
            className="gap-2 rounded-xl"
          >
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {exporting ? "Export en cours…" : "Exporter en ZIP"}
          </Button>
        </div>
      </div>
    </div>
  );
}