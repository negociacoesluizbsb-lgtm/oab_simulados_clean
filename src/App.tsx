import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import type { Questao, UserSession } from './types';

const PRICE = 'R$ 39,90/mês';
const FREE_TOTAL_LIMIT = 2;
const SIMULADO_DEMO_LIMIT = 1;

function readJson<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
function writeJson(key: string, value: unknown) { localStorage.setItem(key, JSON.stringify(value)); }

function Topbar({ session, onLogout }: { session: UserSession | null; onLogout: () => void }) {
  return <header className='topbar'><Link href='/'><strong>OAB Simulados</strong></Link><nav>{session ? <><span>{session.email}</span><Link href='/app'>Área</Link><button onClick={onLogout}>Sair</button></> : <><Link href='/login'>Login</Link><Link href='/checkout' className='btn'>Assinar</Link></>}</nav></header>;
}

function Home() {
  return <div className='page'><section className='hero'><div><h1>Passe na OAB com treino objetivo</h1><p>Banco de questões, simulados e acesso premium por assinatura.</p><div className='cta-row'><Link href='/app' className='btn'>Testar grátis</Link><Link href='/checkout' className='btn ghost'>Assinar {PRICE}</Link></div><ul><li>2 questões grátis no total</li><li>1 questão de amostra no simulado</li><li>restante só para assinantes</li></ul></div></section></div>;
}

function Login({ onLogin }: { onLogin: (s: UserSession) => void }) {
  const [, nav] = useLocation(); const [email, setEmail] = useState('');
  return <div className='page narrow'><h2>Login</h2><p>Área premium só com login.</p><form onSubmit={(e)=>{e.preventDefault(); const s={email, subscribed:false}; writeJson('session', s); onLogin(s); nav('/app');}} className='card form'><input placeholder='Seu e-mail' type='email' value={email} onChange={e=>setEmail(e.target.value)} required /><button className='btn'>Entrar</button></form></div>;
}

function Checkout({ session, onActivate }: { session: UserSession | null; onActivate: () => void }) {
  const [, nav] = useLocation();
  async function start() {
    if (!session) return nav('/login');
    try {
      const r = await fetch('/api/create-checkout', { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ email: session.email, plan: 'premium', amount: 39.9 }) });
      const data = await r.json();
      if (data.checkoutUrl) window.location.href = data.checkoutUrl;
      else {
        onActivate();
        nav('/app');
      }
    } catch {
      onActivate();
      nav('/app');
    }
  }
  return <div className='page narrow'><div className='card'><h2>Assinatura Premium</h2><p><strong>{PRICE}</strong></p><ul><li>Banco completo de questões</li><li>Simulado completo</li><li>Acesso premium bloqueado para não assinantes</li></ul><button className='btn' onClick={start}>Assinar com Mercado Pago</button></div></div>;
}

function AppArea({ questoes, session, onActivate }: { questoes: Questao[]; session: UserSession | null; onActivate: () => void }) {
  const [, nav] = useLocation();
  const freeUsed = readJson<number>('free_used_total', 0);
  const [current, setCurrent] = useState(0); const [selected, setSelected] = useState<string | null>(null); const [checked, setChecked] = useState(false);
  const isPremium = !!session?.subscribed;
  const canUseQuestion = isPremium || freeUsed < FREE_TOTAL_LIMIT;
  const question = questoes[current];
  if (!session) { nav('/login'); return null; }
  function submit() { if (!selected) return; setChecked(true); if (!isPremium && freeUsed < FREE_TOTAL_LIMIT) writeJson('free_used_total', freeUsed + 1); }
  function next() { setCurrent((v)=>Math.min(v+1, questoes.length-1)); setSelected(null); setChecked(false); }
  return <div className='page'><div className='split'><div><h2>Questões</h2><p>Grátis usadas: {Math.min(freeUsed, FREE_TOTAL_LIMIT)}/{FREE_TOTAL_LIMIT}</p></div><Link href='/simulado' className='btn ghost'>Ir para simulado</Link></div>{canUseQuestion ? <div className='card'><h3>{question?.pergunta}</h3><div className='alts'>{Object.entries(question?.alternativas || {}).map(([k,v]) => <button key={k} className={`alt ${selected===k?'selected':''} ${checked && k===question.correta?'correct':''}`} onClick={()=>!checked && setSelected(k)}><strong>{k}</strong><span>{v}</span></button>)}</div><div className='cta-row'>{!checked ? <button className='btn' onClick={submit}>Responder</button> : <button className='btn' onClick={next}>Próxima</button>}</div></div> : <div className='card paywall'><h3>Limite grátis atingido</h3><p>Você já usou as 2 questões grátis totais.</p><button className='btn' onClick={()=>nav('/checkout')}>Assinar {PRICE}</button></div>}{!isPremium && <div className='notice'>Sem assinatura: acesso limitado.</div>}<div className='card'><button className='btn ghost' onClick={onActivate}>Simular assinatura ativa</button></div></div>;
}

function Simulado({ questoes, session }: { questoes: Questao[]; session: UserSession | null }) {
  const [, nav] = useLocation(); if (!session) { nav('/login'); return null; }
  const isPremium = !!session.subscribed; const list = isPremium ? questoes.slice(0, 20) : questoes.slice(0, SIMULADO_DEMO_LIMIT);
  const [i, setI] = useState(0); const [answer, setAnswer] = useState<string | null>(null); const q = list[i];
  return <div className='page'><div className='split'><div><h2>Simulado</h2><p>{isPremium ? 'Acesso completo liberado.' : 'Somente 1 questão de amostra sem assinatura.'}</p></div>{!isPremium && <Link href='/checkout' className='btn'>Desbloquear</Link>}</div><div className='card'><h3>{q?.pergunta}</h3><div className='alts'>{Object.entries(q?.alternativas || {}).map(([k,v]) => <button key={k} className={`alt ${answer===k?'selected':''}`} onClick={()=>setAnswer(k)}><strong>{k}</strong><span>{v}</span></button>)}</div><div className='cta-row'>{i < list.length - 1 ? <button className='btn' onClick={()=>{setI(i+1); setAnswer(null);}}>Próxima</button> : !isPremium ? <button className='btn' onClick={()=>nav('/checkout')}>Assinar para continuar</button> : <span>Fim do simulado</span>}</div></div></div>;
}

export default function App() {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [session, setSession] = useState<UserSession | null>(readJson('session', null));
  useEffect(() => { fetch('/questoes.json').then(r => r.json()).then(setQuestoes).catch(()=>setQuestoes([])); }, []);
  const sorted = useMemo(()=>questoes.slice(0, 2000), [questoes]);
  function activate() { const next = session ? { ...session, subscribed: true } : null; if (next) { writeJson('session', next); setSession(next); } }
  function logout() { localStorage.removeItem('session'); setSession(null); }
  return <><Topbar session={session} onLogout={logout} /><Switch><Route path='/'><Home /></Route><Route path='/login'><Login onLogin={setSession} /></Route><Route path='/checkout'><Checkout session={session} onActivate={activate} /></Route><Route path='/app'><AppArea questoes={sorted} session={session} onActivate={activate} /></Route><Route path='/simulado'><Simulado questoes={sorted} session={session} /></Route></Switch></>;
}
