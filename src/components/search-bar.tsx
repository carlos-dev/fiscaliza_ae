"use client";
import { useState, useEffect, useCallback } from "react";
import { Search, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchDeputies, useGetSenators } from "@/hooks/useQuery";
import { IDeputy, ISenatorRaw, TParliamentarianType } from "@/types";
import { ParliamentarianTypeEnum } from "@/enums/ParliamentarianTypeEnum";
import { debounce } from "@/utils/debounce";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import Link from "next/link";

interface SearchBarProps {
  variant?: "large" | "compact";
  className?: string;
}

interface StandardizedParliamentarian {
  id: string | number;
  name: string;
  photoUrl: string;
  role: string;
  party: string;
  state: string;
}

const SearchBar = ({ variant = "large", className }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<StandardizedParliamentarian[]>(
    []
  );
  const [type, setParliamentarianType] =
    useState<TParliamentarianType>("deputy");

  const isDeputy = type === ParliamentarianTypeEnum.DEPUTY;
  const { data: senators } = useGetSenators();
  const { data: deputies, isLoading } = useSearchDeputies(
    isDeputy ? query : ""
  );

  const standardizeParliamentarians = useCallback(
    (
      data: IDeputy[] | ISenatorRaw[] | undefined
    ): StandardizedParliamentarian[] => {
      if (!data) return [];

      if (isDeputy) {
        return (data as IDeputy[]).map((deputy) => ({
          id: deputy.id,
          name: deputy.nome,
          photoUrl: deputy.urlFoto,
          role: "Deputado Federal",
          party: deputy.siglaPartido,
          state: deputy.siglaUf,
        }));
      }

      return (data as ISenatorRaw[]).map((senator) => ({
        id: senator.IdentificacaoParlamentar.CodigoParlamentar,
        name: senator.IdentificacaoParlamentar.NomeCompletoParlamentar,
        photoUrl: senator.IdentificacaoParlamentar.UrlFotoParlamentar,
        role: "Senador",
        party: senator.IdentificacaoParlamentar.SiglaPartidoParlamentar,
        state: senator.IdentificacaoParlamentar.UfParlamentar,
      }));
    },
    [isDeputy]
  );

  useEffect(() => {
    if (query.length >= 1) {
      if (isDeputy) {
        setSuggestions(standardizeParliamentarians(deputies?.dados));
      } else {
        const filteredSenators =
          senators?.ListaParlamentarEmExercicio.Parlamentares.Parlamentar.filter(
            (item) =>
              item.IdentificacaoParlamentar.NomeCompletoParlamentar?.toLowerCase().includes(
                query?.toLowerCase()
              )
          );
        console.log("filteredSenators", filteredSenators);

        setSuggestions(standardizeParliamentarians(filteredSenators));
      }
    } else {
      setSuggestions([]);
    }
  }, [query, deputies?.dados, senators, isDeputy, standardizeParliamentarians]);

  const debouncedSetQuery = debounce((value: string) => {
    console.log("debouncedSetQuery", value);

    setQuery(value);
  }, 1000);

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setIsFocused(false);
  };

  const renderSuggestionContent = (item: StandardizedParliamentarian) => (
    <Link href={`/parliamentary/${item.id}`} className="w-full">
      <div className="flex items-center gap-4">
        <Image
          src={item.photoUrl || "/placeholder.svg"}
          alt={item.name}
          width={40}
          height={40}
          className="rounded-full object-cover"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = "/placeholder.svg";
          }}
        />
        <div>
          <div className="font-medium">{item.name}</div>
          <div className="text-sm text-muted-foreground">
            {item.role} • {item.party}/{item.state}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div
      className={cn(
        "relative w-full md:max-w-2xl",
        variant === "large" ? "mx-auto" : "",
        className
      )}
    >
      <RadioGroup
        defaultValue="deputy"
        className="flex mb-3"
        onValueChange={(value: TParliamentarianType) =>
          setParliamentarianType(value)
        }
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="deputy" id="deputy" />
          <Label htmlFor="deputy" className="cursor-pointer">
            Deputado
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            value="senator"
            id="senator"
            onChange={() => console.log("ok")}
          />
          <Label htmlFor="senator" className="cursor-pointer">
            Senador
          </Label>
        </div>
      </RadioGroup>
      <form className="relative">
        <div
          className={cn(
            "relative flex items-center rounded-full transition-all duration-300 overflow-hidden border pr-2",
            isFocused
              ? "border-primary shadow-sm bg-white"
              : "border-border bg-background",
            variant === "large" ? "h-16" : "h-12"
          )}
        >
          <div className="flex-shrink-0 pl-4">
            <Search
              className={cn(
                "text-muted-foreground transition-all",
                variant === "large" ? "h-5 w-5" : "h-4 w-4",
                isFocused ? "text-primary" : ""
              )}
            />
          </div>

          <input
            type="text"
            onChange={(e) => {
              debouncedSetQuery(e.target.value);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className={cn(
              "flex-1 bg-transparent outline-none px-4 w-full text-zinc-700",
              variant === "large" ? "text-lg" : "text-base"
            )}
            placeholder={`Busque por nome de ${
              isDeputy ? "deputado" : "senador"
            }...`}
            disabled={isLoading}
          />
          {/* <X
            onClick={clearSearch}
            className={`cursor-pointer ${
              isDeputy ? "text-primary" : "text-muted-foreground"
            }`}
          /> */}
        </div>
      </form>

      {(suggestions.length > 0 || isLoading) && (
        <div className="absolute bg-zinc-700 mt-2 w-full max-h-[300px] h-fit rounded-xl shadow-lg z-50 overflow-auto animate-fadeIn">
          {isLoading ? (
            <div className="py-4 px-3 text-center">
              <div className="h-4 w-32 mx-auto bg-muted rounded animate-pulse" />
            </div>
          ) : (
            <div className="py-2 h-full overflow-auto">
              {suggestions.map((item) => (
                <div
                  key={item.id}
                  className="w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors flex items-center justify-between"
                >
                  {renderSuggestionContent(item)}
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
