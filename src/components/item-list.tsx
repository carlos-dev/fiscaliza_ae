"use client";
import { IDeputy, ISenatorRaw } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";

interface IItemListProps {
  id: string | number;
  name: string;
  photoUrl: string;
  partyInitials: string;
  stateInitials: string;
}

function isDeputyArray(arr: IDeputy[] | ISenatorRaw[]): arr is IDeputy[] {
  return arr.length > 0 && "id" in arr[0];
}

export function ItemList({ list }: { list: IDeputy[] | ISenatorRaw[] }) {
  const adaptedList = useCallback((): IItemListProps[] => {
    if (isDeputyArray(list)) {
      return list.map((deputy) => ({
        id: deputy.id,
        name: deputy.nome,
        photoUrl: deputy.urlFoto,
        partyInitials: deputy.siglaPartido,
        stateInitials: deputy.siglaUf,
      }));
    }
    return (list as ISenatorRaw[]).map((senator) => ({
      id: senator.IdentificacaoParlamentar.CodigoParlamentar,
      name: senator.IdentificacaoParlamentar.NomeParlamentar,
      partyInitials: senator.IdentificacaoParlamentar.SiglaPartidoParlamentar,
      stateInitials: senator.IdentificacaoParlamentar.UfParlamentar,
      photoUrl: senator.IdentificacaoParlamentar.UrlFotoParlamentar,
    }));
  }, [list]);

  return (
    <div className="space-y-4 mt-4">
      {adaptedList().map((item) => (
        <Link
          href={`/${isDeputyArray(list) ? "deputy" : "senator"}/${item.id}`}
          key={item.id}
        >
          <div className="flex items-center gap-4 my-3 p-2 rounded-sm transition duration-300 hover:bg-gray-100/5">
            <Image
              src={item.photoUrl}
              alt={item.name}
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <p className="font-medium text-white">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.partyInitials} - {item.stateInitials}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
