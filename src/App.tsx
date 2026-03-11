import { useEffect, useMemo, useState } from 'react';
import { Route, Switch } from 'wouter';
import { BookOpen, Target, BarChart3, PlayCircle } from 'lucide-react';
import type { Questao } from './types';

function Home({ questoes, onStart }: { questoes: Questao[]; onStart: (disc?: string) => void }) {
  const disciplinas = useMemo(() => Array.from(new Set(questoes.map(q => q.disciplina))).sort(), [questoes]);
  return (
    <div className="page">
      <header className="hero">
        <div>
          <h1>OAB Simulados</h1>
          <p>Plataforma limpa para estudar com 2.000 questões e simulado completo.</p>
        </div>
        <div className="hero-actions">
          <button className="primary" onClick={() => onStart()}><PlayCircle size={18}/>Simulado completo</button>
        </div>
      </header>

      <section className="stats">
        <div className="card"><BookOpen size={20}/><strong>{questoes.length}</strong><span>questões</span></div>
        <div className="card"><Target size={20}/><strong>{disciplinas.length}</strong><span>disciplinas</span></div>
        <div className="card"><BarChart3 size={20}/><strong>80</strong><span>questões por simulado</span></div>
      </section>

      <section>
        <h2>Estudar por disciplina</h2>
        <div className="grid">
          {disciplinas.map((d) => {
            const count = questoes.filter(q => q.disciplina === d).length;
            return (
              <button key={d} className="discipline" onClick={() => onStart(d)}>
                <span>{d}</span>
                <small>{count} questões</small>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Simulado({ questoes, disciplina }: { questoes: Questao[]; disciplina?: string }) {
  const selected = useMemo(() => {
    const base = disciplina ? questoes.filter(q => q.disciplina === disciplina) : questoes;
    return [...base].sort(() => Math.random() - 0.5).slice(0, disciplina ? Math.min(30, base.length) : 80);
  }, [questoes, disciplina]);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ total: 0, correct: 0 });

  const current = selected[index];
  if (!current) return <div className="page">Sem questões.</div>;

  const submit = () => {
    if (!answer) return;
    setShowResult(true);
    setScore(s => ({ total: s.total + 1, correct: s.correct + (answer === current.correta ? 1 : 0) }));
  };

  const next = () => {
    if (index < selected.length - 1) {
      setIndex(index + 1);
      setAnswer(null);
      setShowResult(false);
    }
  };

  return (
    <div className="page">
      <div className="sim-header">
        <div>
          <h2>{disciplina ? `Treino: ${disciplina}` : 'Simulado completo'}</h2>
          <p>Questão {index + 1} de {selected.length}</p>
        </div>
        <div className="score">{score.correct}/{score.total}</div>
      </div>
      <div className="question-card">
        <h3>{current.pergunta}</h3>
        <div className="alts">
          {Object.entries(current.alternativas).map(([key, value]) => {
            const selectedClass = answer === key ? 'selected' : '';
            const resultClass = showResult ? (key === current.correta ? 'correct' : answer === key ? 'wrong' : '') : '';
            return (
              <button key={key} className={`alt ${selectedClass} ${resultClass}`.trim()} onClick={() => !showResult && setAnswer(key)}>
                <strong>{key}</strong>
                <span>{value}</span>
              </button>
            );
          })}
        </div>
        {!showResult ? (
          <button className="primary" onClick={submit} disabled={!answer}>Responder</button>
        ) : (
          <button className="primary" onClick={next} disabled={index >= selected.length - 1}>Próxima</button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [disciplina, setDisciplina] = useState<string | undefined>();

  useEffect(() => {
    fetch('/questoes.json').then(r => r.json()).then(setQuestoes);
  }, []);

  return (
    <Switch>
      <Route path="/">
        <Home questoes={questoes} onStart={(d) => { setDisciplina(d); window.history.pushState({}, '', '/simulado'); window.dispatchEvent(new PopStateEvent('popstate')); }} />
      </Route>
      <Route path="/simulado">
        <Simulado questoes={questoes} disciplina={disciplina} />
      </Route>
    </Switch>
  );
}
