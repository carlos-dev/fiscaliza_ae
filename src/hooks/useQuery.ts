import { useQuery } from "@tanstack/react-query";
import { searchDeputy, getSenators } from "@/services/api";

export function useSearchDeputies(searchTerm: string) {
  return useQuery({
    queryKey: ["deputies", searchTerm],
    queryFn: () => searchDeputy(searchTerm),
    enabled: searchTerm.length >= 1,
  });
}

export function useSearchSenators() {
  return useQuery({
    queryKey: ["senators"],
    queryFn: () => getSenators(),
  });
}
