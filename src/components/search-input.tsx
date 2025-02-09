"use client";
import { Input } from "@/components/ui/input";
import { useState, Suspense } from "react";
import { debounce } from "@/utils/debounce";
import { Skeleton } from "./ui/skeleton";
import { ItemList } from "./item-list";
import { useSearchDeputies, useSearchSenators } from "@/hooks/useQuery";
import { TParliamentarianType } from "@/types";
import { ParliamentarianTypeEnum } from "@/enums/ParliamentarianTypeEnum";

export function SearchInput({ type }: { type: TParliamentarianType }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: senators } = useSearchSenators();
  const { data: deputies, isLoading } = useSearchDeputies(searchTerm);
  console.log({
    senators: senators?.ListaParlamentarEmExercicio.Parlamentares.Parlamentar,
  });

  const debouncedSetSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 1000);

  return (
    <div>
      <Input
        placeholder={`Informe o nome do ${
          type === ParliamentarianTypeEnum.DEPUTY ? "deputado" : "senador"
        }`}
        onChange={(e) => debouncedSetSearch(e.target.value)}
        className={`text-primary`}
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
        {deputies?.dados && <ItemList deputies={deputies.dados} />}
        {deputies?.dados?.length === 0 && (
          <h3 className="text-xl text-center">Nenhum resultado encontrado</h3>
        )}
      </Suspense>
    </div>
  );
}
