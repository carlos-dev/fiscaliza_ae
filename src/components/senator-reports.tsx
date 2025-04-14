"use client";

import { useGetReportsSenator } from "@/hooks/useQuery";
import { DeputyCard } from "./ui/deputy-card";
import { useMemo } from "react";

export function SenatorReports({ senatorId }: { senatorId: string }) {
  const { data: reports, isLoading } = useGetReportsSenator(senatorId, 2024);
  const reportsData =
    reports?.MateriasRelatoriaParlamentar?.Parlamentar?.Relatorias?.Relatoria;
  console.log({
    reportsData: reports,
  });

  const reportsByMonth = useMemo(() => {
    // console.log({ reportsData });

    if (!reportsData) return {};

    return reportsData.reduce((acc, relatoria) => {
      const date = new Date(relatoria.Materia.Data);
      const monthYear = date.toLocaleString("pt-BR", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(relatoria);
      return acc;
    }, {} as Record<string, typeof reportsData>);
  }, [reportsData]);

  if (!reportsData?.length && !isLoading) return null;
  console.log({ reportsByMonth });

  return (
    <DeputyCard
      title="Relatorias"
      subtitle="(Projetos relatados em 2024)"
      isLoading={isLoading}
      dialogTitle="Detalhamento das Relatorias"
      summary={
        <p className="text-lg">
          Total de relatorias:{" "}
          <span className="font-bold">{reportsData?.length || 0}</span>
        </p>
      }
    >
      <div className="space-y-6">
        {Object.entries(reportsByMonth).map(([monthYear, relatorias]) => (
          <div key={monthYear} className="mb-6">
            <h3 className="text-xl font-semibold mb-3 capitalize">
              {monthYear}
            </h3>
            <div className="space-y-3">
              {relatorias.map((relatoria) => (
                <div
                  key={relatoria.Materia.Codigo}
                  className="bg-white/10 p-4 rounded"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium">
                      {relatoria.Materia.DescricaoIdentificacao}
                    </p>
                    <span className="text-sm text-gray-400">
                      {new Date(relatoria.Materia.Data).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 mb-2">
                    {relatoria.Materia.Ementa}
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-400">Autor: </span>
                    {relatoria.Materia.Autor}
                  </p>
                  {relatoria.DescricaoMotivoDestituicao && (
                    <p className="text-sm text-red-400 mt-2">
                      Motivo destituição: {relatoria.DescricaoMotivoDestituicao}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DeputyCard>
  );
}
