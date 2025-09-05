// import {
//   Book,
//   ChartArea,
//   FileChartColumn,
//   HandCoins,
//   House,
//   NotebookPen,
//   Users,
// } from "lucide-react";

// export const data = {
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "/Dashboard",
//       icon: House,
//     },
//     {
//       title: "Gestão de Acervo",
//       url: "/dashboard/livros",
//       icon: Book,
//     },
//     {
//       title: "Controle de Usuários",
//       url: "/dashboard/membros",
//       icon: Users,
//     },
//     {
//       title: "Empréstimos",
//       url: "/dashboard/emprestimos",
//       icon: FileChartColumn,
//     },
//     {
//       title: "Relatórios",
//       url: "/dashboard/relatorios",
//       icon: ChartArea,
//     },
//     {
//       title: "Gestão de Multas",
//       url: "/dashboard/gestao-de-multas",
//       icon: HandCoins,
//     },
//     {
//       title: "Gestão de Reservas",
//       url: "/dashboard/gestao-de-reservas",
//       icon: NotebookPen,
//     },
//   ],
// };

import {
  Book,
  ChartArea,
  FileChartColumn,
  HandCoins,
  Home,
  NotebookPen,
  Users,
} from "lucide-react";

export const SIDEBAR = {
  navMain: [
    {
      title: "Sistema",
      items: [
        { name: "Dashboard", url: "/dashboard", icon: Home },
        {
          name: "Empréstimos",
          url: "/dashboard/emprestimos",
          icon: FileChartColumn,
        },
        {
          name: "Relatórios",
          url: "/dashboard/relatorios",
          icon: ChartArea,
        },
        {
          name: "Controle de Usuários",
          url: "/dashboard/membros",
          icon: Users,
        },
      ],
    },
    {
      title: "Gestões",
      items: [
        {
          name: "Gestão de Acervo",
          url: "/dashboard/livros",
          icon: Book,
        },
        {
          name: "Gestão de Multas",
          url: "/dashboard/gestao-de-multas",
          icon: HandCoins,
        },
        {
          name: "Gestão de Reservas",
          url: "/dashboard/gestao-de-reservas",
          icon: NotebookPen,
        },
      ],
    },
  ],
};
