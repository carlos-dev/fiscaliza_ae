"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface DeputyInfoData {
  id: string;
  nome: string;
  email: string;
  atuacaoPlenario: {
    deSuaAutoria: string;
    relatadas: string;
    votacoesEmPlenario: string;
  };
  presencasPlenario: {
    presencas: string;
    ausenciasJustificadas: string;
    ausenciasNaoJustificadas: string;
  };
  presencasComissoes: {
    presencas: string;
    ausenciasJustificadas: string;
    ausenciasNaoJustificadas: string;
  };
  salario: string;
  gabineteQtd: string;
  imovelFuncional: string;
  auxilioMoradia: string;
}

interface DeputyInfoProps {
  deputyId: string;
}

export function DeputyInfo({ deputyId }: DeputyInfoProps) {
  const [info, setInfo] = useState<DeputyInfoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDeputadoInfo() {
      try {
        const response = await fetch(`/api/deputados?id=${deputyId}`, {
          method: "POST",
          body: JSON.stringify({ year: 2024 }),
        });
        const data = await response.json();

        setInfo(data);
      } catch (error) {
        console.error("Erro ao carregar informações do deputado:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeputadoInfo();
  }, [deputyId]);

  if (isLoading) {
    return (
      <div className="mt-8 bg-white/5 p-6 rounded-lg">
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!info) return null;

  return (
    <div className="mt-8 bg-white/5 p-6 rounded-lg">
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Atuação no Plenário</h3>
          <div className="space-y-2">
            <p>Projetos de sua autoria: {info.atuacaoPlenario.deSuaAutoria}</p>
            <p>Matérias relatadas: {info.atuacaoPlenario.relatadas}</p>
            <p>
              Votações em Plenário: {info.atuacaoPlenario.votacoesEmPlenario}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Presenças em Plenário</h3>
          <div className="space-y-2">
            <p className="text-green-400">
              Presenças: {info.presencasPlenario.presencas}
            </p>
            <p className="text-yellow-400">
              Ausências justificadas:{" "}
              {info.presencasPlenario.ausenciasJustificadas}
            </p>
            <p className="text-red-400">
              Ausências não justificadas:{" "}
              {info.presencasPlenario.ausenciasNaoJustificadas}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Presenças em Comissões</h3>
          <div className="space-y-2">
            <p className="text-green-400">
              Presenças: {info.presencasComissoes.presencas}
            </p>
            <p className="text-yellow-400">
              Ausências justificadas:{" "}
              {info.presencasComissoes.ausenciasJustificadas}
            </p>
            <p className="text-red-400">
              Ausências não justificadas:{" "}
              {info.presencasComissoes.ausenciasNaoJustificadas}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Benefícios e Recursos</h3>
          <div className="space-y-2">
            <p>Salário: {info.salario}</p>
            <p>Quantidade no Gabinete: {info.gabineteQtd}</p>
            <p>Imóvel Funcional: {info.imovelFuncional}</p>
            <p>Auxílio Moradia: {info.auxilioMoradia}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm">
          Contato:{" "}
          <a
            href={`mailto:${info.email}`}
            className="text-blue-400 hover:underline"
          >
            {info.email}
          </a>
        </p>
      </div>
    </div>
  );
}
