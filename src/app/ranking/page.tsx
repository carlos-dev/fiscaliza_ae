"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, BarChart2, ArrowDown, ArrowUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingAnimation from "@/components/loading-animation";
// import { api } from "@/utils/api";
import SearchBar from "@/components/search-bar";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

const Ranking = () => {
  const searchParams = useSearchParams();
  const initialType = searchParams?.get("type") || "all";

  const [activeTab, setActiveTab] = useState(initialType);
  const [topRanked, setTopRanked] = useState<any[]>([]);
  const [bottomRanked, setBottomRanked] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        setLoading(true);

        // Fetch data based on the active tab
        const type = activeTab === "all" ? undefined : activeTab;
        // const [topData, bottomData] = await Promise.all([
        //   api.getRankedParliamentarians(type, 10),
        //   api.getBottomRankedParliamentarians(type, 10),
        // ]);

        // setTopRanked(topData);
        // setBottomRanked(bottomData);
      } catch (error) {
        console.error("Error fetching ranking data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Voltar para a página inicial
          </Link>
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center mb-6">
            <BarChart2 className="h-7 w-7 text-primary mr-3" />
            <h1 className="text-3xl font-bold">Ranking de Parlamentares</h1>
          </div>
          <p className="text-lg text-muted-foreground mb-8">
            Confira o desempenho dos deputados federais e senadores com base em
            dados oficiais de presença, atividade legislativa e transparência.
          </p>

          <SearchBar variant="compact" className="mb-8" />

          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="deputy">Deputados</TabsTrigger>
              <TabsTrigger value="senator">Senadores</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="animate-fadeIn">
              <RankingContent
                loading={loading}
                topRanked={topRanked}
                bottomRanked={bottomRanked}
                type="parlamentares"
              />
            </TabsContent>

            <TabsContent value="deputy" className="animate-fadeIn">
              <RankingContent
                loading={loading}
                topRanked={topRanked}
                bottomRanked={bottomRanked}
                type="deputados"
              />
            </TabsContent>

            <TabsContent value="senator" className="animate-fadeIn">
              <RankingContent
                loading={loading}
                topRanked={topRanked}
                bottomRanked={bottomRanked}
                type="senadores"
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

const RankingContent = ({
  loading,
  topRanked,
  bottomRanked,
  type,
}: {
  loading: boolean;
  topRanked: any[];
  bottomRanked: any[];
  type: string;
}) => {
  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingAnimation text={`Carregando ranking de ${type}...`} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b flex items-center">
          <ArrowUp className="h-5 w-5 text-green-500 mr-2" />
          <h2 className="text-lg font-medium">Melhores {type}</h2>
        </div>
        <div className="divide-y">
          {topRanked.map((item, index) => (
            <RankingItem
              key={item.id}
              rank={index + 1}
              id={item.id}
              name={item.name}
              role={item.role}
              party={item.party}
              state={item.state}
              score={item.score}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b flex items-center">
          <ArrowDown className="h-5 w-5 text-red-500 mr-2" />
          <h2 className="text-lg font-medium">Piores {type}</h2>
        </div>
        <div className="divide-y">
          {bottomRanked.map((item, index) => (
            <RankingItem
              key={item.id}
              rank={index + 1}
              id={item.id}
              name={item.name}
              role={item.role}
              party={item.party}
              state={item.state}
              score={item.score}
              imageUrl={item.imageUrl}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RankingItem = ({
  rank,
  id,
  name,
  role,
  party,
  state,
  score,
  imageUrl,
}: {
  rank: number;
  id: string;
  name: string;
  role: string;
  party: string;
  state: string;
  score: number;
  imageUrl: string;
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-green-500 bg-green-50";
    if (score >= 40) return "text-amber-500 bg-amber-50";
    return "text-red-500 bg-red-50";
  };

  return (
    <Link
      href={`/parliamentary/${id}`}
      className="flex items-center p-4 hover:bg-muted/10 transition-colors"
    >
      <div className="w-8 flex-shrink-0 font-medium text-muted-foreground">
        {rank}
      </div>
      <div className="flex-shrink-0 relative">
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          width={48}
          height={48}
          className="rounded-full object-cover border-2 border-white"
          onError={(e) => {
            // Type assertion for the error event
            const img = e.target as HTMLImageElement;
            img.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="ml-4 flex-1">
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground">
          {role} • {party}/{state}
        </p>
      </div>
      <div className="flex-shrink-0">
        <div
          className={`font-medium text-sm rounded-full h-10 w-10 flex items-center justify-center ${getScoreColor(
            score
          )}`}
        >
          {score}
        </div>
      </div>
    </Link>
  );
};

export default Ranking;
