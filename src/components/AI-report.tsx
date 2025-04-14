/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BookOpen, FileText, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIReportProps {
  parliamentarian: any;
}

const AIReport: React.FC<AIReportProps> = ({ parliamentarian }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [reportType, setReportType] = useState<
    "simple" | "detailed" | "critical"
  >("simple");
  const [isOpen, setIsOpen] = useState(false);

  const generateReport = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    setReport(null);

    try {
      // Simulação de chamada a uma API de IA
      // Em produção, isso seria substituído por uma chamada real
      await new Promise((resolve) => setTimeout(resolve, 2000));

      let generatedReport = "";

      if (reportType === "simple") {
        generatedReport = `${parliamentarian.name} é ${
          parliamentarian.role
        } pelo partido ${parliamentarian.party} representando o estado ${
          parliamentarian.state
        }. Tem uma pontuação de ${
          parliamentarian.score
        }/100 em nosso índice de desempenho parlamentar.

Com presença de ${parliamentarian.attendance}% nas sessões, propôs ${
          parliamentarian.proposedLaws
        } projetos de lei, dos quais ${
          parliamentarian.approvedLaws
        } foram aprovados. ${parliamentarian.name} realizou ${
          parliamentarian.speeches
        } discursos no plenário durante o mandato atual.

Sua pontuação reflete um ${
          parliamentarian.score >= 70
            ? "bom"
            : parliamentarian.score >= 50
            ? "mediano"
            : "baixo"
        } desempenho como parlamentar, baseado em critérios objetivos como assiduidade, produção legislativa e transparência.`;
      } else if (reportType === "detailed") {
        generatedReport = `# Relatório detalhado sobre ${parliamentarian.name}

## Perfil
${parliamentarian.name} é ${parliamentarian.role} pelo partido ${
          parliamentarian.party
        } representando o estado ${
          parliamentarian.state
        }. Atualmente com uma pontuação de ${
          parliamentarian.score
        }/100 em nosso índice de avaliação parlamentar.

## Atividade Legislativa
- **Presença em votações**: ${parliamentarian.attendance}%
- **Projetos propostos**: ${parliamentarian.proposedLaws}
- **Projetos aprovados**: ${parliamentarian.approvedLaws}
- **Taxa de conversão**: ${Math.round(
          (parliamentarian.approvedLaws / parliamentarian.proposedLaws) * 100 ||
            0
        )}%
- **Discursos realizados**: ${parliamentarian.speeches}

## Análise de Gastos
Os gastos mensais variam entre R$${Math.min(
          ...parliamentarian.expenses.map((e: { value: any }) => e.value)
        )} e R$${Math.max(
          ...parliamentarian.expenses.map((e: { value: any }) => e.value)
        )}, com média de R$${Math.round(
          parliamentarian.expenses.reduce(
            (acc: any, curr: { value: any }) => acc + curr.value,
            0
          ) / parliamentarian.expenses.length
        )}.

## Posicionamentos
${parliamentarian.positions
  .map((p: { topic: any; position: any }) => `- ${p.topic}: ${p.position}`)
  .join("\n")}

## Avaliação Geral
${parliamentarian.name} demonstra um ${
          parliamentarian.score >= 70
            ? "alto"
            : parliamentarian.score >= 50
            ? "médio"
            : "baixo"
        } nível de eficiência legislativa. ${
          parliamentarian.score >= 70
            ? "Destaca-se positivamente em presença e projetos aprovados."
            : parliamentarian.score >= 50
            ? "Apresenta resultados medianos em termos de conversão de projetos propostos em aprovados."
            : "Apresenta baixa efetividade na conversão de projetos propostos em leis aprovadas."
        }`;
      } else if (reportType === "critical") {
        generatedReport = `# Análise Crítica: ${parliamentarian.name} (${
          parliamentarian.party
        }/${parliamentarian.state})

Este relatório apresenta uma visão crítica e independente sobre o desempenho do(a) parlamentar.

## Pontos Fortes
- ${
          parliamentarian.attendance >= 80
            ? `Alta presença em votações (${parliamentarian.attendance}%)`
            : ""
        }
- ${
          parliamentarian.approvedLaws >= 3
            ? `Conseguiu aprovar ${parliamentarian.approvedLaws} projetos de lei`
            : ""
        }

## Pontos Fracos
- ${
          parliamentarian.attendance < 80
            ? `Presença abaixo do ideal em votações (${parliamentarian.attendance}%)`
            : ""
        }
- ${
          parliamentarian.approvedLaws < 3
            ? `Baixa taxa de aprovação de projetos (apenas ${parliamentarian.approvedLaws})`
            : ""
        }
- ${
          parliamentarian.approvedLaws / parliamentarian.proposedLaws < 0.3
            ? `Taxa de conversão de projetos propostos em aprovados é baixa (${Math.round(
                (parliamentarian.approvedLaws / parliamentarian.proposedLaws) *
                  100 || 0
              )}%)`
            : ""
        }

## Gastos
A média de gastos mensais é de R$${Math.round(
          parliamentarian.expenses.reduce(
            (acc: any, curr: { value: any }) => acc + curr.value,
            0
          ) / parliamentarian.expenses.length
        )}, o que está ${
          Math.round(
            parliamentarian.expenses.reduce(
              (acc: any, curr: { value: any }) => acc + curr.value,
              0
            ) / parliamentarian.expenses.length
          ) > 20000
            ? "acima"
            : "dentro"
        } da média parlamentar.

## Transparência
${
  parliamentarian.score >= 70
    ? "O parlamentar demonstra bom nível de transparência em suas atividades."
    : "Há espaço para melhorias na transparência das atividades parlamentares."
}

## Conclusão
Com uma pontuação de ${parliamentarian.score}/100, ${
          parliamentarian.name
        } está ${
          parliamentarian.score >= 70
            ? "entre os parlamentares bem avaliados"
            : parliamentarian.score >= 50
            ? "na média dos parlamentares"
            : "abaixo da média dos parlamentares"
        } em nosso índice. ${
          parliamentarian.trend === "up"
            ? "Sua tendência de desempenho é de melhora."
            : parliamentarian.trend === "down"
            ? "Sua tendência de desempenho está em queda."
            : "Seu desempenho se mantém estável."
        } Recomendamos aos eleitores que acompanhem de perto suas atividades e posicionamentos.`;
      }

      setReport(generatedReport);
    } catch (error) {
      console.error("Error generating AI report:", error);
      setReport("Erro ao gerar o relatório. Tente novamente mais tarde.");
    } finally {
      setIsGenerating(false);
      setIsOpen(true);
    }
  };

  return (
    <Card className="mt-8 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Relatório de IA
        </CardTitle>
        <CardDescription>
          Gere um relatório analítico sobre este parlamentar usando inteligência
          artificial
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          <Button
            variant={reportType === "simple" ? "default" : "outline"}
            size="sm"
            onClick={() => setReportType("simple")}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Resumo Simples
          </Button>
          <Button
            variant={reportType === "detailed" ? "default" : "outline"}
            size="sm"
            onClick={() => setReportType("detailed")}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Relatório Detalhado
          </Button>
          <Button
            variant={reportType === "critical" ? "default" : "outline"}
            size="sm"
            onClick={() => setReportType("critical")}
            className="flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Análise Crítica
          </Button>
        </div>

        <Button
          onClick={generateReport}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando relatório...
            </>
          ) : (
            <>
              <BookOpen className="mr-2 h-4 w-4" />
              Gerar{" "}
              {reportType === "simple"
                ? "Resumo"
                : reportType === "detailed"
                ? "Relatório"
                : "Análise"}
            </>
          )}
        </Button>

        {report && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center justify-between w-full"
              >
                <span>
                  {isOpen ? "Ocultar relatório" : "Mostrar relatório"}
                </span>
                <span
                  className={cn(
                    "transition-transform",
                    isOpen ? "rotate-180" : ""
                  )}
                >
                  ▼
                </span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 p-4 bg-muted/50 rounded-md text-left whitespace-pre-line">
                {report}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Este relatório é gerado por inteligência artificial e pode conter
        imprecisões. Baseado em dados públicos disponíveis.
      </CardFooter>
    </Card>
  );
};

export default AIReport;
