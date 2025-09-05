import { BookOpen, Library, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Library className="size-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Sistema de biblioteca
              </h1>
              <p className="text-sm text-muted-foreground">
                Gerenciamento eficiente do acervo e usuários
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <div className="relative bg-card border-2 border-primary/20 rounded-full p-8 shadow-lg inline-block">
                <BookOpen className="size-16 text-primary animate-bounce-gentle" />
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance">
                Bem-vindo ao Sistema de Bibliotecas
              </h2>
              <p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
                Gerencie sua biblioteca de forma eficiente e moderna. Controle
                acervos, usuários e empréstimos em um só lugar.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 space-y-4 hover:shadow-lg transition-all duration-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto">
                <BookOpen className="size-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Gestão de Acervo
              </h3>
              <p className="text-muted-foreground text-sm">
                Cadastre e organize livros, revistas e outros materiais do seu
                acervo de forma intuitiva.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 space-y-4 hover:shadow-lg transition-all duration-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto">
                <Users className="size-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Controle de Usuários
              </h3>
              <p className="text-muted-foreground text-sm">
                Gerencie cadastros de usuários, histórico de empréstimos e
                permissões de acesso.
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 space-y-4 hover:shadow-lg transition-all duration-200">
              <div className="bg-primary/10 p-3 rounded-lg w-fit mx-auto">
                <Search className="size-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Busca Avançada
              </h3>
              <p className="text-muted-foreground text-sm">
                Encontre rapidamente qualquer item do acervo com filtros
                inteligentes e busca por múltiplos critérios.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Pronto para começar?
            </h3>
            <p className="text-muted-foreground">
              Acesse o sistema e comece a gerenciar sua biblioteca de forma mais
              eficiente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  Acessar Sistema
                </Button>
              </Link>
              <Link href="#" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 bg-transparent"
                >
                  Saiba Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Sistema de Biblioteca - Gerenciamento.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
