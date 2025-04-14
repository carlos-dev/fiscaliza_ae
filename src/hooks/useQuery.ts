import { useQuery } from "@tanstack/react-query";
import {
  searchDeputy,
  getSenators,
  getDeputy,
  getDeputyExpenses,
  getDeputyPropositions,
  gehSenatorById,
  getAuthorshipSenator,
  getReportsSenator,
  getVotesSenator,
} from "@/services/api";

export function useSearchDeputies(searchTerm: string) {
  return useQuery({
    queryKey: ["deputies", searchTerm],
    queryFn: () => searchDeputy(searchTerm),
    enabled: searchTerm.length >= 1,
  });
}

export function useGetDeputy(id: number) {
  return useQuery({
    queryKey: ["deputy"],
    queryFn: () => getDeputy(id),
  });
}

export function useGetDeputyExpenses(id: number) {
  return useQuery({
    queryKey: ["deputyExpenses"],
    queryFn: () => getDeputyExpenses(id),
  });
}

export function useGetSenators() {
  return useQuery({
    queryKey: ["senators"],
    queryFn: () => getSenators(),
  });
}

export function useGetDeputyPropositions(id: number) {
  return useQuery({
    queryKey: ["deputyPropositions"],
    queryFn: () => getDeputyPropositions(id),
  });
}

export function useGetSenatorById(id: string) {
  return useQuery({
    queryKey: ["senatorById"],
    queryFn: () => gehSenatorById(id),
    enabled: !!id,
  });
}

export function useGetSenatorAuthorship(id: string, year: number) {
  return useQuery({
    queryKey: ["authorshipSenator"],
    queryFn: () => getAuthorshipSenator(id, year),
    enabled: !!id,
  });
}

export function useGetReportsSenator(id: string, year: number) {
  return useQuery({
    queryKey: ["reportsSenator"],
    queryFn: () => getReportsSenator(id, year),
    enabled: !!id,
  });
}

export function useGetVotesSenator(id: string, year: number) {
  return useQuery({
    queryKey: ["votesSenator"],
    queryFn: () => getVotesSenator(id, year),
    enabled: !!id,
  });
}
