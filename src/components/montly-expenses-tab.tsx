"use client";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { TabsContent } from "./ui/tabs";
import { Button } from "./ui/button";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/utils/currency";
import { ExpenseData } from "../types/index";
import { useState } from "react";

interface MonthlyExpensesTabProps {
  deputyId?: number;
  selectedYear?: number;
  isLoading: boolean;
  fetchExpenses: (page: number) => void;
  currentExpenses: ExpenseData[];
  setShowDetailModal: (value: boolean) => void;
  setSelectedMonth: (month: number | null) => void;
}

export function MonthlyExpensesTab({
  currentExpenses,
  fetchExpenses,
  isLoading,
  setSelectedMonth,
  deputyId,
  setShowDetailModal,
  selectedYear,
}: MonthlyExpensesTabProps) {
  const [currentPage, setCurrentPage] = useState(1);

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
  );
}
