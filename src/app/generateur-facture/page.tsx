import { Suspense } from "react";
import GenerateurFactureClient from "./GenerateurFactureClient";

export default function GenerateurFacturePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center text-slate-500">
          Chargement du générateur...
        </div>
      }
    >
      <GenerateurFactureClient />
    </Suspense>
  );
}
