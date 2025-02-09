export interface IDeputyResponse {
  dados: {
    id: number;
    nome: string;
    siglaPartido: string;
    siglaUf: string;
    urlFoto: string;
  }[];
}

export interface ISenatorResponse {
  ListaParlamentarEmExercicio: {
    Parlamentares: {
      Parlamentar: {
        IdentificacaoParlamentar: {
          CodigoParlamentar: string;
          NomeParlamentar: string;
          SiglaPartidoParlamentar: string;
          UfParlamentar: string;
          UrlFotoParlamentar: string;
        };
      }[];
    };
  };
}

export type TParliamentarianType = "deputy" | "senator";
