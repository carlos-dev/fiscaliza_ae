export interface IDeputy {
  id: number;
  nome: string;
  siglaPartido: string;
  siglaUf: string;
  urlFoto: string;
}

export interface IDeputyResponse {
  dados: IDeputy[];
}

export interface IDeputyExpenses {
  dados: {
    ano: number;
    mes: number;
    tipoDespesa: string;
    valorLiquido: number;
  }[];
}

export interface IDeputyPropositions {
  dados: {
    ano: number;
    ementa: string;
    id: number;
    siglaTipo: string;
  }[];
}

export interface ISenatorRaw {
  IdentificacaoParlamentar: {
    CodigoParlamentar: string;
    NomeParlamentar: string;
    NomeCompletoParlamentar: string;
    SiglaPartidoParlamentar: string;
    UfParlamentar: string;
    UrlFotoParlamentar: string;
    EmailParlamentar: string;
  };
}

export interface ISenatorsResponse {
  ListaParlamentarEmExercicio: {
    Parlamentares: {
      Parlamentar: ISenatorRaw[];
    };
  };
}

export interface ISearchedSenatorResponse {
  DetalheParlamentar: {
    Parlamentar: {
      IdentificacaoParlamentar: ISenatorRaw;
    };
  };
}

export type TParliamentarianType = "deputy" | "senator";

export interface ISenatorDetails {
  IdentificacaoParlamentar: ISenatorRaw;
  DadosBasicosParlamentar: {
    DataNascimento: string;
    Naturalidade: string;
    UfNaturalidade: string;
  };
}

export interface ISenatorAuthorship {
  MateriasAutoriaParlamentar: {
    Parlamentar: {
      Autorias: {
        Autoria: {
          Materia: {
            Codigo: string;
            DescricaoIdentificacao: string;
            Ementa: string;
            Data: string;
          };
        }[];
      };
    };
  };
}

export interface ISenatorReports {
  MateriasRelatoriaParlamentar: {
    Parlamentar: {
      Relatorias: {
        Relatoria: {
          DescricaoMotivoDestituicao?: string;
          Materia: {
            Codigo: string;
            DescricaoIdentificacao: string;
            Ementa: string;
            Autor: string;
            Data: string;
          };
        }[];
      };
    };
  };
}

export interface ISenatorVotes {
  VotacaoParlamentar: {
    Parlamentar: {
      Votacoes: {
        Votacao: {
          Materia: {
            Codigo: string;
            DescricaoIdentificacao: string;
            Ano: string;
            Ementa: string;
            Data: string;
          };
          DescricaoVotacao: string;
          DescricaoResultado: string;
          DescricaoVoto: string;
        }[];
      };
    };
  };
}

export interface DeputyActivity {
  authoredPropositions: string;
  reportedMatters: string;
  plenaryVotings: string;
}

export interface DeputyAttendance {
  presences: string;
  justifiedAbsences: string;
  unjustifiedAbsences: string;
}

export interface DeputyDetailsResponse {
  id: string | number;
  name: string;
  email: string;
  plenaryActivities: DeputyActivity;
  plenaryAttendance: DeputyAttendance;
  committeeAttendance: DeputyAttendance;
  salary: string;
  officeQuantity: string;
  functionalProperty: string;
  housingAllowance: string;
}

export interface DeputyAmendment {
  title: string;
  subtitle: string;
  authorized: string;
  committed: string;
  paid: string;
}

export interface DeputyAmendmentsResponse {
  amendments: DeputyAmendment[];
}

export interface DeputyActivity {
  authoredPropositions: string;
  reportedMatters: string;
  plenaryVotings: string;
}

export interface DeputyAttendance {
  presences: string;
  justifiedAbsences: string;
  unjustifiedAbsences: string;
}

export interface DeputyAmendment {
  title: string;
  subtitle: string;
  authorized: string;
  committed: string;
  paid: string;
}

export interface ParliamentaryExpense {
  month: string;
  value: number;
}

export interface OfficeBudget {
  month: string;
  avaialbleValue: string;
  usedValue: string;
}

export interface ParliamentaryQuota {
  monthYear: string;
  value: string;
}
