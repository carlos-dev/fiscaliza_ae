import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { formatCurrency } from "@/utils/currency";
import { getMonthNameFromNumber } from "@/utils/date";
import { Button } from "./ui/button";
import { IDeputyExpenseData } from "../types/index";

interface ParliamentaryDetailedExpensesModalProps {
  showDetailModal: boolean;
  setShowDetailModal: (value: boolean) => void;
  selectedMonth: number | null;
  selectedYear?: number;
  isLoading: boolean;
  detailedExpenses: IDeputyExpenseData[];
}

export function ParliamentaryDetailedExpensesModal({
  isLoading,
  selectedMonth,
  selectedYear,
  setShowDetailModal,
  showDetailModal,
  detailedExpenses,
}: ParliamentaryDetailedExpensesModalProps) {
  return (
    <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            Despesas Detalhadas -{" "}
            {selectedMonth && getMonthNameFromNumber(selectedMonth)}/
            {selectedYear}
          </DialogTitle>
          <DialogDescription>
            Lista completa de gastos realizados no período
          </DialogDescription>
        </DialogHeader>

        <div className="h-[500px] rounded-md border p-2 overflow-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : detailedExpenses.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo de Despesa</TableHead>
                  <TableHead>Fornecedor</TableHead>
                  <TableHead className="text-right">Valor (R$)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detailedExpenses.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {expense.dataDocumento
                        ? new Date(expense.dataDocumento).toLocaleDateString(
                            "pt-BR"
                          )
                        : "-"}
                    </TableCell>
                    <TableCell>{expense.tipoDespesa}</TableCell>
                    <TableCell>{expense.nomeFornecedor || "-"}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(expense.valorLiquido)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex h-40 items-center justify-center text-muted-foreground">
              Nenhuma despesa detalhada encontrada para este mês.
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowDetailModal(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
