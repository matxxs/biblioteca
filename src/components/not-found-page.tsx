"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFoundPage() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Garante que o código só rode no lado do cliente
    if (typeof window !== "undefined" && window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  return (
    // A classe h-screen foi adicionada aqui para garantir a altura total da tela
    <main className="relative flex h-screen flex-col items-center justify-center bg-white p-4 text-center dark:bg-black">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(120,113,108,0.1),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-8xl font-black tracking-tighter sm:text-9xl bg-gradient-to-br from-blue-500 via-blue-100 to-blue-500 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-200 sm:text-3xl">
          Not Found
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-slate-600 dark:text-slate-400">
          Oops! Parece que o recurso que você procura não existe ou foi movido.
          Que tal voltar para um lugar seguro?
        </p>

        {canGoBack ? (
          <Button
            className="mt-8 gap-2 font-semibold"
            size="lg"
            onClick={() => router.back()}
          >
            Voltar para a página anterior
          </Button>
        ) : (
          <Button asChild className="mt-8 font-semibold" size="lg">
            <Link href="/welcome">Ir para a página de boas-vindas</Link>
          </Button>
        )}
      </div>
    </main>
  );
}