"use client";

import { useEffect, useState } from "react";
import { DeputyCard } from "./ui/deputy-card";

interface OfficeBudgetData {
  month: string;
  avaialbleValue: string;
  usedValue: string;
}

export function DeputyOfficeBudget({ deputyId }: { deputyId: string }) {
  const [budgetData, setBudgetData] = useState<OfficeBudgetData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBudget() {
      try {
        const response = await fetch("/api/deputado-verba-gabinete", {
          method: "POST",
          body: JSON.stringify({
            id: deputyId,
            year: 2024,
          }),
        });
        const data = await response.json();
        setBudgetData(data);
      } catch (error) {
        console.error("Erro ao carregar verba de gabinete:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBudget();
  }, [deputyId]);

  const totalUsed = budgetData.reduce((total, item) => {
    const value =
      parseFloat(item.usedValue.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
    return total + value;
  }, 0);

  if (!budgetData.length && !isLoading) return null;

  return (
    <DeputyCard
      title="Verba de Gabinete"
      subtitle="(Valores utilizados em 2024)"
      isLoading={isLoading}
      dialogTitle="Detalhamento da Verba de Gabinete"
      summary={
        <p className="text-lg">
          Total utilizado:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalUsed)}
        </p>
      }
    >
      <div className="space-y-4">
        {budgetData.map((budget, index) => (
          <div key={index} className="bg-white/10 p-3 rounded">
            <p className="font-medium mb-2">{budget.month}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Disponível</p>
                <p className="text-blue-400">{budget.avaialbleValue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Utilizado</p>
                <p className="text-green-400">{budget.usedValue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DeputyCard>
  );
}
