import { NextApiRequest, NextApiResponse } from "next";
import * as cheerio from "cheerio";
import { urlApi } from "../base-url";
import { DeputyAmendment } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extractValues = (element: any, indexInfo: number) => {
    return element.find(".emendas-valores__valor").eq(indexInfo).text().trim();
  };

  try {
    const { year, id } = JSON.parse(req.body);
    if (!id) {
      return res.status(400).json({ error: "Deputy ID is required" });
    }

    const { data } = await urlApi.get(`deputados/${id}/todas-emendas`, {
      params: {
        ano: year,
      },
    });

    const $ = cheerio.load(data);
    const amendments: DeputyAmendment[] = [];
    $(".emendas--ver-todas")
      .find("li.emendas__item")
      .each((_, el) => {
        const title = $(el).find(".emendas__destino").text().trim();
        const subtitle = $(el).find(".emendas__descricao").text().trim();
        const authorized = extractValues($(el), 0);
        const committed = extractValues($(el), 1);
        const paid = $(el).find(".emendas-valores__valor").eq(2).text().trim();

        amendments.push({ title, subtitle, authorized, committed, paid });
      });

    return res.status(200).json({ amendments });
  } catch (error) {
    console.error("Error fetching deputy amendments:", error);
    return res
      .status(500)
      .json({ error: "Error fetching parliamentary quota values" });
  }
}
