"use client";

import { useEffect, useState } from "react";
import { DeputyCard } from "./ui/deputy-card";

interface QuotaData {
  monthYear: string;
  value: string;
}

export function DeputyParliamentaryQuota({ deputyId }: { deputyId: string }) {
  const [quotaData, setQuotaData] = useState<QuotaData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchQuota() {
      try {
        const response = await fetch("/api/deputado-cota-parlamentar", {
          method: "POST",
          body: JSON.stringify({
            id: deputyId,
            startDate: "012024",
            endDate: "122024",
          }),
        });
        const data = await response.json();
        setQuotaData(data);
      } catch (error) {
        console.error("Erro ao carregar cota parlamentar:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuota();
  }, [deputyId]);

  const totalQuota = quotaData.reduce((total, item) => {
    const value =
      parseFloat(item.value.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
    return total + value;
  }, 0);

  if (!quotaData.length && !isLoading) return null;

  return (
    <DeputyCard
      title="Cota Parlamentar"
      subtitle="(Gastos mensais em 2024)"
      isLoading={isLoading}
      dialogTitle="Detalhamento da Cota Parlamentar"
      summary={
        <p className="text-lg">
          Total utilizado:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalQuota)}
        </p>
      }
    >
      <div className="space-y-4">
        {quotaData.map((quota, index) => (
          <div key={index} className="bg-white/10 p-3 rounded">
            <div className="flex justify-between items-center">
              <p className="font-medium">{quota.monthYear}</p>
              <p className="text-green-400">{quota.value}</p>
            </div>
          </div>
        ))}
      </div>
    </DeputyCard>
  );
}
