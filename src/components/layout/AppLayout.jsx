import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-border/50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            KetoKitchen — Recettes cétogènes simples et délicieuses
          </p>
        </div>
      </footer>
    </div>
  );
}