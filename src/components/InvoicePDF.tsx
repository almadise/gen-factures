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

// Styles statiques
const baseStyles = StyleSheet.create({
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
  tableHeaderBase: { fontWeight: "bold", borderBottomWidth: 2, paddingVertical: 8 },
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

// Styles dynamiques selon la couleur d'accent (comme dans votre exemple)
const dynamicStyles = (color: string) =>
  StyleSheet.create({
    headerBackground: {
      backgroundColor: color,
      color: getContrastColor(color),
      padding: 20,
      borderRadius: 4,
    },
    accentText: {
      color: color,
      fontWeight: "bold",
    },
    tableHeader: {
      borderBottomWidth: 2,
      borderBottomColor: color,
      borderBottomStyle: "solid",
      paddingBottom: 5,
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
  const s = dynamicStyles(accentColor);
  const textOnAccent = getContrastColor(accentColor);

  return (
    <Document>
      <Page
        size="A4"
        style={[
          baseStyles.page,
          baseStyles.pageWithBorder,
          { borderTopColor: accentColor },
        ]}
      >
        <View style={baseStyles.header}>
          <View style={s.headerBackground}>
            <Text style={{ fontSize: 24 }}>FACTURE</Text>
          </View>
          <Text>N° {Math.floor(Math.random() * 10000)}</Text>
        </View>

        <View
          style={[s.tableHeader, { marginBottom: 24 }]}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <View>
            <Text style={baseStyles.label}>De :</Text>
            <Text>{data.sender || "Votre entreprise"}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={baseStyles.label}>Pour :</Text>
            <Text>{data.client || "Votre client"}</Text>
          </View>
        </View>

        <View
          style={[
            baseStyles.row,
            baseStyles.tableHeaderBase,
            {
              backgroundColor: accentColor,
              borderBottomColor: accentColor,
            },
          ]}
        >
          <Text style={[baseStyles.colDesc, { color: textOnAccent }]}>Description</Text>
          <Text style={[baseStyles.colQty, { color: textOnAccent }]}>Qté</Text>
          <Text style={[baseStyles.colPrice, { color: textOnAccent }]}>
            Prix HT
          </Text>
        </View>

        {data.items.map((item, i) => (
          <View key={i} style={baseStyles.row}>
            <Text style={baseStyles.colDesc}>{item.description || "—"}</Text>
            <Text style={baseStyles.colQty}>{String(item.quantity)}</Text>
            <Text style={baseStyles.colPrice}>
              {formatAmount(Number(item.price))} €
            </Text>
          </View>
        ))}

        <View style={baseStyles.totalSection}>
          <View style={baseStyles.totalRow}>
            <Text>Total HT:</Text>
            <Text>{formatAmount(subTotal)} €</Text>
          </View>
          {!isAutoEntrepreneur && (
            <View style={baseStyles.totalRow}>
              <Text>TVA ({data.taxRate}%):</Text>
              <Text>{formatAmount(tax)} €</Text>
            </View>
          )}
          <View
            style={[
              baseStyles.totalRow,
              baseStyles.grandTotal,
              s.accentText,
            ]}
          >
            <Text>
              Total {isAutoEntrepreneur ? "Net à payer" : "TTC"}:
            </Text>
            <Text>{formatAmount(subTotal + tax)} €</Text>
          </View>
        </View>

        {isAutoEntrepreneur && (
          <Text style={baseStyles.legalNotice}>
            TVA non applicable, art. 293 B du CGI.
          </Text>
        )}
      </Page>
    </Document>
  );
}
