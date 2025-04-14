import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import { urlApi } from "../base-url";
import { OfficeBudget } from "@/types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { year, id } = JSON.parse(req.body);
    if (!id) {
      return res.status(400).json({ error: "ID do deputado é obrigatório" });
    }

    const { data } = await urlApi.get(`deputados/${id}/verba-gabinete`, {
      params: {
        ano: year,
      },
    });

    const $ = cheerio.load(data);
    const annualOfficeBudget: OfficeBudget[] = [];

    $(".table")
      .find("tbody tr")
      .each((_, el) => {
        const month = $(el).find("td").eq(0).text().trim();
        const avaialbleValue = $(el).find("td").eq(1).text().trim();
        const usedValue = $(el).find("td").eq(2).text().trim();

        annualOfficeBudget.push({ month, avaialbleValue, usedValue });
      });

    return res.status(200).json(annualOfficeBudget);
  } catch (error) {
    console.error("Erro ao buscar deputado:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar valores da cota parlamentar" });
  }
}
