import { Server, AlertTriangle, ArrowRight, Wrench } from "lucide-react"
import { ReturnButton } from "./shared/return-button"

export function ServerError({
  title = "Erro interno do servidor",
  description = "Nossos bibliotecários estão trabalhando para resolver este problema.",
  errorCode = "500",
}: {
  title?: string
  description?: string
  errorCode?: string
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-background via-background to-red-50/20 dark:to-red-950/10">
      {/* Animated floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 animate-float-slow opacity-10">
          <Server className="size-16 text-red-500 rotate-12" />
        </div>
        <div className="absolute top-32 right-16 animate-float-delayed opacity-10">
          <Wrench className="size-12 text-red-500 -rotate-6" />
        </div>
        <div className="absolute bottom-32 left-20 animate-float opacity-10">
          <AlertTriangle className="size-14 text-red-500 rotate-45" />
        </div>
        <div className="absolute bottom-20 right-12 animate-float-slow opacity-10">
          <Server className="size-10 text-red-500 -rotate-12" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        {/* Icon and status */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative bg-card border-2 border-red-500/20 rounded-full p-6 shadow-lg">
              <Server className="size-12 text-red-500 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-red-600 tracking-tight">{title}</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <div className="w-8 h-px bg-border"></div>
              <span className="text-xs uppercase tracking-wider font-medium">{errorCode}</span>
              <div className="w-8 h-px bg-border"></div>
            </div>
          </div>
        </div>

        {/* Main message */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
            Sistema temporariamente indisponível
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-md mx-auto">{description}</p>
        </div>

        {/* Suggestions */}
        <div className="bg-card/50 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-medium text-foreground flex items-center justify-center gap-2">
            <Wrench className="size-4" />O que você pode fazer
          </h3>
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              <span>Aguardar alguns minutos e tentar novamente</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              <span>Verificar sua conexão com a internet</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              <span>Entrar em contato com o suporte técnico</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4">
          <ReturnButton
            variant="default"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          />
        </div>
      </div>
    </div>
  )
}
