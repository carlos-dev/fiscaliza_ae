"use client";

import { Button } from "./button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Skeleton } from "./skeleton";
import { ReactNode } from "react";

interface DeputyCardProps {
  title: string;
  subtitle: string;
  summary: ReactNode;
  isLoading?: boolean;
  dialogTitle?: string;
  children?: ReactNode;
}

export function DeputyCard({
  title,
  subtitle,
  summary,
  isLoading,
  dialogTitle,
  children,
}: DeputyCardProps) {
  if (isLoading) {
    return (
      <div className="mt-8 bg-white/5 p-3 rounded-lg">
        <Skeleton className="h-[200px]" />
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white/5 p-3 rounded-lg">
      <div className="flex space-x-6">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-sm mb-2">{subtitle}</p>
          {summary}
        </div>

        {children && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="px-2">Ver detalhes</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{dialogTitle || title}</DialogTitle>
              </DialogHeader>
              <div className="mt-4">{children}</div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
