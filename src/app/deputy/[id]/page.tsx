"use client";

import { DeputyExpenses } from "@/components/deputy-expenses";
import { DeputyInfo } from "@/components/deputy-info";
import { DeputyPropositions } from "@/components/deputy-propositions";
import { Button } from "@/components/ui/button";
import { useGetDeputy } from "@/hooks/useQuery";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { use } from "react";
import { DeputyParliamentaryQuota } from "@/components/deputy-parliamentary-quota";
import { DeputyOfficeBudget } from "@/components/deputy-office-budget";
import { DeputyAmendments } from "@/components/deputy-amendments";

interface Props {
  params: Promise<{ id: string }>;
}

export default function DeputyPage({ params }: Props) {
  const { id } = use(params);
  const { data: deputy } = useGetDeputy(Number(id));

  return (
    <main className="container mx-auto p-4">
      <Button
        className="mb-4"
        variant="ghost"
        onClick={() => window.history.back()}
      >
        <ChevronLeft />
        Voltar
      </Button>
      {deputy?.dados.length ? (
        <>
          <div className="max-w-xl mx-auto bg-white/5 p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center mb-6">
              <Image
                src={deputy.dados[0].urlFoto}
                alt={deputy.dados[0].nome}
                className="rounded-full w-40 h-40 mb-4 object-cover"
                width={160}
                height={160}
              />
              <h1 className="text-2xl font-bold">{deputy.dados[0].nome}</h1>
              <p className="text-lg">
                {deputy.dados[0].siglaPartido} - {deputy.dados[0].siglaUf}
              </p>
            </div>
          </div>

          <DeputyInfo deputyId={id} />

          <div className="flex space-x-4">
            <div className="flex-1">
              <DeputyExpenses deputyId={id} />
              <DeputyParliamentaryQuota deputyId={id} />
              <DeputyAmendments deputyId={id} />
            </div>
            <div>
              <DeputyOfficeBudget deputyId={id} />
              <DeputyPropositions deputyId={id} />
            </div>
          </div>
        </>
      ) : (
        <h3 className="text-xl text-center">Carregando...</h3>
      )}
    </main>
  );
}
