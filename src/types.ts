export interface Questao {
  id: number;
  disciplina: string;
  pergunta: string;
  alternativas: Record<string, string>;
  correta: string;
  dificuldade?: string;
}
