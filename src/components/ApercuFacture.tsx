"use client";

import type { DonneesFacture, LigneFacture } from "@/types/facture";
import { getLogoDisplaySize } from "@/lib/logoUtils";

function formatMontant(value: number, devise: string): string {
  return (
    new Intl.NumberFormat("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value) +
    " " +
    devise
  );
}

interface ApercuFactureProps {
  data: DonneesFacture;
}

export default function ApercuFacture({ data }: ApercuFactureProps) {
  let totalHT = 0;
  let totalTVA = 0;
  data.lignes.forEach((l: LigneFacture) => {
    const qte = Number(l.quantite) || 0;
    const pu = Number(l.prixUnitaire) || 0;
    const tva = Number(l.tauxTva) || 0;
    totalHT += qte * pu;
    totalTVA += (qte * pu) * (tva / 100);
  });
  const totalTTC = totalHT + totalTVA;

  const showLogo = data.showLogo !== false && data.logoBase64 && data.logoNaturalWidth && data.logoNaturalHeight;
  const { width: logoW, height: logoH } = showLogo
    ? getLogoDisplaySize(data.logoNaturalWidth!, data.logoNaturalHeight!, 80)
    : { width: 0, height: 0 };

  return (
    <article
      className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm print:shadow-none print:border print:p-4"
      aria-label="Aperçu de la facture"
    >
      {/* En-tête avec logo optionnel */}
      <div
        className={
          data.logoPosition === "center"
            ? "flex flex-col items-center gap-3"
            : "flex flex-col gap-3"
        }
      >
        {showLogo && data.logoBase64 && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
            src={data.logoBase64}
            alt="Logo"
            className="object-contain"
            style={{ maxHeight: 80, width: logoW, height: logoH }}
          />
          </>
        )}
        <div className={data.logoPosition === "center" ? "text-center" : ""}>
          <h2 className="text-2xl font-bold text-slate-900">FACTURE</h2>
          <p className="mt-1 text-sm text-slate-600">
            N° {data.numero || "—"} · Date : {data.date || "—"}
            {data.dateEcheance && ` · Échéance : ${data.dateEcheance}`}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-500">Émetteur</h3>
          <p className="font-medium text-slate-900">{data.emetteur.nom || "—"}</p>
          <p className="text-sm text-slate-600">
            {[data.emetteur.adresse, data.emetteur.codePostal, data.emetteur.ville]
              .filter(Boolean)
              .join(", ") || "—"}
          </p>
          {data.emetteur.siret && (
            <p className="text-sm text-slate-600">SIRET : {data.emetteur.siret}</p>
          )}
          {data.emetteur.tva && (
            <p className="text-sm text-slate-600">TVA : {data.emetteur.tva}</p>
          )}
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase text-slate-500">Client</h3>
          <p className="font-medium text-slate-900">{data.client.nom || "—"}</p>
          <p className="text-sm text-slate-600">
            {[data.client.adresse, data.client.codePostal, data.client.ville]
              .filter(Boolean)
              .join(", ") || "—"}
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-3 py-2 text-left font-semibold text-slate-700">Désignation</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Qté</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Prix unit.</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">TVA</th>
              <th className="px-3 py-2 text-right font-semibold text-slate-700">Montant HT</th>
            </tr>
          </thead>
          <tbody>
            {data.lignes.map((ligne, i) => {
              const qte = Number(ligne.quantite) || 0;
              const pu = Number(ligne.prixUnitaire) || 0;
              const tva = Number(ligne.tauxTva) || 0;
              const mtHT = qte * pu;
              return (
                <tr key={i} className="border-b border-slate-100">
                  <td className="px-3 py-2 text-slate-800">{ligne.designation || "—"}</td>
                  <td className="px-3 py-2 text-right">{qte}</td>
                  <td className="px-3 py-2 text-right">{formatMontant(pu, data.devise)}</td>
                  <td className="px-3 py-2 text-right">{tva} %</td>
                  <td className="px-3 py-2 text-right">{formatMontant(mtHT, data.devise)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <div className="text-right text-sm">
          <p>
            <span className="font-medium text-slate-600">Total HT :</span>{" "}
            {formatMontant(totalHT, data.devise)}
          </p>
          <p>
            <span className="font-medium text-slate-600">TVA :</span>{" "}
            {formatMontant(totalTVA, data.devise)}
          </p>
          <p className="text-lg font-bold text-slate-900">
            Total TTC : {formatMontant(totalTTC, data.devise)}
          </p>
        </div>
      </div>

      {(data.conditionsPaiement || data.mentionsLegales) && (
        <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          {data.conditionsPaiement && (
            <p>Conditions de paiement : {data.conditionsPaiement}</p>
          )}
          {data.mentionsLegales && <p className="mt-1">Mentions : {data.mentionsLegales}</p>}
        </div>
      )}

      {/* Pied de page personnalisé */}
      {data.showFooter && data.footer && data.footer.trim() && (
        <div
          className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-600 whitespace-pre-line"
          role="contentinfo"
        >
          {data.footer}
        </div>
      )}
    </article>
  );
}
