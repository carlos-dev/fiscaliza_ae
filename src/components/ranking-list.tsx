"use client";
import { useState } from "react";
import { ArrowUpDown, ChevronDown, ChevronRight } from "lucide-react";
import ParliamentaryCard from "./parliamentary-card";
import { cn } from "@/lib/utils";

interface RankingCategory {
  id: string;
  name: string;
}

interface RankingListProps {
  title: string;
  description?: string;
  data: any[];
  categories?: RankingCategory[];
  className?: string;
}

const RankingList = ({
  title,
  description,
  data,
  categories = [],
  className,
}: RankingListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories.length > 0 ? categories[0].id : "overall"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [expanded, setExpanded] = useState(true);

  // Filter and sort data based on selected category and sort order
  const processedData = [...data].sort((a, b) => {
    const scoreA = a.score;
    const scoreB = b.score;
    return sortOrder === "desc" ? scoreB - scoreA : scoreA - scoreB;
  });

  return (
    <div className={cn("glass rounded-xl overflow-hidden", className)}>
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="mr-2 flex-shrink-0"
          >
            {expanded ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
          <div>
            <h3 className="font-medium">{title}</h3>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm bg-background border rounded-md px-2 py-1"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <span>{sortOrder === "desc" ? "Maior" : "Menor"}</span>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="divide-y">
          {processedData.length > 0 ? (
            processedData.map((item, index) => (
              <ParliamentaryCard
                key={item.id}
                id={item.id}
                name={item.name}
                role={item.role}
                party={item.party}
                state={item.state}
                imageUrl={item.imageUrl}
                score={item.score}
                trend={item.trend}
                rank={index + 1}
                variant="ranking"
              />
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              Nenhum dado disponível
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RankingList;
