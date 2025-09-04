import {
  AlertTriangle,
  CheckCircle,
  CheckCircle2,
  CircleSlash,
  CircleX,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StatusEmprestimosBadgeProps {
  dataDevolucaoReal?: string;
  dataDevolucaoPrevista: string;
}

export const StatusMembrosBadge = ({ status }: { status: string }) => {
  const statusConfig = {
    Ativo: {
      icon: <CheckCircle2 className="text-green-500" />,
      text: "Ativo",
    },
    Bloqueado: {
      icon: <CircleSlash className="text-red-500" />,
      text: "Bloqueado",
    },
    Inativo: {
      icon: <CircleX className="text-gray-500" />,
      text: "Inativo",
    },
  };

  type StatusKey = keyof typeof statusConfig;
  const currentStatus =
    statusConfig[status as StatusKey] || statusConfig.Inativo;

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border bg-transparent px-2 py-0.5 text-xs font-medium text-foreground">
      <span className="[&>svg]:size-3.5">{currentStatus.icon}</span>
      <span>{currentStatus.text}</span>
    </div>
  );
};

export const StatusEmprestimosBadge = ({
  dataDevolucaoReal,
  dataDevolucaoPrevista,
}: StatusEmprestimosBadgeProps) => {
  if (dataDevolucaoReal) {
    return (
      <Badge
        variant="outline"
        className="text-green-600 border-green-200 bg-green-50"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Devolvido
      </Badge>
    );
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataPrevista = new Date(dataDevolucaoPrevista);

  if (dataPrevista < hoje) {
    const diffTime = Math.abs(hoje.getTime() - dataPrevista.getTime());
    const diasAtraso = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
      <Badge variant="destructive">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Atrasado ({diasAtraso} {diasAtraso > 1 ? "dias" : "dia"})
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="text-blue-600 border-blue-200 bg-blue-50"
    >
      <Clock className="h-3 w-3 mr-1" />
      Emprestado
    </Badge>
  );
};
