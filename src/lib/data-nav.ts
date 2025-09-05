// import { Book, ChartArea, FileChartColumn, House, Users } from "lucide-react";
import { Book, ChartArea, FileChartColumn, HandCoins, House, NotebookPen, Users } from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: House,
    },
    {
      title: "Livros",
      url: "/livros",
      icon: Book,
    },
    {
      title: "Membros",
      url: "/membros",
      icon: Users,
    },
    {
      title: "Empréstimos",
      url: "/emprestimos",
      icon: FileChartColumn,
    },
    {
      title: "Relatórios",
      url: "/relatorios",
      icon: ChartArea,
    },
    {
      title: "Gestão de Multas",
      url: "/gestao-de-multas",
      icon: HandCoins
    },
        {
      title: "Gestão de Reservas",
      url: "/gestao-de-reservas",
      icon: NotebookPen
    }
  ],
};