import axios from "axios";

export const urlApi = axios.create({
  baseURL: "https://www.camara.leg.br",
});
