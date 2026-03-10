"use client";

import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { DonneesFacture, Emetteur, Client, LigneFacture } from "@/types/facture";
import ApercuFacture from "@/components/ApercuFacture";
import { genererPdf } from "@/lib/genererPdf";
import { processLogoFile } from "@/lib/logoUtils";

const defaultLigne: LigneFacture = {
  designation: "",
  quantite: 1,
  prixUnitaire: 0,
  tauxTva: 20,
};

const defaultEmetteur: Emetteur = {
  nom: "",
  siret: "",
  tva: "",
  adresse: "",
  codePostal: "",
  ville: "",
  email: "",
};

const defaultClient: Client = {
  nom: "",
  adresse: "",
  codePostal: "",
  ville: "",
};

const FOOTER_MAX_LENGTH = 500;

const CONDITIONS_OPTIONS: { value: string; label: string }[] = [
  { value: "Virement bancaire sous 30 jours", label: "Virement (30 jours)" },
  { value: "Virement bancaire sous 45 jours", label: "Virement (45 jours)" },
  { value: "Paiement à réception de facture", label: "À réception" },
  { value: "Chèque à l'ordre de l'émetteur", label: "Chèque" },
  { value: "Paiement par PayPal", label: "PayPal" },
  { value: "Paiement comptant", label: "Comptant" },
  { value: "", label: "Autre (saisie libre)" },
];

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(isoDate);
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

