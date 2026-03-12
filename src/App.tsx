import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { BookOpen } from 'lucide-react';
import type { Questao, UserSession } from './types';
import HomePage from './pages/HomePage';
import QuestionCard from './components/QuestionCard';
import embeddedQuestoes from './data/questoes.json';

const PRICE = 'R$ 39,90/mês';
const FREE_TOTAL_LIMIT = 2;
const SIMULADO_DEMO_LIMIT = 1;

function readJson<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
function writeJson(key: string, value: unknown) { localStorage.setItem(key, JSON.stringify(value)); }

function Topbar({ session, onLogout }: { session: UserSession | null; onLogout: () => void }) {
  return <header className='topbar'><div className='container navwrap'><Link href='/' className='brand'><span className='logo'><BookOpen size={22} /></span><span><strong>OAB Simulados</strong><small>Plataforma de estudos para o Exame da Ordem</small></span></Link><nav>{session ? <><span className='email'>{session.email}</span><Link href='/app' className='navbtn outline'>Área</Link><button className='navbtn outline' onClick={onLogout}>Sair</button></> : <><Link href='/login' className='navbtn outline'>Login</Link><Link href='/checkout' className='navbtn'>Assinar</Link></>}</nav></div></header>;
}

function Login({ onLogin }: { onLogin: (s: UserSession) => void }) {
  const [, nav] = useLocation(); const [email, setEmail] = useState('');
  return <div className='page narrow'><div className='card'><h2>Entrar</h2><p>Área premium só com login.</p><form onSubmit={(e)=>{e.preventDefault(); const s={email, subscribed:false}; writeJson('session', s); onLogin(s); nav('/app');}} className='form'><input placeholder='Seu e-mail' type='email' value={email} onChange={e=>setEmail(e.target.value)} required /><button className='cta primary'>Entrar</button></form></div></div>;
}

function Checkout({ session, onActivate }: { session: UserSession | null; onActivate: () => void }) {
  const [, nav] = useLocation();
  async function start() {
    if (!session) return nav('/login');
    try {
      const r = await fetch('/api/create-checkout', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ email: session.email, plan: 'premium', amount: 39.9 }) });
      const data = await r.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl; else { onActivate(); nav('/app'); }
    } catch { onActivate(); nav('/app'); }
  }
  return <div className='page narrow'><div className='card'><h2>Assinatura Premium</h2><p><strong>{PRICE}</strong></p><ul><li>Banco completo de questões</li><li>Simulado completo</li><li>Bloqueio premium ativo</li></ul><button className='cta primary' onClick={start}>Assinar com Mercado Pago</button></div></div>;
}

function AppArea({ questoes, session, onActivate }: { questoes: Questao[]; session: UserSession | null; onActivate: () => void }) {
  const [, nav] = useLocation();
  const freeUsed = readJson<number>('free_used_total', 0);
  const selectedDisciplina = sessionStorage.getItem('selected_disciplina') || '';
  const filtered = selectedDisciplina ? questoes.filter(q => q.disciplina === selectedDisciplina) : questoes;
  const [current, setCurrent] = useState(0); const [selected, setSelected] = useState<string | null>(null); const [checked, setChecked] = useState(false);
  const isPremium = !!session?.subscribed;
  const canUseQuestion = isPremium || freeUsed < FREE_TOTAL_LIMIT;
  const question = filtered[current];
  if (!session) { nav('/login'); return null; }
  function submit() { if (!selected) return; setChecked(true); if (!isPremium && freeUsed < FREE_TOTAL_LIMIT) writeJson('free_used_total', freeUsed + 1); }
  function next() { setCurrent((v)=>Math.min(v+1, filtered.length-1)); setSelected(null); setChecked(false); }
  return <div className='page'><div className='sectionhead'><div><h1>{selectedDisciplina || 'Questões'}</h1><p>Grátis usadas: {Math.min(freeUsed, FREE_TOTAL_LIMIT)}/{FREE_TOTAL_LIMIT}</p></div><div className='headactions'><Link href='/simulado' className='navbtn outline'>Simulado</Link><button className='navbtn outline' onClick={onActivate}>Simular premium</button></div></div>{question ? (canUseQuestion ? <QuestionCard question={question.pergunta} alternatives={question.alternativas} selectedAnswer={selected} correctAnswer={question.correta} showResult={checked} onAnswerClick={setSelected} onSubmit={submit} onNext={next} isLastQuestion={current === filtered.length - 1} /> : <div className='card paywall'><h3>Limite grátis atingido</h3><p>Você já usou as 2 questões grátis totais.</p><button className='cta primary' onClick={()=>nav('/checkout')}>Assinar {PRICE}</button></div>) : <div className='card'><h3>Sem questões</h3><p>Selecione uma matéria na página inicial para treinar por disciplina.</p></div>}</div>;
}

function Simulado({ questoes, session }: { questoes: Questao[]; session: UserSession | null }) {
  const [, nav] = useLocation(); if (!session) { nav('/login'); return null; }
  const isPremium = !!session.subscribed; const list = isPremium ? questoes.slice(0, 80) : questoes.slice(0, SIMULADO_DEMO_LIMIT);
  const [i, setI] = useState(0); const [answer, setAnswer] = useState<string | null>(null); const [checked, setChecked] = useState(false); const q = list[i];
  function submit(){ if(!answer) return; setChecked(true); }
  function next(){ setI(i+1); setAnswer(null); setChecked(false); }
  return <div className='page'><div className='sectionhead'><div><h1>Simulado</h1><p>{isPremium ? 'Modo completo: 80 questões.' : 'Sem assinatura: 1 questão de amostra.'}</p></div>{!isPremium && <Link href='/checkout' className='cta primary'>Desbloquear</Link>}</div>{q ? <QuestionCard question={q.pergunta} alternatives={q.alternativas} selectedAnswer={answer} correctAnswer={q.correta} showResult={checked} onAnswerClick={setAnswer} onSubmit={submit} onNext={next} isLastQuestion={i === list.length - 1} /> : <div className='card'><h3>Sem questões</h3></div>}{checked && i === list.length - 1 && !isPremium && <div className='card paywall'><h3>Fim da amostra</h3><button className='cta primary' onClick={()=>nav('/checkout')}>Assinar para continuar</button></div>}</div>;
}

export default function App() {
  const [, nav] = useLocation();
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [session, setSession] = useState<UserSession | null>(readJson('session', null));
  useEffect(() => { setQuestoes((embeddedQuestoes as Questao[]) || []); }, []);
  const sorted = useMemo(()=>questoes.slice(0, 2000), [questoes]);
  function activate() { const next = session ? { ...session, subscribed: true } : null; if (next) { writeJson('session', next); setSession(next); } }
  function logout() { localStorage.removeItem('session'); setSession(null); }
  function selectDisciplina(d: string){ sessionStorage.setItem('selected_disciplina', d); nav('/app'); }
  return <><Topbar session={session} onLogout={logout} /><Switch><Route path='/'><HomePage questoes={sorted} onSelectDisciplina={selectDisciplina} onOpenSimulado={() => nav('/simulado')} /></Route><Route path='/login'><Login onLogin={setSession} /></Route><Route path='/checkout'><Checkout session={session} onActivate={activate} /></Route><Route path='/app'><AppArea questoes={sorted} session={session} onActivate={activate} /></Route><Route path='/simulado'><Simulado questoes={sorted} session={session} /></Route></Switch><footer className='footer'>© 2026 OAB Simulados.</footer></>;
}
