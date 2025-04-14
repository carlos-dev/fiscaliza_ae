"use client";

import { useMemo } from "react";
import { useGetDeputyExpenses } from "@/hooks/useQuery";
import { DeputyCard } from "./ui/deputy-card";

export function DeputyExpenses({ deputyId }: { deputyId: string }) {
  const { data: expenses, isLoading } = useGetDeputyExpenses(Number(deputyId));

  const expensesByYear = useMemo(() => {
    if (!expenses?.dados) return {};
    return expenses.dados.reduce((acc, expense) => {
      const year = expense.ano;
      if (!acc[year]) acc[year] = [];
      acc[year].push(expense);
      return acc;
    }, {} as Record<number, typeof expenses.dados>);
  }, [expenses]);

  const totalExpenses = useMemo(() => {
    if (!expenses?.dados) return 0;
    return expenses.dados.reduce(
      (total, expense) => total + expense.valorLiquido,
      0
    );
  }, [expenses]);

  if (!expenses) return null;

  return (
    <DeputyCard
      title="Gastos Parlamentares"
      subtitle="(Bora ver se tá torrando grana)"
      isLoading={isLoading}
      dialogTitle="Detalhamento dos Gastos Parlamentares"
      summary={
        <p className="text-lg">
          Total de gastos:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalExpenses)}
        </p>
      }
    >
      <div className="space-y-4">
        {Object.entries(expensesByYear).map(([year, expenses]) => (
          <div key={year} className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Ano: {year}</h3>
            <div className="space-y-2">
              {expenses.map((expense, index) => (
                <div
                  key={`${expense}-${index}`}
                  className="bg-white/10 p-3 rounded"
                >
                  <p className="font-medium">{expense.tipoDespesa}</p>
                  <p>Mês: {expense.mes}</p>
                  <p className="text-green-400">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(expense.valorLiquido)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DeputyCard>
  );
}
