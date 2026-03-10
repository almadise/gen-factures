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

// Définition des styles pour le PDF (proche du rendu Tailwind)
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12, fontFamily: "Helvetica" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#2563eb" },
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
  tableHeader: {
    fontWeight: "bold",
    borderBottomColor: "#1f2937",
    borderBottomWidth: 2,
  },
  colDesc: { flex: 6 },
  colQty: { flex: 1, textAlign: "center" },
  colPrice: { flex: 2, textAlign: "right" },
  totalSection: { marginTop: 30, alignItems: "flex-end" },
  totalRow: {
    flexDirection: "row",
    width: 150,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  grandTotal: { color: "#2563eb", fontWeight: "bold", fontSize: 14 },
});

interface InvoicePDFProps {
  data: InvoicePDFData;
}

export function InvoicePDF({ data }: InvoicePDFProps) {
  const subTotal = data.items.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );
  const tax = (subTotal * data.taxRate) / 100;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>FACTURE</Text>
          <Text>N° {Math.floor(Math.random() * 10000)}</Text>
        </View>

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

        <View style={[styles.row, styles.tableHeader]}>
          <Text style={styles.colDesc}>Description</Text>
          <Text style={styles.colQty}>Qté</Text>
          <Text style={styles.colPrice}>Prix HT</Text>
        </View>

        {data.items.map((item, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.colDesc}>{item.description || "—"}</Text>
            <Text style={styles.colQty}>{String(item.quantity)}</Text>
            <Text style={styles.colPrice}>
              {Number(item.price).toFixed(2)} €
            </Text>
          </View>
        ))}

        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text>Total HT:</Text>
            <Text>{subTotal.toFixed(2)} €</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>TVA ({data.taxRate}%):</Text>
            <Text>{tax.toFixed(2)} €</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>Total TTC:</Text>
            <Text>{(subTotal + tax).toFixed(2)} €</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
