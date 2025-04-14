"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  getDeputy,
  getDeputyExpenses,
  getDeputyPropositions,
  gehSenatorById,
  getAuthorshipSenator,
  getVotesSenator,
  getReportsSenator,
} from "@/services/api";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingAnimation from "@/components/loading-animation";
import AIReport from "@/components/AI-report";
import ParliamentaryNews from "@/components/parliamentary-news";
import Link from "next/link";
import { ParliamentaryHeader } from "@/components/parliamentary-header";
import { ParliamentaryExpensesTab } from "@/components/parliamentary-expenses-tab";
import { ParliamentaryPositionsTab } from "@/components/parliamentary-positions-tab";
import { ParliamentaryActivitiesTab } from "@/components/parliamentary-activities-tab";
import { ParliamentaryStatsTab } from "@/components/parliamentary-stats-tab";
import { ParliamentaryActions } from "@/components/parliamentary-actions";
import {
  DeputyDetailsResponse,
  OfficeBudget,
  ParliamentaryQuota,
} from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ParliamentaryPage() {
  const params = useParams();
  const id = params?.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [parliamentaryData, setParliamentaryData] = useState<any | null>(null);
  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Determine if ID is for deputy or senator (numeric = deputy, alphanumeric = senator)
  const isDeputy = /^\d+$/.test(id);

  // Generate year options once we have the parliamentarian's first year
  useEffect(() => {
    if (parliamentaryData?.firstYear) {
      const firstYear = parliamentaryData.firstYear;
      const currentYear = new Date().getFullYear();
      const years = [];

      for (let year = firstYear; year <= currentYear; year++) {
        years.push(year);
      }

      setYearOptions(years);
    }
  }, [parliamentaryData?.firstYear]);

  useEffect(() => {
    const fetchParliamentaryData = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("ID não fornecido");

        let data: any;

        if (isDeputy) {
          // Fetch deputy data
          const deputyId = parseInt(id);
          console.log("Fetching data for deputy ID:", deputyId);

          const [
            deputyBasic,
            deputyExpenses,
            deputyPropositions,
            deputyDetails,
            officeBudget,
            parliamentaryQuota,
            amendments,
          ] = await Promise.all([
            getDeputy(deputyId),
            getDeputyExpenses(deputyId, selectedYear),
            getDeputyPropositions(deputyId),
            fetch(`/api/deputados?id=${deputyId}`, {
              method: "POST",
              body: JSON.stringify({ year: selectedYear }),
            }).then(
              (response) => response.json() as Promise<DeputyDetailsResponse>
            ),
            fetch(`/api/deputado-verba-gabinete`, {
              method: "POST",
              body: JSON.stringify({ id: deputyId, year: selectedYear }),
            }).then((response) => response.json() as Promise<OfficeBudget[]>),
            fetch(`/api/deputado-cota-parlamentar`, {
              method: "POST",
              body: JSON.stringify({
                id: deputyId,
                year: selectedYear.toString().substring(2),
              }),
            }).then(
              (response) => response.json() as Promise<ParliamentaryQuota[]>
            ),
            fetch(`/api/deputado-emendas`, {
              method: "POST",
              body: JSON.stringify({ id: deputyId, year: selectedYear }),
            }).then((response) => response.json()),
          ]);

          if (!deputyBasic.dados.length)
            throw new Error("Deputado não encontrado");

          const deputy = deputyBasic.dados[0];
          const expenses = processDeputyExpenses(deputyExpenses.dados);

          // Calculate first year (could be from deputy data or can be hardcoded)
          // const firstYear = deputy.dataInicio ?
          //   new Date(deputy.dataInicio).getFullYear() :
          //   selectedYear - 4; // Default to 4 years back if not available

          // Process positions from propositions
          const positions = deputyPropositions.dados
            .slice(0, 5)
            .map((prop: any) => ({
              topic: prop.siglaTipo,
              position: prop.ementa.slice(0, 100) + "...",
            }));

          data = {
            id: deputy.id,
            name: deputy.nome,
            party: deputy.siglaPartido,
            state: deputy.siglaUf,
            role: "Deputado Federal",
            imageUrl: deputy.urlFoto,
            score: Math.round(Math.random() * 100), // Placeholder for actual score
            trend: Math.random() > 0.5 ? "up" : "down",
            plenaryActivities: deputyDetails.plenaryActivities,
            plenaryAttendance: deputyDetails.plenaryAttendance,
            committeeAttendance: deputyDetails.committeeAttendance,
            officeQuantity: deputyDetails.officeQuantity,
            salary: deputyDetails.salary,
            functionalProperty: deputyDetails.functionalProperty,
            housingAllowance: deputyDetails.housingAllowance,
            officeBudget: officeBudget,
            parliamentaryQuota: parliamentaryQuota,
            amendments: amendments.amendments,
            firstYear: 2010,
            selectedYear: selectedYear,
            attendance: Math.round(80 + Math.random() * 20), // Placeholder
            proposedLaws: deputyPropositions.dados.length,
            approvedLaws: Math.ceil(deputyPropositions.dados.length * 0.3), // Placeholder
            expenses: expenses,
            positions: positions,
          };
        } else {
          // Fetch senator data
          const [senatorData, senatorReports, senatorVotes, senatorAuthorship] =
            await Promise.all([
              gehSenatorById(id),
              getReportsSenator(id, selectedYear),
              getVotesSenator(id, selectedYear),
              getAuthorshipSenator(id, selectedYear),
            ]);

          const senator =
            senatorData.DetalheParlamentar.Parlamentar.IdentificacaoParlamentar;

          // Calculate first year of senator activity
          // const firstYear = senator.DataInicio ?
          //   new Date(senator.DataInicio).getFullYear() :
          //   selectedYear - 8; // Default to 8 years back if not available

          // Create mock expenses for senators
          const mockExpenses = generateMockExpensesData();

          // Process positions from votes if available
          const votes =
            senatorVotes?.VotacaoParlamentar?.Parlamentar?.Votacoes?.Votacao ||
            [];
          const positions = votes.slice(0, 5).map((vote) => ({
            topic: vote.Materia.DescricaoIdentificacao,
            position: vote.DescricaoVoto,
          }));

          // Count speeches and authorship
          const authorship =
            senatorAuthorship?.MateriasAutoriaParlamentar?.Parlamentar?.Autorias
              ?.Autoria || [];

          data = {
            id: senator.IdentificacaoParlamentar.CodigoParlamentar,
            name: senator.IdentificacaoParlamentar.NomeParlamentar,
            party: senator.IdentificacaoParlamentar.SiglaPartidoParlamentar,
            state: senator.IdentificacaoParlamentar.UfParlamentar,
            role: "Senador",
            imageUrl: senator.IdentificacaoParlamentar.UrlFotoParlamentar,
            score: Math.round(Math.random() * 100), // Placeholder for actual score
            trend: Math.random() > 0.5 ? "up" : "down",
            // firstYear: firstYear,
            // selectedYear: selectedYear,
            attendance: Math.round(80 + Math.random() * 20), // Placeholder
            proposedLaws: authorship.length,
            approvedLaws: Math.ceil(authorship.length * 0.4), // Placeholder
            speeches: votes.length,
            expenses: mockExpenses,
            positions: positions,
          };
        }

        setParliamentaryData(data);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        setError(
          "Não foi possível carregar os dados do parlamentar. Tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchParliamentaryData();
  }, [id, isDeputy, selectedYear]);

  // Helper function to process deputy expenses
  const processDeputyExpenses = (expenses: any[]) => {
    const monthlyExpenses = expenses.reduce((acc: any, expense: any) => {
      const month = new Date(0, expense.mes - 1).toLocaleDateString("pt-BR", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + expense.valorLiquido;
      return acc;
    }, {});

    return Object.entries(monthlyExpenses).map(([month, value]) => ({
      month,
      value,
    }));
  };

  // Generate mock expenses data for senators
  const generateMockExpensesData = () => {
    const months = [
      "jan",
      "fev",
      "mar",
      "abr",
      "mai",
      "jun",
      "jul",
      "ago",
      "set",
      "out",
      "nov",
      "dez",
    ];
    return months.map((month) => ({
      month,
      value: Math.round(10000 + Math.random() * 30000),
    }));
  };

  // Handler for year selection
  const handleYearChange = (year: string) => {
    setSelectedYear(Number(year));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <LoadingAnimation text="Carregando dados do parlamentar..." />
        </div>
      </div>
    );
  }

  if (error || !parliamentaryData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Erro</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para página inicial
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar
        </Link>

        <div className="flex justify-between items-center mb-6">
          <ParliamentaryHeader parliamentaryData={parliamentaryData} />

          {yearOptions.length > 0 && (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-2">Ano:</span>
              <Select
                defaultValue={selectedYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <Tabs defaultValue="expenses" className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            <TabsTrigger value="expenses">Gastos</TabsTrigger>
            <TabsTrigger value="positions">Posições</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="amendments">Emendas</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="mt-6">
            <ParliamentaryExpensesTab
              expenses={parliamentaryData.expenses}
              officeBudget={parliamentaryData.officeBudget}
              parliamentaryQuota={parliamentaryData.parliamentaryQuota}
            />
          </TabsContent>

          <TabsContent value="positions" className="mt-6">
            <ParliamentaryPositionsTab
              positions={parliamentaryData.positions}
            />
          </TabsContent>

          <TabsContent value="activities" className="mt-6">
            <ParliamentaryActivitiesTab
              activities={parliamentaryData.plenaryActivities}
            />
          </TabsContent>

          <TabsContent value="stats" className="mt-6">
            <ParliamentaryStatsTab
              attendance={parliamentaryData.attendance}
              proposedLaws={parliamentaryData.proposedLaws}
              approvedLaws={parliamentaryData.approvedLaws}
              speeches={parliamentaryData.speeches}
              // plenaryAttendance={parliamentaryData.plenaryAttendance}
              committeeAttendance={parliamentaryData.committeeAttendance}
            />
          </TabsContent>

          <TabsContent value="amendments" className="mt-6">
            {parliamentaryData.amendments && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                  Emendas Parlamentares ({parliamentaryData.selectedYear})
                </h2>
                <div className="grid gap-4">
                  {parliamentaryData.amendments.map(
                    (amendment: any, index: number) => (
                      <div
                        key={index}
                        className="bg-card border rounded-lg p-4"
                      >
                        <h3 className="font-medium">{amendment.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {amendment.subtitle}
                        </p>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <div className="font-medium">Autorizado</div>
                            <div>{amendment.authorized}</div>
                          </div>
                          <div>
                            <div className="font-medium">Empenhado</div>
                            <div>{amendment.committed}</div>
                          </div>
                          <div>
                            <div className="font-medium">Pago</div>
                            <div>{amendment.paid}</div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <AIReport parliamentarian={parliamentaryData} />

        <ParliamentaryNews parliamentarian={parliamentaryData} />

        <ParliamentaryActions id={parliamentaryData.id} />
      </div>
    </div>
  );
}
