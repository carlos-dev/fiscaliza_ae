import {
  IDeputyExpenses,
  IDeputyPropositions,
  IDeputyResponse,
  ISearchedSenatorResponse,
  ISenatorAuthorship,
  ISenatorReports,
  ISenatorsResponse,
  ISenatorVotes,
} from "@/types";
import axios from "axios";

export const camaraApi = axios.create({
  baseURL: "https://dadosabertos.camara.leg.br/api/v2",
});

export const senadoApi = axios.create({
  baseURL: "https://legis.senado.leg.br/dadosabertos",
});

export const divulgaContasApi = axios.create({
  baseURL: "http://divulgacandcontas.tse.jus.br/divulga/rest/v1",
});

export const searchDeputy = async (name: string): Promise<IDeputyResponse> => {
  const response = await camaraApi.get(`/deputados`, {
    params: {
      nome: name,
      // ordem: "ASC",
      // ordenarPor: "nome",
    },
  });
  return response.data;
};

export const getDeputy = async (id: number): Promise<IDeputyResponse> => {
  const response = await camaraApi.get(`/deputados`, {
    params: {
      id,
    },
  });
  return response.data;
};

export const getDeputyExpenses = async (
  id: number,
  year: number
): Promise<IDeputyExpenses> => {
  const response = await camaraApi.get(`/deputados/${id}/despesas`, {
    params: {
      ano: year,
      ordenarPor: "mes",
    },
  });
  return response.data;
};

export const getDeputyPropositions = async (
  id: number
): Promise<IDeputyPropositions> => {
  const response = await camaraApi.get(`/proposicoes`, {
    params: {
      idDeputadoAutor: id,
    },
  });
  return response.data;
};

export const getSenators = async (): Promise<ISenatorsResponse> => {
  const response = await senadoApi.get(`/senador/lista/atual`);
  return response.data;
};

export const gehSenatorById = async (
  id: string
): Promise<ISearchedSenatorResponse> => {
  const response = await senadoApi.get<ISearchedSenatorResponse>(
    `/senador/${id}`
  );
  return response.data;
};

export const getAuthorshipSenator = async (
  id: string,
  year: number
): Promise<ISenatorAuthorship> => {
  const response = await senadoApi.get<ISenatorAuthorship>(
    `/senador/${id}/autorias`,
    {
      params: {
        ano: year,
      },
    }
  );
  return response.data;
};

export const getReportsSenator = async (
  id: string,
  year: number
): Promise<ISenatorReports> => {
  const response = await senadoApi.get<ISenatorReports>(
    `/senador/${id}/relatorias`,
    {
      params: {
        ano: year,
      },
    }
  );
  return response.data;
};

export const getVotesSenator = async (
  id: string,
  year: number
): Promise<ISenatorVotes> => {
  const response = await senadoApi.get<ISenatorVotes>(
    `/senador/${id}/votacoes`,
    {
      params: {
        ano: year,
      },
    }
  );
  return response.data;
};

export const getSpeechesSenator = async (
  id: string,
  year: number
): Promise<ISenatorReports> => {
  const response = await senadoApi.get<ISenatorReports>(
    `/senador/${id}/discursos`,
    {
      params: {
        ano: year,
      },
    }
  );
  return response.data;
};
