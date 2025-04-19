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
import { useState } from "react";
import { getDeputyExpenses } from "@/services/api";
import { ExpenseData, IDeputyExpenseData } from "../types/index";
import { ParliamentaryDetailedExpensesModal } from "./parliamentary-detailed-expenses-modal";
import { formatCurrency } from "@/utils/currency";
import { MonthlyExpensesTab } from "./montly-expenses-tab";

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
  deputyId?: number;
  selectedYear?: number;
}

export function ParliamentaryExpensesTab({
  expenses,
  officeBudget = [],
  parliamentaryQuota = [],
  deputyId,
  selectedYear,
}: ParliamentaryExpensesTabProps) {
  const [currentExpenses, setCurrentExpenses] =
    useState<ExpenseData[]>(expenses);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [rawExpensesData, setRawExpensesData] = useState<IDeputyExpenseData[]>(
    []
  );

  // Transform office budget data for chart
  const officeBudgetData = officeBudget.map((item) => ({
    month: new Date(0, Number(item.month) - 1).toLocaleDateString("pt-BR", {
      month: "short",
    }),
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

  // Function to fetch paginated expense data
  const fetchExpenses = async (page: number) => {
    if (!deputyId || !selectedYear) return;

    try {
      setIsLoading(true);

      const response = await getDeputyExpenses({
        id: deputyId,
        year: selectedYear,
        page,
      });

      const data = response.dados;

      setRawExpensesData(data);
      setCurrentExpenses(processExpenseData(data));
    } catch (error) {
      console.error("Error fetching expenses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Process API response into chart data
  const processExpenseData = (
    expenses: IDeputyExpenseData[]
  ): ExpenseData[] => {
    const monthlyExpenses = expenses.reduce(
      (
        acc: Record<string, { value: number; originalMonth: number }>,
        expense
      ) => {
        const month = new Date(0, expense.mes - 1).toLocaleDateString("pt-BR", {
          month: "short",
        });
        acc[month] = {
          value: (acc[month]?.value || 0) + expense.valorLiquido,
          originalMonth: expense.mes,
        };
        return acc;
      },
      {}
    );

    console.log("Processed monthly expenses:", monthlyExpenses);

    return Object.entries(monthlyExpenses).map(([month, data]) => ({
      month,
      value: (data as ExpenseData).value as number,
      originalMonth: (data as ExpenseData).originalMonth as number,
    }));
  };

  // Get filtered expenses for the selected month
  const getDetailedExpenses = () => {
    if (!selectedMonth) return [];
    return rawExpensesData.filter((expense) => expense.mes === selectedMonth);
  };

  return (
    <Tabs defaultValue="monthly">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
        <TabsTrigger value="monthly">Gastos Mensais</TabsTrigger>
        <TabsTrigger value="office-budget">Verba de Gabinete</TabsTrigger>
        <TabsTrigger value="parliamentary-quota">Cota Parlamentar</TabsTrigger>
      </TabsList>

      <MonthlyExpensesTab
        currentExpenses={currentExpenses}
        deputyId={deputyId}
        selectedYear={selectedYear}
        isLoading={isLoading}
        fetchExpenses={fetchExpenses}
        setShowDetailModal={setShowDetailModal}
        setSelectedMonth={setSelectedMonth}
      />

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
                    <XAxis dataKey="month" className="text-xs" />
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
                      labelStyle={{ color: "#000" }}
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

      <ParliamentaryDetailedExpensesModal
        isLoading={isLoading}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setShowDetailModal={setShowDetailModal}
        showDetailModal={showDetailModal}
        detailedExpenses={getDetailedExpenses()}
      />
    </Tabs>
  );
}
