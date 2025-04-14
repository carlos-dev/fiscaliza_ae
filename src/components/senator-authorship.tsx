"use client";

import { useGetSenatorAuthorship } from "@/hooks/useQuery";
import { DeputyCard } from "./ui/deputy-card";
import { useMemo } from "react";

export function SenatorAuthorship({ senatorId }: { senatorId: string }) {
  const { data: authorships, isLoading } = useGetSenatorAuthorship(
    senatorId,
    2024
  );
  const authorsData =
    authorships?.MateriasAutoriaParlamentar.Parlamentar.Autorias.Autoria;

  const authorshipsByMonth = useMemo(() => {
    if (!authorsData) return {};

    return authorsData.reduce((acc, autoria) => {
      const date = new Date(autoria.Materia.Data);
      const monthYear = date.toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(autoria.Materia);
      return acc;
    }, {} as Record<string, (typeof authorsData)[0]["Materia"][]>);
  }, [authorsData]);

  if (!authorsData?.length && !isLoading) return null;

  return (
    <DeputyCard
      title="Autorias"
      subtitle="(Projetos e matérias apresentados em 2024)"
      isLoading={isLoading}
      dialogTitle="Detalhamento das Autorias"
      summary={
        <p className="text-lg">
          Total de autorias:{" "}
          <span className="font-bold">{authorsData?.length || 0}</span>
        </p>
      }
    >
      <div className="space-y-6">
        {Object.entries(authorshipsByMonth).map(([monthYear, materias]) => (
          <div key={monthYear} className="mb-6">
            <h3 className="text-xl font-semibold mb-3 capitalize">
              {monthYear}
            </h3>
            <div className="space-y-3">
              {materias.map((materia) => (
                <div key={materia.Codigo} className="bg-white/10 p-4 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">
                      {materia.DescricaoIdentificacao}
                    </p>
                    <span className="text-sm text-gray-400">
                      {new Date(materia.Data).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200">{materia.Ementa}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DeputyCard>
  );
}