export default function GenerateurFactureClient() {
  const [numero, setNumero] = useState("");
  const [date, setDate] = useState(formatDate(new Date()));
  const [dateEcheance, setDateEcheance] = useState(addDays(formatDate(new Date()), 30));
  const [emetteur, setEmetteur] = useState<Emetteur>(defaultEmetteur);
  const [client, setClient] = useState<Client>(defaultClient);
  const [lignes, setLignes] = useState<LigneFacture[]>([{ ...defaultLigne }]);
  const [devise, setDevise] = useState("€");
  const [mentionsLegales, setMentionsLegales] = useState("");
  const [conditionsPaiement, setConditionsPaiement] = useState(CONDITIONS_OPTIONS[0].value);
  const [conditionsCustom, setConditionsCustom] = useState("");
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoNaturalWidth, setLogoNaturalWidth] = useState<number>(0);
  const [logoNaturalHeight, setLogoNaturalHeight] = useState<number>(0);
  const [logoPosition, setLogoPosition] = useState<"left" | "center">("left");
  const [showLogo, setShowLogo] = useState(true);
  const [footer, setFooter] = useState("");
  const [showFooter, setShowFooter] = useState(true);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [templateTitle, setTemplateTitle] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Préremplissage depuis une page niche (?template=slug)
  useEffect(() => {
    const templateSlug = searchParams.get("template");
    if (!templateSlug) return;
    fetch(`/api/templates/${encodeURIComponent(templateSlug)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { defaultNotes?: string | null; title?: string } | null) => {
        if (data?.defaultNotes) setMentionsLegales(data.defaultNotes);
        if (data?.title) setTemplateTitle(data.title);
      })
      .catch(() => {});
  }, [searchParams]);

  const updateEmetteur = useCallback((field: keyof Emetteur, value: string) => {
    setEmetteur((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateClient = useCallback((field: keyof Client, value: string) => {
    setClient((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateLigne = useCallback((index: number, field: keyof LigneFacture, value: string | number) => {
    setLignes((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  }, []);

  const ajouterLigne = () => setLignes((prev) => [...prev, { ...defaultLigne }]);
  const supprimerLigne = (index: number) => {
    if (lignes.length <= 1) return;
    setLignes((prev) => prev.filter((_, i) => i !== index));
  };

  const setDueDatePlus30 = () => setDateEcheance(date ? addDays(date, 30) : "");

  const handleLogoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setLogoError(null);
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const result = await processLogoFile(file);
        setLogoBase64(result.base64);
        setLogoNaturalWidth(result.naturalWidth);
        setLogoNaturalHeight(result.naturalHeight);
      } catch (err) {
        setLogoError(err instanceof Error ? err.message : "Erreur lors du chargement du logo.");
      }
      e.target.value = "";
    },
    []
  );

  const removeLogo = () => {
    setLogoBase64(null);
    setLogoNaturalWidth(0);
    setLogoNaturalHeight(0);
    setLogoError(null);
  };

  const effectiveConditions =
    conditionsPaiement.trim() === "" ? conditionsCustom : conditionsPaiement;

  const donnees: DonneesFacture = {
    numero,
    date,
    dateEcheance: dateEcheance || undefined,
    emetteur,
    client,
    lignes,
    devise,
    mentionsLegales: mentionsLegales || undefined,
    conditionsPaiement: effectiveConditions || undefined,
    logoBase64: logoBase64 || undefined,
    logoNaturalWidth: logoNaturalWidth || undefined,
    logoNaturalHeight: logoNaturalHeight || undefined,
    logoPosition,
    showLogo,
    footer: footer.slice(0, FOOTER_MAX_LENGTH),
    showFooter,
  };

  const handleDownloadPdf = () => genererPdf(donnees);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Créer votre facture
          {templateTitle && (
            <span className="block text-xl font-normal text-primary-600 mt-1">{templateTitle}</span>
          )}
        </h1>
        <p className="mt-2 text-slate-600">
          Remplissez le formulaire. L&apos;aperçu se met à jour en direct. Téléchargez le PDF quand vous êtes prêt.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Formulaire */}
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Numéro et dates</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">N° facture</span>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="ex. 2025-001"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="text-sm font-medium text-slate-700">Date d&apos;échéance</span>
                <div className="mt-1 flex gap-2">
                  <input
                    type="date"
                    value={dateEcheance}
                    onChange={(e) => setDateEcheance(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    aria-describedby="due-date-hint"
                  />
                  <button
                    type="button"
                    onClick={setDueDatePlus30}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 min-h-[44px]"
                    id="due-date-hint"
                  >
                    J+30
                  </button>
                </div>
              </label>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6" aria-labelledby="logo-heading">
            <h2 id="logo-heading" className="text-lg font-semibold text-slate-900">Logo entreprise</h2>
            <div className="mt-4 space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-700">Afficher un logo sur la facture</span>
              </label>
              {showLogo && (
                <>
                  <div>
                    <span className="text-sm font-medium text-slate-700">Fichier (JPG, PNG ou SVG — max 2 Mo)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/svg+xml"
                      onChange={handleLogoUpload}
                      className="mt-1 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-primary-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
                      aria-describedby="logo-format"
                    />
                    <p id="logo-format" className="mt-1 text-xs text-slate-500">
                      Hauteur max. 80 px sur la facture, largeur proportionnelle.
                    </p>
                    {logoError && (
                      <p className="mt-2 text-sm text-red-600" role="alert">
                        {logoError}
                      </p>
                    )}
                  </div>
                  {logoBase64 && (
                    <div className="flex flex-wrap items-end gap-4">
                      <div className="rounded-lg border border-slate-200 bg-white p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={logoBase64}
                          alt="Aperçu du logo"
                          className="max-h-[80px] w-auto object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="text-sm text-red-600 hover:underline min-h-[44px]"
                      >
                        Supprimer le logo
                      </button>
                    </div>
                  )}
                  {logoBase64 && (
                    <div>
                      <span className="text-sm font-medium text-slate-700">Position du logo</span>
                      <div className="mt-2 flex gap-4">
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="logoPosition"
                            value="left"
                            checked={logoPosition === "left"}
                            onChange={() => setLogoPosition("left")}
                            className="border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-700">Gauche</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="logoPosition"
                            value="center"
                            checked={logoPosition === "center"}
                            onChange={() => setLogoPosition("center")}
                            className="border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-slate-700">Centré</span>
                        </label>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Vos informations (émetteur)</h2>
            <div className="mt-4 space-y-4">
              {(["nom", "siret", "tva", "adresse", "codePostal", "ville", "email"] as const).map(
                (field) => (
                  <label key={field} className="block">
                    <span className="text-sm font-medium text-slate-700">
                      {field === "nom" && "Nom ou raison sociale"}
                      {field === "siret" && "SIRET (optionnel)"}
                      {field === "tva" && "N° TVA (optionnel)"}
                      {field === "adresse" && "Adresse"}
                      {field === "codePostal" && "Code postal"}
                      {field === "ville" && "Ville"}
                      {field === "email" && "Email (optionnel)"}
                    </span>
                    <input
                      type={field === "email" ? "email" : "text"}
                      value={emetteur[field] ?? ""}
                      onChange={(e) => updateEmetteur(field, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    />
                  </label>
                )
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Client</h2>
            <div className="mt-4 space-y-4">
              {(["nom", "adresse", "codePostal", "ville"] as const).map((field) => (
                <label key={field} className="block">
                  <span className="text-sm font-medium text-slate-700">
                    {field === "nom" && "Nom ou raison sociale"}
                    {field === "adresse" && "Adresse"}
                    {field === "codePostal" && "Code postal"}
                    {field === "ville" && "Ville"}
                  </span>
                  <input
                    type="text"
                    value={client[field] ?? ""}
                    onChange={(e) => updateClient(field, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  />
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Lignes de facturation</h2>
              <button
                type="button"
                onClick={ajouterLigne}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 min-h-[44px]"
              >
                + Ligne
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {lignes.map((ligne, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-white p-4 space-y-3"
                >
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-slate-600">Ligne {i + 1}</span>
                    {lignes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => supprimerLigne(i)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Désignation"
                    value={ligne.designation}
                    onChange={(e) => updateLigne(i, "designation", e.target.value)}
                    className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      min={0}
                      step={1}
                      placeholder="Qté"
                      value={ligne.quantite || ""}
                      onChange={(e) => updateLigne(i, "quantite", Number(e.target.value) || 0)}
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="Prix unit."
                      value={ligne.prixUnitaire || ""}
                      onChange={(e) =>
                        updateLigne(i, "prixUnitaire", Number(e.target.value) || 0)
                      }
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    />
                    <select
                      value={ligne.tauxTva}
                      onChange={(e) => updateLigne(i, "tauxTva", Number(e.target.value))}
                      className="rounded border border-slate-300 px-3 py-2 text-sm"
                    >
                      <option value={0}>0 %</option>
                      <option value={2.1}>2,1 %</option>
                      <option value={5.5}>5,5 %</option>
                      <option value={10}>10 %</option>
                      <option value={20}>20 %</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6" aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="text-lg font-semibold text-slate-900">Pied de page</h2>
            <p className="mt-1 text-sm text-slate-600">
              SIRET, TVA, coordonnées bancaires, conditions, etc.
            </p>
            <label className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                checked={showFooter}
                onChange={(e) => setShowFooter(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-slate-700">Afficher un pied de page sur la facture</span>
            </label>
            {showFooter && (
              <label className="mt-4 block">
                <span className="text-sm font-medium text-slate-700">
                  Texte du pied de page ({footer.length}/{FOOTER_MAX_LENGTH} caractères)
                </span>
                <textarea
                  value={footer}
                  onChange={(e) => setFooter(e.target.value.slice(0, FOOTER_MAX_LENGTH))}
                  rows={5}
                  maxLength={FOOTER_MAX_LENGTH}
                  placeholder="Ex. SIRET 123 456 789 00012 — TVA FR12345678901 — IBAN FR76 1234 5678 9012 3456 7890 123 — Paiement à réception."
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  aria-describedby="footer-limit"
                />
                <p id="footer-limit" className="mt-1 text-xs text-slate-500">
                  Maximum {FOOTER_MAX_LENGTH} caractères pour éviter les débordements.
                </p>
              </label>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
            <h2 className="text-lg font-semibold text-slate-900">Mentions et conditions</h2>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">Devise</span>
              <select
                value={devise}
                onChange={(e) => setDevise(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                <option value="€">€ (euro)</option>
                <option value="CHF">CHF</option>
                <option value="CAD">CAD</option>
                <option value="$">$ (USD)</option>
              </select>
            </label>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">Conditions de paiement</span>
              <select
                value={conditionsPaiement}
                onChange={(e) => setConditionsPaiement(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              >
                {CONDITIONS_OPTIONS.map((opt) => (
                  <option key={opt.value || "autre"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
            {conditionsPaiement === "" && (
              <label className="mt-4 block">
                <span className="text-sm font-medium text-slate-700">Saisie libre</span>
                <input
                  type="text"
                  value={conditionsCustom}
                  onChange={(e) => setConditionsCustom(e.target.value)}
                  placeholder="Ex. Virement sous 30 jours"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                />
              </label>
            )}
            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">Mentions légales (optionnel)</span>
              <textarea
                value={mentionsLegales}
                onChange={(e) => setMentionsLegales(e.target.value)}
                rows={2}
                placeholder="Ex. TVA non applicable, art. 293 B du CGI"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
              />
            </label>
          </section>
        </div>

        {/* Aperçu + PDF */}
        <div className="space-y-6">
          <div className="sticky top-4">
            <ApercuFacture data={donnees} />
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="mt-6 w-full min-h-[48px] rounded-xl bg-primary-600 px-6 py-4 text-lg font-semibold text-white shadow-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Télécharger le PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
