import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Award } from "lucide-react";

interface ParliamentaryStatsTabProps {
  attendance: string | number;
  proposedLaws: number;
  approvedLaws: number;
  speeches: number;
}

export function ParliamentaryStatsTab({
  attendance,
  proposedLaws,
  approvedLaws,
  speeches,
}: ParliamentaryStatsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          Estatísticas Gerais
        </CardTitle>
        <CardDescription>
          Dados estatísticos do desempenho parlamentar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Presença em Votações"
            value={`${attendance}%`}
            description="Percentual de presença em votações importantes"
          />
          <StatCard
            title="Taxa de Aprovação"
            value={`${Math.round((approvedLaws / proposedLaws) * 100 || 0)}%`}
            description="Projetos aprovados sobre o total proposto"
          />
          <StatCard
            title="Projetos Propostos"
            value={proposedLaws.toString()}
            description="Número de projetos de lei propostos"
          />
          <StatCard
            title="Discursos Realizados"
            value={speeches.toString()}
            description="Número de discursos em plenário"
          />
        </div>
      </CardContent>
    </Card>
  );
}
