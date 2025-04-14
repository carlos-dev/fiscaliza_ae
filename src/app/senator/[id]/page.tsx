"use client";

import { Button } from "@/components/ui/button";
import {
  useGetReportsSenator,
  useGetSenatorById,
  useGetVotesSenator,
} from "@/hooks/useQuery";
import { ISenatorRaw } from "@/types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { use } from "react";
import { SenatorAuthorship } from "@/components/senator-authorship";
import { SenatorReports } from "@/components/senator-reports";

interface Props {
  params: Promise<{ id: string }>;
}

export default function SenatorPage({ params }: Props) {
  const { id } = use(params);
  const { data: senator } = useGetSenatorById(id);
  const { data: reports } = useGetReportsSenator(id, 2024);
  const { data: votes } = useGetVotesSenator(id, 2024);

  const renderSenator = (item: ISenatorRaw) => {
    return (
      <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={item.UrlFotoParlamentar ?? ""}
            alt={item.NomeParlamentar}
            className="rounded-full w-40 h-40 mb-4 object-cover"
            width={160}
            height={160}
          />
          <h1 className="text-2xl font-bold">{item.NomeCompletoParlamentar}</h1>
          <p className="text-lg">
            {item.SiglaPartidoParlamentar} - {item.UfParlamentar}
          </p>
        </div>

        <div>
          <p className="text-sm">
            Contato:{" "}
            <a
              href={`mailto:${item.EmailParlamentar}`}
              className="text-blue-400 hover:underline"
            >
              {item.EmailParlamentar}
            </a>
          </p>
        </div>
      </div>
    );
  };

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
      {!!senator ? (
        <>
          {renderSenator(
            senator.DetalheParlamentar.Parlamentar.IdentificacaoParlamentar
          )}
          <div className="flex space-x-4">
            <div className="flex-1">
              <SenatorAuthorship senatorId={id} />
              ok
              <SenatorReports senatorId={id} />
            </div>
          </div>
        </>
      ) : (
        <h3 className="text-xl text-center">Carregando...</h3>
      )}
    </main>
  );
}
