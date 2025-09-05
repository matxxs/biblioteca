import { Metadata } from "next";
import PageLivros from "@/components/livros/page-livros";

export const metadata: Metadata = {
  title: "Livros | Sistema de Biblioteca",
  description: "Cadastro e gestão de livros.",
};

export default async function LivrosPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageLivros />
        </div>
      </div>
    </div>
  );
}
