export default function QuestionCard({ question, alternatives, selectedAnswer, correctAnswer, showResult, onAnswerClick, onSubmit, onNext, isLastQuestion }: { question: string; alternatives: Record<string,string>; selectedAnswer: string | null; correctAnswer: string; showResult: boolean; onAnswerClick: (answer: string) => void; onSubmit: () => void; onNext: () => void; isLastQuestion: boolean; }) {
  const isAnswerCorrect = selectedAnswer === correctAnswer;
  return (
    <div className="card question-card oldlike">
      <div className="mb-8"><h2>{question}</h2></div>
      <div className="spacey">
        {['A','B','C','D'].map((letter) => (
          <button key={letter} onClick={() => onAnswerClick(letter)} disabled={showResult} className={`option-btn ${selectedAnswer === letter ? (showResult ? (isAnswerCorrect ? 'correct' : 'wrong') : 'active') : (showResult && letter === correctAnswer ? 'correct' : '')}`}>
            <div className="option-row">
              <div className="option-bullet">{letter}</div>
              <div className="option-text">{alternatives[letter]}</div>
            </div>
          </button>
        ))}
      </div>
      {showResult && <div className={`result-box ${isAnswerCorrect ? 'ok' : 'bad'}`}><p className="result-title">{isAnswerCorrect ? 'Resposta correta' : 'Resposta incorreta'}</p><p className="result-sub">A resposta correta é a alternativa <strong>{correctAnswer}</strong>.</p></div>}
      <div className="mt-8 flexline">{!showResult ? <button onClick={onSubmit} disabled={!selectedAnswer} className="cta primary full">Responder</button> : <button onClick={onNext} className="cta primary full">{isLastQuestion ? 'Finalizar' : 'Próxima questão'}</button>}</div>
    </div>
  );
}
