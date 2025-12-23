import PageLayout from "@/components/layout/PageLayout";
import MainColumn from "@/components/layout/MainColumn";

export default function CreateWorkshop() {
  return (
    <PageLayout>
      <MainColumn>
        <h1 className="text-2xl font-semibold mb-6">Kreiraj novu radionicu</h1>
        {/* Ovdje će doći forma za kreiranje radionice */}
      </MainColumn>
    </PageLayout>
  );
}
