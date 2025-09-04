import MembrosComponent from "@/components/membros/membros-component";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membros | Sistema de Biblioteca",
  description: "Cadastro e gestão de membros.",
};

export default async function MembrosPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <MembrosComponent />
        </div>
      </div>
    </div>
  );
}
