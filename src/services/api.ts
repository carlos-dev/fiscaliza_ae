import { IDeputyResponse, ISenatorResponse } from "@/types";
import axios from "axios";

export const camaraApi = axios.create({
  baseURL: "https://dadosabertos.camara.leg.br/api/v2",
});

export const senadoApi = axios.create({
  baseURL: "https://legis.senado.leg.br/dadosabertos",
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

export const getSenators = async (): Promise<ISenatorResponse> => {
  const response = await senadoApi.get(`/senador/lista/atual`);
  return response.data;
};
