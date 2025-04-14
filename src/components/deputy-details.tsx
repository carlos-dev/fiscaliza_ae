import { useEffect, useState } from "react";
import {
  getDeputy,
  getDeputyExpenses,
  getDeputyPropositions,
} from "@/services/api";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import {
  BarChart,
  FileText,
  Award,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface DeputyDetailsProps {
  id: string;
}

export function DeputyDetails({ id }: DeputyDetailsProps) {
  const [deputy, setDeputy] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [propositions, setPropositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [deputyData, expensesData, propositionsData] = await Promise.all([
          getDeputy(Number(id)),
          getDeputyExpenses(Number(id)),
          getDeputyPropositions(Number(id)),
        ]);

        setDeputy(deputyData.dados[0]);
        setExpenses(expensesData.dados);
        setPropositions(propositionsData.dados);
      } catch (error) {
        console.error("Error fetching deputy data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (loading || !deputy) {
    return (
      <h3 className="text-xl text-center">Carregando dados do deputado...</h3>
    );
  }

  const monthlyExpenses = expenses.reduce((acc: any, expense: any) => {
    const month = new Date(expense.dataDocumento).getMonth();
    acc[month] = (acc[month] || 0) + expense.valorLiquido;
    return acc;
  }, {});

  const expensesData = Object.entries(monthlyExpenses).map(
    ([month, value]) => ({
      month: new Date(2024, parseInt(month)).toLocaleString("default", {
        month: "short",
      }),
      value,
    })
  );

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-bl-[100px]"></div>

        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <Image
              src={deputy.urlFoto}
              alt={deputy.nome}
              width={128}
              height={128}
              className="h-32 w-32 rounded-xl object-cover border-4 border-background"
            />
            <div className="absolute -bottom-3 -right-3 h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm bg-primary">
              {deputy.siglaPartido}
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold">{deputy.nome}</h1>
                <p className="text-muted-foreground">
                  {deputy.siglaPartido} • {deputy.siglaUf}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Ativo
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="expenses" className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <TabsTrigger value="expenses">Gastos</TabsTrigger>
          <TabsTrigger value="propositions">Proposições</TabsTrigger>
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Gastos Mensais
              </CardTitle>
              <CardDescription>
                Valores gastos pelo parlamentar em {new Date().getFullYear()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={expensesData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(value) => `R$${value.toLocaleString()}`}
                    />
                    <Tooltip
                      formatter={(value) => [
                        `R$${Number(value).toLocaleString()}`,
                        "Valor",
                      ]}
                    />
                    <Bar
                      dataKey="value"
                      fill="var(--primary)"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="propositions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Proposições
              </CardTitle>
              <CardDescription>
                Projetos de lei e outras proposições
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {propositions.slice(0, 5).map((prop) => (
                  <div key={prop.id} className="p-4 rounded-lg border">
                    <h4 className="font-medium">{prop.ementa}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(prop.dataApresentacao).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Estatísticas Gerais
              </CardTitle>
              <CardDescription>
                Dados estatísticos do desempenho parlamentar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <StatCard
                  title="Proposições"
                  value={propositions.length.toString()}
                  description="Total de proposições apresentadas"
                />
                <StatCard
                  title="Gastos Totais"
                  value={`R$ ${expenses
                    .reduce(
                      (acc: number, curr: any) => acc + curr.valorLiquido,
                      0
                    )
                    .toLocaleString()}`}
                  description="Total de gastos no período"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
