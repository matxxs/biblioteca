import {
  Book,
  ChartArea,
  FileChartColumn,
  HandCoins,
  House,
  NotebookPen,
  Users,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/Dashboard",
      icon: House,
    },
    {
      title: "Livros",
      url: "/dashboard/livros",
      icon: Book,
    },
    {
      title: "Membros",
      url: "/dashboard/membros",
      icon: Users,
    },
    {
      title: "Empréstimos",
      url: "/dashboard/emprestimos",
      icon: FileChartColumn,
    },
    {
      title: "Relatórios",
      url: "/dashboard/relatorios",
      icon: ChartArea,
    },
    {
      title: "Gestão de Multas",
      url: "/dashboard/gestao-de-multas",
      icon: HandCoins,
    },
    {
      title: "Gestão de Reservas",
      url: "/dashboard/gestao-de-reservas",
      icon: NotebookPen,
    },
  ],
};
