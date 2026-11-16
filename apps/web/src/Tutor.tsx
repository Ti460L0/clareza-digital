import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { courses } from '../../../packages/content';

const replySchema = z.object({
  kind: z.enum(['answer', 'insufficient', 'redirect', 'refusal']),
  answer: z.string().min(10).max(1600),
  generated: z.boolean(),
  references: z.array(z.object({ id: z.string(), quote: z.string().max(500), title: z.string(), path: z.string() })).max(3),
});
type Reply = z.infer<typeof replySchema>;
type Message = { role: 'user' | 'assistant'; text: string; reply?: Reply };
const knownPaths = new Set(courses.flatMap(c => c.lessons.map(l => `/cursos/${c.id}/aulas/${l.id}`)));

export function Tutor({ lessonId, hint = false }: { lessonId: string; hint?: boolean }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const controller = useRef<AbortController | null>(null);
  const statusController = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  useEffect(() => () => { sequence.current++; controller.current?.abort(); statusController.current?.abort(); }, []);

  async function check() {
    statusController.current?.abort();
    const current = new AbortController();
    statusController.current = current;
    setChecking(true);
    try {
      const response = await fetch('/api/status', { signal: AbortSignal.any([current.signal, AbortSignal.timeout(8000)]), cache: 'no-store' });
      if (!response.ok) throw Error();
      const data = await response.json();
      if (!current.signal.aborted) setAvailable(data.available === true && data.provider === 'OpenAI');
    } catch { if (!current.signal.aborted) setAvailable(false); }
    finally { if (!current.signal.aborted) setChecking(false); }
  }
  function cancel() {
    sequence.current++;
    controller.current?.abort();
    setBusy(false);
    setNotice('Espera cancelada. Uma pergunta já enviada pode ter sido processada pelo provedor.');
    field.current?.focus();
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!consent || !available || busy || message.trim().length < 3) return;
    const currentSequence = ++sequence.current;
    controller.current = new AbortController();
    const question = message.trim();
    setBusy(true);
    setNotice('Preparando uma explicação. Você pode continuar lendo a aula.');
    try {
      const response = await fetch('/api/tutor', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, cache: 'no-store',
        signal: AbortSignal.any([controller.current.signal, AbortSignal.timeout(25_000)]),
        body: JSON.stringify({ message: question, lessonId, mode: hint ? 'hint' : 'explain', history: messages.slice(-4).map(({ role, text }) => ({ role, text })) }),
      });
      if (!response.ok) throw Error(response.status === 429 ? 'limited' : 'unavailable');
      const text = await response.text();
      if (text.length > 12_000) throw Error();
      const reply = replySchema.parse(JSON.parse(text));
      if (reply.references.some(reference => !knownPaths.has(reference.path))) throw Error();
      if (currentSequence !== sequence.current) return;
      setMessages(previous => [...previous, { role: 'user', text: question }, { role: 'assistant', text: reply.answer, reply }].slice(-6) as Message[]);
      setMessage('');
      setNotice(reply.generated ? 'Explicação recebida. Confira as referências da aula.' : 'Orientação do portal, sem geração por IA.');
      requestAnimationFrame(() => resultHeading.current?.focus());
    } catch (error) {
      if (currentSequence !== sequence.current) return;
      setNotice(error instanceof Error && error.message === 'limited'
        ? 'O limite de perguntas foi atingido ou o assistente está ocupado. Tente mais tarde; o resumo e os exercícios continuam disponíveis.'
        : 'Não foi possível obter uma resposta da IA. Sua pergunta foi mantida para você tentar depois. Continue pelo resumo e pelas referências da aula.');
    } finally { if (currentSequence === sequence.current) setBusy(false); }
  }
  return <section className="tutor" aria-label="Assistente da aula">
    <details onToggle={event => { if (event.currentTarget.open && available === null && !checking) void check(); }}>
      <summary>Conversar com o assistente da aula (opcional)</summary>
      <p>Um tutor de IA pode explicar o conteúdo ou oferecer uma pista. Ele pode errar e não verifica notícias atuais, contas ou mensagens reais.</p>
      {checking && <p role="status">Consultando a disponibilidade…</p>}
      {available === false && <div className="notice">
        <p>O assistente de IA está indisponível. Todas as aulas, explicações e atividades continuam funcionando.</p>
        <button className="secondary" onClick={() => void check()} disabled={checking}>Verificar novamente</button>
      </div>}
      {available && <>
        <p id={`tutor-privacy-${lessonId}`}>Ao enviar, sua pergunta, até quatro mensagens anteriores e trechos da aula serão enviados à OpenAI. Não inclua nomes, senhas, códigos ou dados de contas. O portal não salva a conversa no servidor; o provedor pode manter registros conforme sua política. <Link to="/privacidade">Entenda a privacidade.</Link></p>
        <label className="tutor-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} /> Entendi o envio à OpenAI e quero usar o assistente.</label>
        <form onSubmit={submit}>
          <label className="field" htmlFor={`tutor-question-${lessonId}`}>{hint ? 'Qual parte do desafio você quer entender?' : 'Qual é sua dúvida sobre a aula?'}</label>
          <textarea ref={field} id={`tutor-question-${lessonId}`} aria-describedby={`tutor-privacy-${lessonId}`} value={message} onChange={event => setMessage(event.target.value)} maxLength={1000} rows={3} disabled={busy} />
          <p className="fine">{message.length}/1000 caracteres. {hint ? 'No desafio, o assistente oferece pistas.' : 'Use suas palavras e evite informações pessoais.'}</p>
          <button type="submit" disabled={!consent || busy || message.trim().length < 3}>{busy ? 'Aguardando…' : 'Enviar pergunta'}</button>
          {busy && <button type="button" className="secondary" onClick={cancel}>Cancelar espera</button>}
        </form>
      </>}
      <p role="status" aria-live="polite">{notice}</p>
      {messages.length > 0 && <div className="tutor-conversation">
        <h3 ref={resultHeading} tabIndex={-1}>Sua conversa nesta aula</h3>
        {messages.map((item, index) => <article key={index}>
          <h4>{item.role === 'user' ? 'Você' : item.reply?.generated ? 'Assistente de IA — confira a explicação' : 'Orientação do portal'}</h4>
          <p className="tutor-answer">{item.text}</p>
          {!!item.reply?.references.length && <ul>{item.reply.references.map(reference => <li key={reference.id}>
            <Link to={reference.path}>{reference.title}</Link><blockquote>{reference.quote}</blockquote>
          </li>)}</ul>}
        </article>)}
        <button className="secondary" onClick={() => { cancel(); setMessages([]); setMessage(''); setNotice('Conversa apagada desta página. Isso não exclui registros já enviados ao provedor.'); }}>Limpar conversa</button>
      </div>}
    </details>
  </section>;
}
