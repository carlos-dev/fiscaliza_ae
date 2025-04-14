"use client";

import { useEffect, useState } from "react";
import { DeputyCard } from "./ui/deputy-card";

interface Amendment {
  title: string;
  subtitle: string;
  autorizado: string;
  empenhado: string;
  pago: string;
}

export function DeputyAmendments({ deputyId }: { deputyId: string }) {
  const [amendments, setAmendments] = useState<Amendment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAmendments() {
      try {
        const response = await fetch("/api/deputado-emendas", {
          method: "POST",
          body: JSON.stringify({
            id: deputyId,
            year: 2024,
          }),
        });
        const data = await response.json();
        setAmendments(data);
      } catch (error) {
        console.error("Erro ao carregar emendas:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAmendments();
  }, [deputyId]);

  const totalAutorizado = amendments.reduce((total, item) => {
    const value =
      parseFloat(item.autorizado.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
    return total + value;
  }, 0);

  if (!amendments.length && !isLoading) return null;

  return (
    <DeputyCard
      title="Emendas Parlamentares"
      subtitle="(Recursos destinados em 2024)"
      isLoading={isLoading}
      dialogTitle="Detalhamento das Emendas"
      summary={
        <p className="text-lg">
          Total autorizado:{" "}
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(totalAutorizado)}
        </p>
      }
    >
      <div className="space-y-4">
        {amendments.map((amendment, index) => (
          <div key={index} className="bg-white/10 p-4 rounded">
            <h4 className="font-medium text-lg mb-1">{amendment.title}</h4>
            <p className="text-sm text-gray-400 mb-3">{amendment.subtitle}</p>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Autorizado</p>
                <p className="text-blue-400">{amendment.autorizado}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Empenhado</p>
                <p className="text-yellow-400">{amendment.empenhado}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Pago</p>
                <p className="text-green-400">{amendment.pago}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DeputyCard>
  );
}
