"use client";

import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RelatorioLivrosAtraso } from "@/types";

interface LivrosAtrasoTabelaProps {
  livrosAtraso: RelatorioLivrosAtraso[];
}

export function TabelaLivrosAtraso({ livrosAtraso }: LivrosAtrasoTabelaProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:gap-6 lg:px-6">
      <Card className="border-red-200 dark:border-red-900/40">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <CardTitle>Livros em Atraso</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {livrosAtraso.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Livro</TableHead>
                  <TableHead>Membro</TableHead>
                  <TableHead>Data Prevista</TableHead>
                  <TableHead className="text-right">Dias de Atraso</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {livrosAtraso.map((atraso, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {atraso.titulo}
                    </TableCell>
                    <TableCell>{atraso.nomeMembro}</TableCell>
                    <TableCell>
                      {new Date(
                        atraso.dataDevolucaoPrevista
                      ).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">
                        {atraso.diasDeAtraso} dias
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 text-sm text-muted-foreground">
              <p>🎉 Nenhum livro em atraso no momento.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
