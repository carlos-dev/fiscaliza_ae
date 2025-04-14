"use client";

import { useMemo } from "react";
import { useGetDeputyPropositions } from "@/hooks/useQuery";
import { DeputyCard } from "./ui/deputy-card";

export function DeputyPropositions({ deputyId }: { deputyId: string }) {
  const { data: propositions, isLoading } = useGetDeputyPropositions(
    Number(deputyId)
  );

  const propositionsByYear = useMemo(() => {
    if (!propositions?.dados) return {};
    return propositions.dados.reduce((acc, proposition) => {
      const year = proposition.ano;
      if (!acc[year]) acc[year] = [];
      acc[year].push(proposition);
      return acc;
    }, {} as Record<number, typeof propositions.dados>);
  }, [propositions]);

  if (!propositions?.dados) return null;

  return (
    <DeputyCard
      title="Proposições"
      subtitle="(Projetos apresentados)"
      isLoading={isLoading}
      dialogTitle="Detalhamento das Proposições"
      summary={
        <p className="text-lg">
          Total de proposições:{" "}
          <span className="font-bold">{propositions.dados.length}</span>
        </p>
      }
    >
      <div className="space-y-4">
        {Object.entries(propositionsByYear).map(([year, props]) => (
          <div key={year} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Ano: {year}</h3>
            <div className="space-y-2">
              {props.map((prop) => (
                <div key={prop.id} className="bg-white/10 p-3 rounded">
                  <p className="font-medium">
                    {prop.siglaTipo} {prop.ano}
                  </p>
                  <p className="text-sm mb-2">{prop.ementa}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DeputyCard>
  );
}
