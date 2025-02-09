"use client";
import { useState } from "react";
import { SearchInput } from "./search-input";
import { TParliamentarianType } from "@/types";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

export function Search() {
  const [parliamentarianType, setParliamentarianType] =
    useState<TParliamentarianType>("deputy");
  return (
    <>
      <h3 className="">Selecione o tipo de cargo</h3>

      <RadioGroup defaultValue="deputy" className="flex">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="deputy" id="deputy" />
          <Label htmlFor="deputy">Deputado</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="senator" id="senator" />
          <Label htmlFor="senator">Comfortable</Label>
        </div>
      </RadioGroup>

      <SearchInput type={parliamentarianType} />
    </>
  );
}
