import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ParliamentaryActionsProps {
  id: string | number;
}

export function ParliamentaryActions({ id }: ParliamentaryActionsProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-4 justify-center">
      <Button asChild>
        <Link href={`/compare?id1=${id}`}>Comparar com outro parlamentar</Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/ranking">Ver ranking completo</Link>
      </Button>
    </div>
  );
}
