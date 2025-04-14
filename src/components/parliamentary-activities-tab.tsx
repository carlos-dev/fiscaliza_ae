import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeputyActivity } from "@/types";

interface ParliamentaryActivitiesTabProps {
  activities?: DeputyActivity;
}

export function ParliamentaryActivitiesTab({
  activities,
}: ParliamentaryActivitiesTabProps) {
  if (!activities) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Atividades Parlamentares</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Não há dados de atividades disponíveis para este parlamentar.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activityItems = [
    {
      title: "Proposições de Autoria",
      value: activities.authoredPropositions,
      description: "Propostas legislativas apresentadas pelo parlamentar",
    },
    {
      title: "Matérias Relatadas",
      value: activities.reportedMatters,
      description: "Projetos em que o parlamentar atuou como relator",
    },
    {
      title: "Votações em Plenário",
      value: activities.plenaryVotings,
      description: "Participação em votações nominais no plenário",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {activityItems.map((item, i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle className="text-xl">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{item.value}</div>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
