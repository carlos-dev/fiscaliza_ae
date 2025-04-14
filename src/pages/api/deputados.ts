import * as cheerio from "cheerio";
import { NextApiRequest, NextApiResponse } from "next";
import { urlApi } from "../base-url";
import {
  DeputyActivity,
  DeputyAttendance,
  DeputyDetailsResponse,
} from "@/types";

const extractPlenaryActivities = ($: cheerio.CheerioAPI): DeputyActivity => {
  const activities: DeputyActivity = {
    authoredPropositions: "0",
    reportedMatters: "0",
    plenaryVotings: "0",
  };

  $("#atuacao-section .atuacao .atuacao__item").each((_, el) => {
    const label = $(el).find(".atuacao__tipo").text().trim();
    const text = $(el).find(".atuacao__quantidade").text().trim();

    if (label.includes("de sua autoria"))
      activities.authoredPropositions = text;
    if (label.includes("relatadas")) activities.reportedMatters = text;
    if (label.includes("em Plenário")) activities.plenaryVotings = text;
  });

  return activities;
};

const extractPlenaryAttendance = ($: cheerio.CheerioAPI): DeputyAttendance => {
  const attendance: DeputyAttendance = {
    presences: "0",
    justifiedAbsences: "0",
    unjustifiedAbsences: "0",
  };

  $(".presencas__section:contains('em Plenário')")
    .find(".presencas__data span")
    .each((i, el) => {
      const text = $(el).text().trim();
      if (i === 2) attendance.presences = text;
      if (i === 4) attendance.justifiedAbsences = text;
      if (i === 6) attendance.unjustifiedAbsences = text;
    });

  return attendance;
};

const extractCommitteeAttendance = (
  $: cheerio.CheerioAPI
): DeputyAttendance => {
  const attendance: DeputyAttendance = {
    presences: "0",
    justifiedAbsences: "0",
    unjustifiedAbsences: "0",
  };

  $(".presencas__section:contains('em Comissões')")
    .find(".presencas__data span")
    .each((i, el) => {
      const text = $(el).text().trim();
      if (i === 2) attendance.presences = text;
      if (i === 4) attendance.justifiedAbsences = text;
      if (i === 6) attendance.unjustifiedAbsences = text;
    });

  return attendance;
};

const extractDeputyDetail = ({
  $,
  indexInfo,
  tag = "a",
  shouldRemoveWhiteSpace,
}: {
  $: cheerio.CheerioAPI;
  indexInfo: number;
  tag?: string;
  shouldRemoveWhiteSpace?: boolean;
}) => {
  if (shouldRemoveWhiteSpace) {
    return $(".recursos-beneficios-deputado-container")
      .find("li")
      .eq(indexInfo)
      .find(tag)
      .text()
      .trim()
      .replace(/\s+/g, "")
      .replace("?", "");
  }

  return $(".recursos-beneficios-deputado-container")
    .find("li")
    .eq(indexInfo)
    .find(tag)
    .text()
    .trim();
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const { id } = req.query;
    console.log("Deputy ID:", req.body);

    const { year } = JSON.parse(req.body);
    if (!id) {
      return res.status(400).json({ error: "Deputy ID is required" });
    }

    const { data } = await urlApi.get(`/deputados/${id}`, {
      params: {
        ano: year,
      },
    });
    const $ = cheerio.load(data);

    const name = $(".nome-deputado").text().trim();
    const email = $(".email").attr("href")?.replace("mailto:", "").trim();
    const plenaryActivities = extractPlenaryActivities($);
    const plenaryAttendance = extractPlenaryAttendance($);
    const committeeAttendance = extractCommitteeAttendance($);
    const officeQuantity = extractDeputyDetail({ $, indexInfo: 0 });
    const salary = extractDeputyDetail({
      $,
      indexInfo: 1,
      shouldRemoveWhiteSpace: true,
    });
    const functionalProperty = extractDeputyDetail({
      $,
      indexInfo: 2,
      tag: "span",
    });
    const housingAllowance = extractDeputyDetail({
      $,
      indexInfo: 3,
      tag: "span",
    });

    const deputy: DeputyDetailsResponse = {
      id: id as string,
      name,
      email: email || "",
      plenaryActivities,
      plenaryAttendance,
      committeeAttendance,
      salary,
      officeQuantity: officeQuantity.replace("?", ""),
      functionalProperty,
      housingAllowance,
    };

    return res.status(200).json(deputy);
  } catch (error) {
    console.error("Error fetching deputy:", error);
    return res.status(500).json({ error: "Error fetching deputy" });
  }
}
