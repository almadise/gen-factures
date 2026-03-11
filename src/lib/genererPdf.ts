import type { DonneesFacture, LigneFacture } from "@/types/facture";
import { getLogoDisplaySize } from "@/lib/logoUtils";

const LOGO_MAX_HEIGHT = 80;
const PAGE_WIDTH = 210;
const MARGIN = 20;

function formatMontant(value: number, devise: string): string {
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ` ${devise}`;
}

export function genererPdf(data: DonneesFacture): void {
  if (typeof window === "undefined") return;

  import("jspdf").then(({ jsPDF }) => {
    import("jspdf-autotable").then((module) => {
      const doc = new jsPDF();
      const autoTable = module.default;

      let y = MARGIN;

      if (
        data.showLogo !== false &&
        data.logoBase64 &&
        data.logoNaturalWidth != null &&
        data.logoNaturalHeight != null
      ) {
        const w = data.logoNaturalWidth;
        const h = data.logoNaturalHeight;
        const { width: logoW, height: logoH } = getLogoDisplaySize(
          w,
          h,
          LOGO_MAX_HEIGHT
        );
        const logoX =
          data.logoPosition === "center"
            ? (PAGE_WIDTH - logoW) / 2
            : MARGIN;
        const imgFormat = data.logoBase64.startsWith("data:image/jpeg") ? "JPEG" : "PNG";
        doc.addImage(data.logoBase64, imgFormat, logoX, y, logoW, logoH);
        y += logoH + 10;
      }

      doc.setFontSize(22);
      doc.text("FACTURE", MARGIN, y);
      y += 12;

      doc.setFontSize(10);
      doc.text(`N° ${data.numero || "—"}`, MARGIN, y);
      doc.text(`Date : ${data.date || "—"}`, 120, y);
      if (data.dateEcheance) {
        doc.text(`Échéance : ${data.dateEcheance}`, 160, y);
      }
      y += 14;

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("Émetteur", MARGIN, y);
      doc.setFont("helvetica", "normal");
      y += 6;
      doc.text(data.emetteur.nom || "—", MARGIN, y);
      y += 5;
      doc.text(
        [data.emetteur.adresse, data.emetteur.codePostal, data.emetteur.ville].filter(Boolean).join(", ") || "—",
        MARGIN,
        y
      );
      y += 5;
      if (data.emetteur.siret) doc.text(`SIRET : ${data.emetteur.siret}`, MARGIN, y);
      if (data.emetteur.tva) doc.text(`TVA : ${data.emetteur.tva}`, MARGIN, y + (data.emetteur.siret ? 5 : 0));
      if (data.emetteur.siret) y += 5;
      if (data.emetteur.tva) y += 5;
      y += 6;

      doc.setFont("helvetica", "bold");
      doc.text("Client", MARGIN, y);
      doc.setFont("helvetica", "normal");
      y += 6;
      doc.text(data.client.nom || "—", MARGIN, y);
      y += 5;
      doc.text(
        [data.client.adresse, data.client.codePostal, data.client.ville].filter(Boolean).join(", ") || "—",
        MARGIN,
        y
      );
      y += 12;

      const lignesPourTable: string[][] = [];
      let totalHT = 0;
      let totalTVA = 0;

      data.lignes.forEach((l: LigneFacture) => {
        const qte = Number(l.quantite) || 0;
        const pu = Number(l.prixUnitaire) || 0;
        const tva = Number(l.tauxTva) || 0;
        const mtHT = qte * pu;
        const mtTVA = mtHT * (tva / 100);
        totalHT += mtHT;
        totalTVA += mtTVA;
        lignesPourTable.push([
          l.designation || "—",
          String(qte),
          formatMontant(pu, data.devise),
          `${tva} %`,
          formatMontant(mtHT, data.devise),
        ]);
      });

      autoTable(doc, {
        startY: y,
        head: [["Désignation", "Qté", "Prix unitaire", "TVA", "Montant HT"]],
        body: lignesPourTable,
        theme: "grid",
        headStyles: { fillColor: [14, 165, 233] },
        margin: { left: MARGIN },
      });

      const tableEndY = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY;
      y = (tableEndY ?? y + 40) + 10;

      const totalTTC = totalHT + totalTVA;
      doc.setFont("helvetica", "bold");
      doc.text(`Total HT : ${formatMontant(totalHT, data.devise)}`, 120, y);
      y += 6;
      doc.text(`TVA : ${formatMontant(totalTVA, data.devise)}`, 120, y);
      y += 6;
      doc.text(`Total TTC : ${formatMontant(totalTTC, data.devise)}`, 120, y);
      doc.setFont("helvetica", "normal");
      y += 14;

      if (data.conditionsPaiement) {
        doc.setFontSize(9);
        doc.text("Conditions de paiement : " + data.conditionsPaiement, MARGIN, y);
        y += 8;
      }
      if (data.mentionsLegales) {
        doc.text("Mentions : " + data.mentionsLegales, MARGIN, y);
        y += 6;
      }

      const pageHeight = doc.internal.pageSize.height;
      const footerY = pageHeight - 20;

      if (data.showFooter && data.footer && data.footer.trim()) {
        doc.setFontSize(8);
        const footerLines = doc.splitTextToSize(
          data.footer.trim(),
          PAGE_WIDTH - 2 * MARGIN
        );
        let footerStartY = footerY - footerLines.length * 4;
        if (footerStartY < y + 10) footerStartY = y + 10;
        footerLines.forEach((line: string) => {
          doc.text(line, MARGIN, footerStartY);
          footerStartY += 4;
        });
      }

      doc.save(`facture-${(data.numero || "export").replace(/\s/g, "-")}.pdf`);
    });
  });
}
