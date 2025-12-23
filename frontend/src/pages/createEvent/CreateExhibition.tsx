import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";

export default function CreateExhibition() {
  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Kreiraj novu izložbu</h1>
        {/* Ovdje će doći forma za kreiranje izložbe */}
      </MainColumn>
    </PageLayout>
  );
}
