import { BookOpen, Target, Zap } from 'lucide-react';
import DisciplineGrid from '../components/DisciplineGrid';
import type { Questao } from '../types';

export default function HomePage({ questoes, onSelectDisciplina, onOpenSimulado }: { questoes: Questao[]; onSelectDisciplina: (disciplina: string) => void; onOpenSimulado: () => void; }) {
  const disciplinas = Array.from(new Set(questoes.map((q) => q.disciplina))).sort();
  const questionCounts = disciplinas.reduce((acc, disciplina) => {
    acc[disciplina] = questoes.filter((q) => q.disciplina === disciplina).length;
    return acc;
  }, {} as Record<string, number>);

  return <div className="min-h-screen old-home"><section className="container hero-old"><div className="hero-text"><h2>Treine para a OAB com foco no que mais cai</h2><p>Teste gratuitamente questões por disciplina, experimente uma amostra do simulado e desbloqueie o acesso premium para estudar com mais profundidade.</p></div><div className="stats old-stats"><div className="card stat old"><div className="staticon blue"><BookOpen size={24} /></div><div><p>Total de Questões</p><strong>{questoes.length || 2000}</strong></div></div><div className="card stat old"><div className="staticon indigo"><Target size={24} /></div><div><p>Disciplinas</p><strong>{disciplinas.length}</strong></div></div><div className="card stat old"><div className="staticon green"><Zap size={24} /></div><div><p>Feedback Imediato</p><strong>Sim</strong></div></div></div><div className="card home-offer"><h3>Comece grátis e evolua para o premium</h3><p>Você pode testar <strong>2 questões grátis</strong> e acessar <strong>1 questão de amostra no simulado</strong>. No premium, libera o banco completo e o simulado estendido.</p></div><div className="full-cta-wrap"><button onClick={onOpenSimulado} className="cta primary full big">Testar simulado grátis</button></div><DisciplineGrid disciplines={disciplinas} questionCounts={questionCounts} onSelectDiscipline={onSelectDisciplina} /></section></div>;
}
