import {
  useGetReportsSenator,
  useGetSenatorById,
  useGetVotesSenator,
} from "@/hooks/useQuery";
import { ISenatorRaw } from "@/types";
import Image from "next/image";
import { SenatorAuthorship } from "@/components/senator-authorship";
import { SenatorReports } from "@/components/senator-reports";

interface SenatorDetailsProps {
  id: string;
}

export function SenatorDetails({ id }: SenatorDetailsProps) {
  const { data: senator } = useGetSenatorById(id);
  const { data: reports } = useGetReportsSenator(id, 2024);
  const { data: votes } = useGetVotesSenator(id, 2024);

  if (!senator) {
    return (
      <h3 className="text-xl text-center">Carregando dados do senador...</h3>
    );
  }

  const senatorData =
    senator.DetalheParlamentar.Parlamentar.IdentificacaoParlamentar;

  return (
    <div className="space-y-6">
      <div className="max-w-2xl mx-auto bg-white/5 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={senatorData.UrlFotoParlamentar ?? ""}
            alt={senatorData.NomeParlamentar}
            className="rounded-full w-40 h-40 mb-4 object-cover"
            width={160}
            height={160}
          />
          <h1 className="text-2xl font-bold">
            {senatorData.NomeCompletoParlamentar}
          </h1>
          <p className="text-lg">
            {senatorData.SiglaPartidoParlamentar} - {senatorData.UfParlamentar}
          </p>
        </div>

        <div>
          <p className="text-sm">
            Contato:{" "}
            <a
              href={`mailto:${senatorData.EmailParlamentar}`}
              className="text-blue-400 hover:underline"
            >
              {senatorData.EmailParlamentar}
            </a>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SenatorAuthorship senatorId={id} />
        <SenatorReports senatorId={id} />
      </div>
    </div>
  );
}
