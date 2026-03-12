"use client";

import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/InvoicePDF";

function getContrastColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

// Structure de données de la facture
interface InvoiceData {
  sender: string;
  client: string;
  items: { description: string; quantity: number; price: number }[];
  taxRate: number;
}

const colorPresets = [
  { name: "Noir", value: "#000000" },
  { name: "Bleu", value: "#2563eb" },
  { name: "Vert", value: "#16a34a" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Orange", value: "#ea580c" },
];

/** Normalise une couleur en #RRGGBB pour comparaison et envoi au PDF */
function normalizeHex(hex: string): string {
  const match = hex.match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
  if (!match) return "#000000";
  let s = match[1];
  if (s.length === 3)
    s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
  return "#" + s.toLowerCase();
}

export default function InvoiceForm() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    sender: "",
    client: "",
    items: [{ description: "", quantity: 1, price: 0 }],
    taxRate: 20,
  });
  const [accentColor, setAccentColor] = useState("#000000");
  const [isAutoEntrepreneur, setIsAutoEntrepreneur] = useState(false);

  // Calculs automatiques
  const subTotal = invoice.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const taxAmount = isAutoEntrepreneur
    ? 0
    : (subTotal * invoice.taxRate) / 100;
  const total = subTotal + taxAmount;

  // Fonctions pour modifier les items
  const addItem = () =>
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: "", quantity: 1, price: 0 }],
    });

  const updateItem = (
    index: number,
    field: keyof InvoiceData["items"][0],
    value: string | number
  ) => {
    const newItems = [...invoice.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setInvoice({ ...invoice, items: newItems });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* --- FORMULAIRE (À GAUCHE) --- */}
      <div className="space-y-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold border-b pb-4 text-gray-800 text-left">
          Informations de Facturation
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 text-left">
            Vos informations (Emetteur)
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom, Adresse, SIRET, Email..."
            value={invoice.sender}
            onChange={(e) => setInvoice({ ...invoice, sender: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 text-left">
            Client (Destinataire)
          </label>
          <textarea
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Nom du client, Adresse..."
            value={invoice.client}
            onChange={(e) => setInvoice({ ...invoice, client: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-4 text-left">
          <label className="block text-sm font-medium text-gray-700">
            Détail des services
          </label>
          {invoice.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2">
              <input
                className="col-span-6 border rounded p-2 text-sm"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
              />
              <input
                type="number"
                min={0}
                className="col-span-2 border rounded p-2 text-sm text-center"
                placeholder="Qté"
                value={item.quantity || ""}
                onChange={(e) =>
                  updateItem(index, "quantity", Number(e.target.value) || 0)
                }
              />
              <input
                type="number"
                min={0}
                step={0.01}
                className="col-span-4 border rounded p-2 text-sm"
                placeholder="Prix HT"
                value={item.price || ""}
                onChange={(e) =>
                  updateItem(index, "price", Number(e.target.value) || 0)
                }
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-blue-600 text-sm font-bold hover:text-blue-800"
          >
            + Ajouter une ligne
          </button>
        </div>

      </div>

      {/* --- APERÇU (À DROITE) --- */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-left">
        <div
          className="bg-white min-h-[500px] p-10 text-gray-800 rounded shadow-inner overflow-hidden border-t-4"
          style={{ borderTopColor: normalizeHex(accentColor) }}
        >
          <div className="flex justify-between items-start mb-10">
            <h1
              className="text-3xl font-black uppercase tracking-tighter italic px-3 py-1 rounded"
              style={{
                backgroundColor: normalizeHex(accentColor),
                color: getContrastColor(normalizeHex(accentColor)),
              }}
            >
              FACTURE
            </h1>
            <div className="text-right text-sm">
              <p className="font-bold">
                Date: {new Date().toLocaleDateString("fr-FR")}
              </p>
              <p>N°: {Math.floor(Math.random() * 10000)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="whitespace-pre-line">
              <p className="text-xs uppercase font-bold text-gray-400">De :</p>
              <p className="text-sm">
                {invoice.sender || "Vos coordonnées..."}
              </p>
            </div>
            <div className="whitespace-pre-line text-right">
              <p className="text-xs uppercase font-bold text-gray-400">Pour :</p>
              <p className="text-sm">
                {invoice.client || "Coordonnées client..."}
              </p>
            </div>
          </div>

          <table className="w-full text-sm mb-10">
            <thead>
              <tr
                className="border-b-2"
                style={{
                  borderBottomColor: normalizeHex(accentColor),
                  backgroundColor: normalizeHex(accentColor),
                  color: getContrastColor(normalizeHex(accentColor)),
                }}
              >
                <th className="text-left py-2">Description</th>
                <th className="text-center py-2">Qté</th>
                <th className="text-right py-2">Prix</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50">
                  <td className="py-2">{item.description || "Service..."}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">
                    {Number(item.price).toFixed(2)} €
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-48 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total HT:</span>
                <span>{subTotal.toFixed(2)} €</span>
              </div>
              {!isAutoEntrepreneur && (
                <div className="flex justify-between text-sm">
                  <span>TVA ({invoice.taxRate}%):</span>
                  <span>{taxAmount.toFixed(2)} €</span>
                </div>
              )}
              <div
                className="flex justify-between text-sm font-bold border-t pt-2"
                style={{ color: normalizeHex(accentColor) }}
              >
                <span>
                  Total {isAutoEntrepreneur ? "Net à payer" : "TTC"}:
                </span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {isAutoEntrepreneur && (
            <p className="mt-4 text-xs italic text-gray-600 text-left">
              TVA non applicable, art. 293 B du CGI.
            </p>
          )}
        </div>

        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
          <label className="flex items-center cursor-pointer gap-3">
            <input
              type="checkbox"
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              checked={isAutoEntrepreneur}
              onChange={(e) => setIsAutoEntrepreneur(e.target.checked)}
            />
            <div>
              <span className="block font-bold text-blue-900 text-sm">
                Je suis Micro-entrepreneur (Franchise de TVA)
              </span>
              <span className="block text-blue-700 text-xs">
                Ajoute automatiquement la mention &quot;TVA non applicable,
                art. 293 B du CGI&quot;
              </span>
            </div>
          </label>
        </div>

        <div className="mb-6 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
          <label className="mb-3 block text-sm font-semibold text-gray-800">
            Couleur d&apos;accent du PDF
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {colorPresets.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => setAccentColor(color.value)}
                className={`h-10 w-10 rounded-full border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ${
                  normalizeHex(accentColor) === color.value
                    ? "border-gray-900 scale-110 shadow-md ring-2 ring-gray-300"
                    : "border-gray-200 hover:border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
                aria-label={color.name}
              />
            ))}
            <label className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-dashed border-gray-300 p-0.5 transition-colors hover:border-gray-400">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(normalizeHex(e.target.value))}
                className="h-9 w-9 cursor-pointer rounded-full border-0 bg-transparent p-0"
                aria-label="Couleur personnalisée"
              />
              <span className="pr-2 text-xs font-medium text-gray-500">
                Personnalisée
              </span>
            </label>
          </div>
        </div>

        <PDFDownloadLink
          key={`${normalizeHex(accentColor)}-${isAutoEntrepreneur}`}
          document={
            <InvoicePDF
              data={invoice}
              accentColor={normalizeHex(accentColor)}
              isAutoEntrepreneur={isAutoEntrepreneur}
            />
          }
          fileName={`facture-${new Date().getTime()}.pdf`}
          className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-transform active:scale-95"
        >
          {({ loading }) =>
            loading ? "Génération du PDF..." : "⬇️ Télécharger en PDF (Gratuit)"
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
}
