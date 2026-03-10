export default function GuideFacturationPage() {
  return (
    <div className="prose prose-slate max-w-none">
      <h1 className="text-3xl font-bold text-slate-900">Guide de la facturation</h1>
      <p className="mt-4 text-slate-600">
        Guide complet à venir (obligations, TVA, délais). En attendant, utilisez notre{" "}
        <a href="/generateur-facture" className="text-primary-600 hover:underline">
          générateur de factures gratuit
        </a>
        .
      </p>
    </div>
  );
}
