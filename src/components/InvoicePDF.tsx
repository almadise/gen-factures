import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

// Type des données reçues (aligné avec InvoiceForm)
export interface InvoicePDFData {
  sender: string;
  client: string;
  items: { description: string; quantity: number; price: number }[];
  taxRate: number;
}

function getContrastColor(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff;
  const g = (n >> 8) & 0xff;
  const b = n & 0xff;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

function formatAmount(value: number): string {
  const numeric = Number.isNaN(Number(value)) ? 0 : Number(value);
  return numeric.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// Définition des styles pour le PDF (couleurs dynamiques via props)
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  pageWithBorder: { borderTopWidth: 4 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  section: { marginBottom: 20 },
  label: {
    fontSize: 10,
    color: "#9ca3af",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 8,
  },
  tableHeader: { fontWeight: "bold", borderBottomWidth: 2, paddingVertical: 8 },
  colDesc: { flex: 6 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 2, textAlign: "right" },
  totalSection: { marginTop: 30, alignItems: "flex-end" },
  totalRow: {
    flexDirection: "row",
    width: 220,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  grandTotal: { fontWeight: "bold", fontSize: 14 },
  legalNotice: {
    fontSize: 9,
    marginTop: 20,
    fontStyle: "italic",
    color: "#4b5563",
  },
});

interface InvoicePDFProps {
  data: InvoicePDFData;
  accentColor: string;
  isAutoEntrepreneur: boolean;
}

export function InvoicePDF({
  data,
  accentColor,
  isAutoEntrepreneur,
}: InvoicePDFProps) {
  const subTotal = data.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const tax = isAutoEntrepreneur ? 0 : (subTotal * data.taxRate) / 100;
  const textOnAccent = getContrastColor(accentColor);

  return (
    <Document>
      <Page
        size="A4"
        style={[styles.page, styles.pageWithBorder, { borderTopColor: accentColor }]}
      >
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { backgroundColor: accentColor, color: textOnAccent },
            ]}
          >
            FACTURE
          </Text>
          <Text>N° {Math.floor(Math.random() * 10000)}</Text>
        </View>

        <View
          style={{
            borderBottomWidth: 2,
            borderBottomColor: accentColor,
            marginBottom: 24,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View>
            <Text style={styles.label}>De :</Text>
            <Text>{data.sender || "Votre entreprise"}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.label}>Pour :</Text>
            <Text>{data.client || "Votre client"}</Text>
          </View>
        </View>

        <View
          style={[
            styles.row,
            styles.tableHeader,
            {
              backgroundColor: accentColor,
              borderBottomColor: accentColor,
            },
          ]}
        >
          <Text style={[styles.colDesc, { color: textOnAccent }]}>
            Description
          </Text>
          <Text style={[styles.colQty, { color: textOnAccent }]}>Qté</Text>
          <Text style={[styles.colPrice, { color: textOnAccent }]}>
            Prix HT
          </Text>
        </View>

        {data.items.map((item, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.colDesc}>{item.description || "—"}</Text>
            <Text style={styles.colQty}>{String(item.quantity)}</Text>
            <Text style={styles.colPrice}>
              {formatAmount(Number(item.price))} €
            </Text>
          </View>
        ))}

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text>Total HT:</Text>
            <Text>{formatAmount(subTotal)} €</Text>
          </View>
          {!isAutoEntrepreneur && (
            <View style={styles.totalRow}>
              <Text>TVA ({data.taxRate}%):</Text>
              <Text>{formatAmount(tax)} €</Text>
            </View>
          )}
          <View
            style={[styles.totalRow, styles.grandTotal, { color: accentColor }]}
          >
            <Text>
              Total {isAutoEntrepreneur ? "Net à payer" : "TTC"}:
            </Text>
            <Text>{formatAmount(subTotal + tax)} €</Text>
          </View>
        </View>

        {isAutoEntrepreneur && (
          <Text style={styles.legalNotice}>
            TVA non applicable, art. 293 B du CGI.
          </Text>
        )}
      </Page>
    </Document>
  );
}
