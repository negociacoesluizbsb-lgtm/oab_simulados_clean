import { BookOpen, Target, Zap } from 'lucide-react';
import DisciplineGrid from '../components/DisciplineGrid';
import type { Questao } from '../types';

export default function HomePage({ questoes, onSelectDisciplina, onOpenSimulado }: { questoes: Questao[]; onSelectDisciplina: (disciplina: string) => void; onOpenSimulado: () => void; }) {
  const disciplinas = Array.from(new Set(questoes.map((q) => q.disciplina))).sort();
  const questionCounts = disciplinas.reduce((acc, disciplina) => {
    acc[disciplina] = questoes.filter((q) => q.disciplina === disciplina).length;
    return acc;
  }, {} as Record<string, number>);

  return <div className="min-h-screen old-home"><section className="container hero-old"><div className="hero-text"><h2>Prepare-se para o Exame da OAB</h2><p>Acesse 2.000 questões originais, cobrindo as disciplinas do exame. Estude de forma interativa e acompanhe seu desempenho.</p></div><div className="stats old-stats"><div className="card stat old"><div className="staticon blue"><BookOpen size={24} /></div><div><p>Total de Questões</p><strong>{questoes.length || 2000}</strong></div></div><div className="card stat old"><div className="staticon indigo"><Target size={24} /></div><div><p>Disciplinas</p><strong>{disciplinas.length}</strong></div></div><div className="card stat old"><div className="staticon green"><Zap size={24} /></div><div><p>Feedback Imediato</p><strong>Sim</strong></div></div></div><div className="full-cta-wrap"><button onClick={onOpenSimulado} className="cta primary full big">Fazer Simulado Completo (80 questões - 5 horas)</button></div><DisciplineGrid disciplines={disciplinas} questionCounts={questionCounts} onSelectDiscipline={onSelectDisciplina} /></section></div>;
}
