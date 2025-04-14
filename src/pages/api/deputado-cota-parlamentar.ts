import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import { urlApi } from "../base-url";
import { ParliamentaryQuota } from "@/types/index";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { year, id } = JSON.parse(req.body);
    if (!id) {
      return res.status(400).json({ error: "ID do deputado é obrigatório" });
    }

    const { data } = await urlApi.get(
      `/cota-parlamentar/consulta-cota-parlamentar?ideDeputado=${id}&dataInicio=0120${year}&dataFim=1220${year}`
    );

    const $ = cheerio.load(data);
    const annualExpenseList: ParliamentaryQuota[] = [];

    $(".tabela-2")
      .find("tr.detalhe")
      .each((i, el) => {
        const monthYear = $(el).find('th[scope="row"]').text().trim();
        const value = $(el).find(`#nivel2Total0${i}`).text().trim();
        console.log({ value });
        annualExpenseList.push({ monthYear, value });
      });

    return res.status(200).json(annualExpenseList);
  } catch (error) {
    console.error("Erro ao buscar deputado:", error);
    return res
      .status(500)
      .json({ error: "Erro ao buscar valores da cota parlamentar" });
  }
}
