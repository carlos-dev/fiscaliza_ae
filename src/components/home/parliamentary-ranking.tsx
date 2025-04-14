import Link from "next/link";
import ParliamentaryCard from "../parliamentary-card";
import { ChevronRight, Users } from "lucide-react";
import LoadingAnimation from "../loading-animation";

const ParliamentaryRanking = () => {
  const loading = false;
  const topDeputies: any[] = [];
  const topSenators: any[] = [];

  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent -z-10"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-10">
            <div className="h-0.5 flex-1 bg-gradient-to-r from-transparent to-primary/20"></div>
            <h2 className="text-3xl font-display font-bold mx-6 text-center">
              Ranking dos Parlamentares
            </h2>
            <div className="h-0.5 flex-1 bg-gradient-to-l from-transparent to-primary/20"></div>
          </div>

          {loading ? (
            <div className="py-20">
              <LoadingAnimation />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-primary" />
                    </span>
                    <h3 className="text-xl font-medium">Melhores Deputados</h3>
                  </div>
                  <Link
                    href="/ranking?type=deputy"
                    className="text-primary flex items-center text-sm font-medium hover:underline"
                  >
                    Ver todos
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {topDeputies.map((deputy) => (
                    <ParliamentaryCard
                      key={deputy.id}
                      id={deputy.id}
                      name={deputy.name}
                      role={deputy.role}
                      party={deputy.party}
                      state={deputy.state}
                      imageUrl={deputy.imageUrl}
                      score={deputy.score}
                      trend={deputy.trend}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="inline-block w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
                      <Users className="h-4 w-4 text-secondary" />
                    </span>
                    <h3 className="text-xl font-medium">Melhores Senadores</h3>
                  </div>
                  <Link
                    href="/ranking?type=senator"
                    className="text-primary flex items-center text-sm font-medium hover:underline"
                  >
                    Ver todos
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {topSenators.map((senator) => (
                    <ParliamentaryCard
                      key={senator.id}
                      id={senator.id}
                      name={senator.name}
                      role={senator.role}
                      party={senator.party}
                      state={senator.state}
                      imageUrl={senator.imageUrl}
                      score={senator.score}
                      trend={senator.trend}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ParliamentaryRanking;
