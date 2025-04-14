"use client";
import { Input } from "@/components/ui/input";
import { useState, Suspense, useMemo } from "react";
import { debounce } from "@/utils/debounce";
import { Skeleton } from "./ui/skeleton";
import { ItemList } from "./item-list";
import { useSearchDeputies, useGetSenators } from "@/hooks/useQuery";
import { TParliamentarianType } from "@/types";
import { ParliamentarianTypeEnum } from "@/enums/ParliamentarianTypeEnum";

export function SearchInput({ type }: { type: TParliamentarianType }) {
  const [searchTerm, setSearchTerm] = useState("");
  const isDeputy = type === ParliamentarianTypeEnum.DEPUTY;
  const { data: senators } = useGetSenators();
  const { data: deputies, isLoading } = useSearchDeputies(
    isDeputy ? searchTerm : ""
  );
  const senatorsList =
    senators?.ListaParlamentarEmExercicio.Parlamentares.Parlamentar;

  const list = useMemo(() => {
    return isDeputy
      ? deputies?.dados
      : senatorsList?.filter((item) =>
          item.IdentificacaoParlamentar.NomeCompletoParlamentar.toLowerCase().includes(
            searchTerm.toLowerCase()
          )
        );
  }, [isDeputy, deputies?.dados, senatorsList, searchTerm]);

  const debouncedSetSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 1000);

  return (
    <div>
      <Input
        placeholder={`Informe o nome do ${isDeputy ? "deputado" : "senador"}`}
        onChange={(e) => debouncedSetSearch(e.target.value)}
        className={`text-primary border-0 border-b`}
        disabled={isLoading}
      />

      {isLoading && (
        <>
          <Skeleton className="h-[20px] rounded-full mt-5" />
          <Skeleton className="h-[20px] rounded-full mt-2" />
          <Skeleton className="h-[20px] rounded-full mt-2" />
        </>
      )}

      <Suspense fallback={<Skeleton className="h-[20px] rounded-full mt-5" />}>
        {!!list?.length && searchTerm && <ItemList list={list} />}
        {deputies?.dados?.length === 0 && (
          <h3 className="text-xl text-center">Nenhum resultado encontrado</h3>
        )}
      </Suspense>
    </div>
  );
}
