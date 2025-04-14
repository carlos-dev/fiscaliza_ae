import {
  CalendarClock,
  FileText,
  Award,
  MessageSquare,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Image from "next/image";

interface ParliamentaryHeaderProps {
  parliamentaryData: {
    imageUrl: string;
    name: string;
    party: string;
    state: string;
    role: string;
    score: number;
    trend: string;
    attendance: string | number;
    proposedLaws: number;
    approvedLaws: number;
    speeches: number;
  };
}

export function ParliamentaryHeader({
  parliamentaryData,
}: ParliamentaryHeaderProps) {
  const getScoreColorClass = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="glass rounded-xl p-6 mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 h-24 w-24 bg-primary/10 rounded-bl-[100px]"></div>

      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="relative">
          <Image
            src={parliamentaryData.imageUrl}
            alt={parliamentaryData.name}
            className="h-32 w-32 rounded-xl object-cover border-4 border-background"
            width={128}
            height={128}
          />
          <div
            className={`absolute -bottom-3 -right-3 h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${getScoreColorClass(
              parliamentaryData.score
            )}`}
          >
            {parliamentaryData.score}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold">{parliamentaryData.name}</h1>
              <p className="text-muted-foreground">
                {parliamentaryData.role} • {parliamentaryData.party}/
                {parliamentaryData.state}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {parliamentaryData.trend === "up" && (
                <div className="flex items-center text-green-500 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Em alta
                </div>
              )}
              {parliamentaryData.trend === "down" && (
                <div className="flex items-center text-red-500 text-sm font-medium">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  Em queda
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="inline-flex items-center bg-muted px-3 py-1 rounded-full text-sm">
              <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
              Presença: {parliamentaryData.attendance}%
            </div>
            <div className="inline-flex items-center bg-muted px-3 py-1 rounded-full text-sm">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              {parliamentaryData.proposedLaws} projetos
            </div>
            <div className="inline-flex items-center bg-muted px-3 py-1 rounded-full text-sm">
              <Award className="h-4 w-4 mr-2 text-muted-foreground" />
              {parliamentaryData.approvedLaws} aprovados
            </div>
            <div className="inline-flex items-center bg-muted px-3 py-1 rounded-full text-sm">
              <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
              {parliamentaryData.speeches} discursos
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
