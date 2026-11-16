import { Link, useParams } from 'react-router-dom';
import { courses, sources } from '../../../packages/content';
import { incidentCases } from '../../../packages/content/incidents';

function ConsultationSources({ ids }: { ids: string[] }) {
  return <section className="consultation-sources"><h2>Onde conferir</h2><ul>
    {sources.filter(source => ids.includes(source.id)).map(source => <li key={source.id}>
      <a href={source.url} rel="noreferrer">{source.title} (site externo)</a>
      <span className="print-url">{source.url}</span>
    </li>)}
  </ul></section>;
}

export function QuickHelp() {
  return <article className="consultation">
    <p className="eyebrow">Consulta rápida · Clareza Digital</p>
    <h1>Recebeu um pedido suspeito ou já interagiu?</h1>
    <div className="callout"><h2>Interrompa o contato e confira por outro caminho</h2>
      <p>Não envie novos dados ou pagamentos para tentar resolver a situação com quem fez a abordagem. Procure o serviço pelo aplicativo ou contato que você já conhecia.</p>
    </div>
    <p>Use os cuidados abaixo conforme o que aconteceu. Não é necessário contar seu caso aqui. Este material é educativo; não oferece atendimento nem analisa sua conta.</p>
    <nav className="help-index" aria-label="Situações para consulta"><ul>{incidentCases.map((item, index) => <li key={item.label}><a href={`#situacao-${index}`}>{item.label}</a></li>)}</ul></nav>
    {incidentCases.map((item, index) => <section className="help-case" key={item.label} id={`situacao-${index}`}>
      <h2>{item.label}</h2><p>{item.text}</p>
    </section>)}
    <section className="help-case"><h2>Guarde o que ajuda a explicar o ocorrido</h2>
      <p>Preserve mensagens, comprovantes, datas e protocolos de atendimento. Não publique esses dados em redes sociais. Se houver fraude ou uso indevido dos seus dados, registre a ocorrência pelos canais oficiais.</p>
      <p>Não pague uma nova taxa a alguém que promete recuperar o dinheiro. A devolução não é garantida.</p>
    </section>
    <div className="actions"><button onClick={() => window.print()}>Imprimir consulta rápida</button><Link className="button secondary" to="/cursos/seguranca/aulas/ja-interagi">Estudar a aula Já interagi</Link></div>
    <ConsultationSources ids={['incidente', 'bcb']} />
    <p className="fine">Conteúdo de consulta revisado em 15/11/2026. Se não conseguir confirmar, interrompa e procure um canal conhecido.</p>
  </article>;
}

export function LessonConsultation() {
  const { courseId, lessonId } = useParams();
  const course = courses.find(item => item.id === courseId);
  const lesson = course?.lessons.find(item => item.id === lessonId);
  if (!lesson || !course) return <><h1>Material não encontrado</h1><Link to="/cursos">Ver cursos</Link></>;
  return <article className="consultation">
    <p className="eyebrow">Clareza Digital · Material de consulta</p>
    <h1>{lesson.title}</h1>
    <p>{course.title}</p>
    <p>{lesson.objective}</p>
    <h2>Para lembrar no dia a dia</h2>
    <ul className="consultation-checklist">{lesson.summary.map(text => <li key={text}>{text}</li>)}</ul>
    {lesson.id === 'ja-interagi' && <section><h2>Primeiros cuidados por situação</h2>{incidentCases.map(item => <div className="help-case" key={item.label}><h3>{item.label}</h3><p>{item.text}</p></div>)}</section>}
    <p>Este resumo não garante a identificação de golpes ou de conteúdo feito com IA. Na dúvida, procure confirmação independente.</p>
    <div className="actions"><button onClick={() => window.print()}>Imprimir este material</button><Link className="button secondary" to={`/cursos/${course.id}/aulas/${lesson.id}`}>Voltar à aula</Link></div>
    <ConsultationSources ids={lesson.sourceIds} />
    <p className="fine">Material baseado nas aulas e fontes revisadas em 14/11/2026. Os exemplos do curso são fictícios. Nenhum dado pessoal é necessário para estudar.</p>
  </article>;
}
