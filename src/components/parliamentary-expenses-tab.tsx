import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

type ExpenseData = {
  month: string;
  value: number;
};

type OfficeBudgetData = {
  month: string;
  avaialbleValue: string;
  usedValue: string;
};

type ParliamentaryQuotaData = {
  monthYear: string;
  value: string;
};

interface ParliamentaryExpensesTabProps {
  expenses: ExpenseData[];
  officeBudget?: OfficeBudgetData[];
  parliamentaryQuota?: ParliamentaryQuotaData[];
}

export function ParliamentaryExpensesTab({
  expenses,
  officeBudget = [],
  parliamentaryQuota = [],
}: ParliamentaryExpensesTabProps) {
  console.log("Expenses:", expenses);

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Transform office budget data for chart
  const officeBudgetData = officeBudget.map((item) => ({
    month: item.month,
    available: parseFloat(
      item.avaialbleValue.replace(/[^\d,]/g, "").replace(",", ".")
    ),
    used: parseFloat(item.usedValue.replace(/[^\d,]/g, "").replace(",", ".")),
  }));

  // Transform parliamentary quota data for chart
  const quotaData = parliamentaryQuota?.map((item) => ({
    month: item.monthYear,
    value: parseFloat(item.value.replace(/[^\d,]/g, "").replace(",", ".")),
  }));

  return (
    <Tabs defaultValue="monthly">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
        <TabsTrigger value="monthly">Gastos Mensais</TabsTrigger>
        <TabsTrigger value="office-budget">Verba de Gabinete</TabsTrigger>
        <TabsTrigger value="parliamentary-quota">Cota Parlamentar</TabsTrigger>
      </TabsList>

      <TabsContent value="monthly">
        <Card>
          <CardHeader>
            <CardTitle>Gastos Mensais</CardTitle>
            <CardDescription>
              Gastos parlamentares registrados nos últimos meses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expenses}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("pt-BR", {
                        notation: "compact",
                        compactDisplay: "short",
                      }).format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Bar dataKey="value" fill="#8884d8">
                    {expenses.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`#${Math.floor(Math.random() * 16777215).toString(
                          16
                        )}`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="office-budget">
        <Card>
          <CardHeader>
            <CardTitle>Verba de Gabinete</CardTitle>
            <CardDescription>
              Valores disponíveis e utilizados da verba de gabinete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {officeBudget.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={officeBudgetData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("pt-BR", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Mês: ${label}`}
                    />
                    <Bar dataKey="available" name="Disponível" fill="#4CAF50" />
                    <Bar dataKey="used" name="Utilizado" fill="#FF5722" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Não há dados disponíveis para verba de gabinete.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="parliamentary-quota">
        <Card>
          <CardHeader>
            <CardTitle>Cota Parlamentar</CardTitle>
            <CardDescription>
              Gastos realizados por meio da cota parlamentar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quotaData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={quotaData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis
                      tickFormatter={(value) =>
                        new Intl.NumberFormat("pt-BR", {
                          notation: "compact",
                          compactDisplay: "short",
                        }).format(value)
                      }
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label) => `Período: ${label}`}
                    />
                    <Bar dataKey="value" name="Valor" fill="#3F51B5">
                      {quotaData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`#${Math.floor(
                            Math.random() * 16777215
                          ).toString(16)}`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Não há dados disponíveis para cota parlamentar.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
