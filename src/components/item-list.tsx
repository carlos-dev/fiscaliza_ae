"use client";
import Image from "next/image";
import Link from "next/link";

type Deputy = {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
};

type DeputyListProps = {
  deputies: Deputy[];
};

export function ItemList({ deputies }: DeputyListProps) {
  return (
    <div className="space-y-4 mt-4">
      {deputies?.map((deputy) => (
        <Link href={`/deputies/${deputies[0].id}`} key={deputy.id}>
          <div className="flex items-center gap-4 my-3 p-2 rounded-sm transition duration-300 hover:bg-gray-100/5 ">
            <Image
              src={deputy.urlFoto}
              alt={deputy.nome}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <p className="font-medium">{deputy.nome}</p>
              <p className="text-sm text-gray-500">
                {deputy.siglaPartido} - {deputy.siglaUf}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
