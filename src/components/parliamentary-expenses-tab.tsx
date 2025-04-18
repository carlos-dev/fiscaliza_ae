import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { getDeputyExpenses } from "@/services/api";
import { IDeputyExpenseData } from "../types/index";
import { ParliamentaryDetailedExpensesModal } from "./parliamentary-detailed-expenses-modal";
import { formatCurrency } from "@/utils/currency";

type ExpenseData = {
  month: string;
  value: number;
  originalMonth?: number;
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
  const [currentPage, setCurrentPage] = useState(1);
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

  // Handle page navigation
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || isLoading) return;

    setCurrentPage(newPage);
    fetchExpenses(newPage);
  };

  const handleMonthClick = (data: ExpenseData) => {
    if (data && data.originalMonth) {
      setSelectedMonth(data.originalMonth);
      setShowDetailModal(true);
    }
  };

  // Get filtered expenses for the selected month
  const getDetailedExpenses = () => {
    if (!selectedMonth) return [];
    return rawExpensesData.filter((expense) => expense.mes === selectedMonth);
  };

  const renderChart = () =>
    !!currentExpenses.length ? (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={currentExpenses}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          onClick={(data) => {
            if (data && data.activePayload && data.activePayload[0]) {
              handleMonthClick(data.activePayload[0].payload);
            }
          }}
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
            cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
          />
          <Bar dataKey="value" fill="#8884d8" cursor="pointer">
            {currentExpenses.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-muted-foreground">
        Não há dados disponíveis para o mês selecionado.
      </p>
    );

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
            <div className="h-[300px] flex items-center justify-center">
              {isLoading ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                renderChart()
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Clique em uma barra para ver despesas detalhadas do mês
            </p>
          </CardContent>
          {deputyId && selectedYear && (
            <CardFooter className="flex justify-center space-x-2 pt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center text-sm">
                Página {currentPage}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!currentExpenses.length || isLoading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          )}
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
