import { Wifi, WifiOff, ArrowRight, Router } from "lucide-react"
import { ReturnButton } from "./shared/return-button"

export function BadGateway({
  title = "Gateway inválido",
  description = "Não foi possível conectar com os serviços da biblioteca. Tente novamente em alguns instantes.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-background to-orange-50/20 dark:to-orange-950/10">
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float-slow opacity-10">
          <WifiOff className="size-16 text-orange-500 rotate-12" />
        </div>
        <div className="absolute top-32 right-16 animate-float-delayed opacity-10">
          <Router className="size-12 text-orange-500 -rotate-6" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float opacity-10">
          <Wifi className="size-14 text-orange-500 rotate-45" />
        </div>
        <div className="absolute bottom-20 right-12 animate-float-slow opacity-10">
          <WifiOff className="size-10 text-orange-500 -rotate-12" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Icon and status */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-card border-2 border-orange-500/20 rounded-full p-6 shadow-lg">
              <WifiOff className="size-12 text-orange-500 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-orange-600 tracking-tight">{title}</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="w-8 h-px bg-border"></div>
              <span className="text-xs uppercase tracking-wider font-medium">502</span>
              <div className="w-8 h-px bg-border"></div>
            </div>
          </div>
        </div>

        {/* Main message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
            Conexão com a biblioteca interrompida
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-md mx-auto">{description}</p>
        </div>

        {/* Suggestions */}
        <div className="bg-card/50 backdrop-blur-sm border border-orange-200/50 dark:border-orange-800/50 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center justify-center gap-2">
            <Router className="size-4" />
            Soluções recomendadas
          </h3>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              <span>Recarregar a página em alguns segundos</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              <span>Verificar sua conexão de internet</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              <span>Tentar acessar novamente mais tarde</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4">
          <ReturnButton
            variant="default"
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          />
        </div>
      </div>
    </div>
  )
}
