export interface Questao {
  id: number;
  disciplina: string;
  pergunta: string;
  alternativas: Record<string, string>;
  correta: string;
}

export interface UserSession {
  email: string;
  subscribed: boolean;
}
