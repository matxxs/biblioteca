import { PageEmprestimos } from "@/components/emprestimos/emprestimos-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Empréstimos | Sistema de Biblioteca",
  description: "Cadastro e gestão de empréstimos.",
};

export default async function EmprestimosPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageEmprestimos />
        </div>
      </div>
    </div>
  );
}
