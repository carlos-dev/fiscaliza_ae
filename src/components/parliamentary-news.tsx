"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Newspaper, ArrowRight, Loader2 } from "lucide-react";
// import { api } from "@/utils/api";
import { Skeleton } from "@/components/ui/skeleton";

interface ParliamentaryNewsProps {
  parliamentarian: {
    id: number;
    name: string;
  };
}

interface NewsItem {
  id: number;
  title: string;
  description: string;
  source: string;
  date: string;
  url: string;
}

const ParliamentaryNews: React.FC<ParliamentaryNewsProps> = ({
  parliamentarian,
}) => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        // Chama a API para buscar notícias
        // const newsData = await api.getParliamentaryNews(parliamentarian.id);
        // setNews(newsData);
      } catch (err) {
        console.error("Erro ao buscar notícias:", err);
        setError(
          "Não foi possível carregar as notícias. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [parliamentarian.id]);

  return (
    <Card className="shadow-md mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-primary" />
          Notícias Recentes
        </CardTitle>
        <CardDescription>
          Últimas matérias e notícias relacionadas a {parliamentarian.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="p-4 text-center bg-muted rounded-md text-muted-foreground">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && news.length === 0 && (
          <div className="p-4 text-center bg-muted rounded-md text-muted-foreground">
            <p>Nenhuma notícia encontrada para este parlamentar.</p>
          </div>
        )}

        {!loading && !error && news.length > 0 && (
          <div className="space-y-4 divide-y">
            {news.map((item) => (
              <div key={item.id} className="pt-4 first:pt-0">
                <h3 className="font-medium text-lg">{item.title}</h3>
                <p className="text-muted-foreground mt-1">{item.description}</p>
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-muted-foreground">
                    {item.source} • {item.date}
                  </span>
                  <Button variant="ghost" size="sm" asChild className="gap-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ler mais <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between">
        <span>Fontes: portais de notícias e comunicações oficiais.</span>
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://news.google.com/search?q=${encodeURIComponent(
              parliamentarian.name
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver mais notícias
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ParliamentaryNews;
