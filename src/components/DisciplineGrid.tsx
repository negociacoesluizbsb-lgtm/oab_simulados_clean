import type { Questao } from '../types';

export default function DisciplineGrid({ disciplines, questionCounts, onSelectDiscipline }: { disciplines: string[]; questionCounts: Record<string, number>; onSelectDiscipline: (discipline: string) => void; }) {
  return (
    <div>
      <h3 className="section-title">Escolha uma Disciplina</h3>
      <div className="discipline-grid">
        {disciplines.map((discipline) => (
          <div key={discipline} className="discipline-card card">
            <div className="discipline-head">
              <h4>{discipline}</h4>
              <span className="badge">{questionCounts[discipline] || 0}</span>
            </div>
            <button onClick={() => onSelectDiscipline(discipline)} className="cta primary full">Iniciar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
