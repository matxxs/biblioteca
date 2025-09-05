// "use client";

// import { Separator } from "@/components/ui/separator";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { HomeIcon } from "lucide-react";
// import { usePathname } from "next/navigation";
// // import { data } from "@/lib/data-nav";

// export function SiteHeader() {
//   const pathname = usePathname(); // 2. Obter a rota atual

//   // 3. Encontrar o item de navegação que corresponde à rota atual
//   // const activeItem = data.navMain.find((item) => item.url === pathname);

//   return (
//     <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2 data-[orientation=vertical]:h-4"
//         />
//         <Breadcrumb>
//           <BreadcrumbList>
//             <BreadcrumbItem>
//               <BreadcrumbLink href="/">
//                 <HomeIcon size={16} aria-hidden="true" />
//                 <span className="sr-only">Home</span>
//               </BreadcrumbLink>
//             </BreadcrumbItem>
//             {activeItem && activeItem.url !== "/" && (
//               <>
//                 <BreadcrumbSeparator />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>{activeItem.title}</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </>
//             )}
//           </BreadcrumbList>
//         </Breadcrumb>
//       </div>
//     </header>
//   );
// }

"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { HomeIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { SIDEBAR } from "@/lib/data-nav";
import { NavItem } from "@/types";

export function SiteHeader() {
  const pathname = usePathname();

  let activeItem: NavItem | null | undefined = null;

  findActiveItems: for (const group of SIDEBAR.navMain) {
    for (const item of group.items) {
      if (item.url === pathname) {
        activeItem = item;
        break findActiveItems;
      }
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/dashboard"
                className="inline-flex items-center gap-1.5"
              >
                <HomeIcon size={16} aria-hidden="true" />
                Início
              </BreadcrumbLink>
            </BreadcrumbItem>
            {activeItem && activeItem.url !== "/dashboard" && (
              <React.Fragment>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {activeItem.name || activeItem.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </React.Fragment>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
