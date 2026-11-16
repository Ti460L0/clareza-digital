import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import {
  courses,
  sources,
  type Lesson,
  type Question,
} from "../../../packages/content";
import {
  emptyProgress,
  readProgress,
  writeProgress,
  type Progress,
} from "./progress";
import "./style.css";
import { Media, lessonMedia } from "./Media";
import { Tutor } from "./Tutor";
import { assistantEnabled } from './features';
import { lessonRevision } from '../../../packages/content/versions';
import { LessonConsultation, QuickHelp } from './Consultation';
import { pageTitle } from './page-title';
import { AccessGuide, ResearchPractice } from "./AiPractice";
import { Simulation, AddressPractice } from "./Simulations";

function useProgress() {
  const [initial] = useState(() => {
    try {
      return readProgress(localStorage);
    } catch {
      return {
        data: emptyProgress(),
        warning:
          "O navegador bloqueou o armazenamento. O estudo continua nesta sessão.",
      };
    }
  });
  const [data, setData] = useState(initial.data);
  const [warning, setWarning] = useState(initial.warning);
  function save(next: Progress) {
    setData(next);
    if (initial.warning) return;
    try {
      if (!writeProgress(localStorage, next))
        setWarning(
          "Não foi possível salvar. Seu progresso fica apenas nesta sessão.",
        );
    } catch {
      setWarning("Seu progresso fica apenas nesta sessão.");
    }
  }
  return { data, save, warning };
}
type Store = ReturnType<typeof useProgress>;
function App() {
  const store = useProgress();
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  const [offline, setOffline] = useState(!navigator.onLine);
  useEffect(() => {
    document.title = pageTitle(pathname);
    main.current?.focus();
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    addEventListener("online", update);
    addEventListener("offline", update);
    return () => {
      removeEventListener("online", update);
      removeEventListener("offline", update);
    };
  }, []);
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header>
        <Link className="brand" to="/" title="Clareza Digital — início">
          <span className="brandmark" aria-hidden="true">
            c.
          </span>
          clareza <span>digital</span>
        </Link>
        <nav aria-label="Principal">
          <NavLink to="/cursos">Cursos</NavLink>
          <NavLink to="/praticar">Praticar</NavLink>
          <NavLink to="/preciso-de-ajuda">Preciso de ajuda</NavLink>
        </nav>
      </header>
      {offline && (
        <p className="notice" role="status">
          Você está sem conexão. O conteúdo já carregado continua disponível;
          links externos precisam de internet.
        </p>
      )}
      {store.warning && (
        <p className="notice" role="status">
          {store.warning}
        </p>
      )}
      <main id="conteudo" ref={main} tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home store={store} />} />
          <Route path="/cursos" element={<Catalog />} />
          <Route path="/cursos/:courseId" element={<Course store={store} />} />
          <Route path="/cursos/:courseId/aulas/:lessonId/consulta" element={<LessonConsultation />} />
          <Route
            path="/cursos/:courseId/aulas/:lessonId"
            element={<LessonRoute store={store} />}
          />
          <Route
            path="/praticar"
            element={
              <>
                <p className="eyebrow">Aprender fazendo</p>
                <h1>Um lugar seguro para experimentar</h1>
                <p>
                  Aqui, as mensagens e empresas são fictícias. Nada é enviado e
                  nenhum dado real é pedido.
                </p>
                <Simulation kind="sms" />
                <AddressPractice />
              </>
            }
          />
          <Route path="/fontes" element={<Sources />} />
          <Route
            path="/privacidade"
            element={
              <>
                <h1>Privacidade e seu progresso</h1>
                <p>
                  Você não precisa criar conta. As respostas dos exercícios e o
                  ponto em que parou ficam neste navegador, quando ele permite
                  salvar. Não há sincronização entre aparelhos. Limpar os dados
                  do navegador apaga o progresso.
                </p>
                <p>
                  Não usamos rastreadores publicitários nem enviamos os
                  resultados dos exercícios ao servidor. A infraestrutura de
                  hospedagem pode processar dados técnicos de conexão.
                </p>
                {assistantEnabled ? <><h2>Quando você escolhe usar o assistente</h2>
                <p>O envio é opcional e depende da disponibilidade da IA. Sua pergunta, até quatro mensagens anteriores e trechos da aula são enviados à OpenAI. Não inclua dados pessoais, senhas ou códigos. O assistente não pesquisa a internet e pode errar.</p>
                <p>A conversa fica apenas na memória desta página e não é salva pelo portal no servidor. “Limpar conversa”, sair da aula ou recarregar remove essa cópia; isso não apaga registros já enviados ao provedor. A API é solicitada sem armazenamento de estado, mas a OpenAI pode reter registros de monitoramento de abuso, normalmente por até 30 dias e por mais tempo em situações previstas em sua política. <a href="https://developers.openai.com/api/docs/guides/your-data" target="_blank" rel="noreferrer">Leia a política do provedor (abre outra aba).</a></p>
                <p>Para limitar abuso e custos, o servidor mantém horários, reservas de consumo e um identificador derivado do IP, com troca diária. O IP não é gravado nesse banco; esse identificador não garante anonimato. Esses registros são removidos após 35 dias quando há nova atividade. Logs da infraestrutura podem ter retenção própria, que será revisada antes da publicação.</p>
                </> : <p>Esta versão não oferece assistente generativo. A prática de conversa usa respostas previamente escritas, fica nesta página e não envia mensagens a um provedor de IA.</p>}
                <p>
                  Para apagar o progresso, abra o curso e escolha “Reiniciar
                  curso”.
                </p>
              </>
            }
          />
          <Route
            path="/sobre"
            element={
              <>
                <h1>Conhecimento para decidir com calma</h1>
                <p>
                  Clareza Digital é um projeto de educação sobre segurança
                  digital e uso crítico de inteligência artificial. Você aprende
                  no seu ritmo, sem cadastro e sem certificado.
                </p>
                <p>
                  O material ensina cuidados e formas de conferir informações.
                  Não garante a identificação de golpes ou de conteúdo produzido
                  por IA.
                </p>
                <p>
                  Projeto pessoal acadêmico. Não há atendimento humano nem
                  coleta de depoimentos.
                </p>
              </>
            }
          />
          <Route path="/preciso-de-ajuda" element={<QuickHelp />} />
          <Route
            path="*"
            element={
              <>
                <h1>Página não encontrada</h1>
                <p>
                  O endereço pode ter mudado. Seu progresso permanece neste
                  navegador.
                </p>
                <Link to="/cursos">Voltar aos cursos</Link>
              </>
            }
          />
        </Routes>
      </main>
      <footer>
        <div>
          <strong>clareza digital</strong>
          <p>Mais autonomia. Uma decisão de cada vez.</p>
        </div>
        <nav aria-label="Informações">
          <Link to="/fontes">Fontes</Link>
          <Link to="/privacidade">Privacidade</Link>
          <Link to="/sobre">Sobre o projeto</Link>
        </nav>
        <small>Sem cadastro · No seu ritmo · Projeto educativo</small>
      </footer>
    </>
  );
}
function Home({ store }: { store: Store }) {
  const resumable = Object.entries(store.data.lessons).filter(([id, state]) => !state.completed && courses.some(course => course.lessons.some(lesson => lesson.id === id)));
  const resume = resumable.find(([id]) => id === store.data.lastLessonId) ?? resumable[0];
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Aprender para viver o digital</p>
          <h1>
            Mais clareza.
            <br />
            <em>Menos incerteza.</em>
          </h1>
          <p className="lead">
            Mensagens, links, inteligência artificial. Aprenda a fazer escolhas
            com mais segurança, no seu tempo.
          </p>
          <div className="actions">
            <Link className="button" to="/cursos">
              Conhecer os cursos <span aria-hidden="true">↗</span>
            </Link>
            <Link to="/praticar">Experimentar uma simulação</Link>
          </div>
          <p className="fine">
            Gratuito · Sem cadastro · Feito para aprender com calma
          </p>
        </div>
        <div className="hero-card">
          <span className="eyebrow">Seu próximo passo</span>
          <div className="steps-art" aria-hidden="true">
            <span>
              01
              <br />
              Pause
            </span>
            <span>
              02
              <br />
              Confira
            </span>
            <span>
              03
              <br />
              Decida
            </span>
          </div>
          <h2>
            Você não precisa saber tudo.
            <br />
            Pode começar por uma pergunta.
          </h2>
          <p>“Como posso conferir isso por outro caminho?”</p>
        </div>
      </section>
      {resume && (
        <aside className="resume">
          <p>Seu estudo está salvo neste navegador.</p>
          <Link
            to={`/cursos/${courses.find((c) => c.lessons.some((l) => l.id === resume[0]))?.id ?? "seguranca"}/aulas/${resume[0]}`}
          >
            Continuar de onde parei
          </Link>
        </aside>
      )}
      <Catalog compact />
      <section className="callout">
        <h2>Aprender aqui é poder tentar de novo.</h2>
        <p>
          Exemplos do dia a dia, explicações sem pressa e prática sem colocar
          seus dados em risco. Sem nota mínima ou cronômetro.
        </p>
      </section>
    </>
  );
}
function Catalog({ compact = false }: { compact?: boolean }) {
  return (
    <section>
      <p className="eyebrow">Caminhos de aprendizagem</p>
      {compact ? (
        <h2>
          O digital faz parte da vida.
          <br />
          Entender também pode fazer.
        </h2>
      ) : (
        <h1>Escolha por onde começar</h1>
      )}
      <div className="grid">
        {courses.map((c, i) => (
          <article className="course-card" key={c.id}>
            <span className="number">0{i + 1}</span>
            <p className="tag">
              {c.lessons.length
                ? `${c.lessons.length} de ${c.planned} aulas disponíveis`
                : "Em preparação"}
            </p>
            <h3>{c.title}</h3>
            <p>{c.description}</p>
            {c.lessons.length ? (
              <Link className="button secondary" to={`/cursos/${c.id}`}>
                Explorar o curso <span aria-hidden="true">→</span>
              </Link>
            ) : (
              <p className="fine">
                Este curso aparecerá aqui quando houver aulas revisadas. Nenhuma
                atividade vazia é necessária para seu progresso.
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
function Course({ store }: { store: Store }) {
  const { courseId } = useParams();
  const c = courses.find((c) => c.id === courseId);
  const [reset, setReset] = useState(false);
  if (!c) return <h1>Curso não encontrado</h1>;
  return (
    <>
      <Link to="/cursos">← Todos os cursos</Link>
      <p className="eyebrow">Seu caminho de aprendizagem</p>
      <h1>{c.title}</h1>
      <p>{c.description}</p>
      <p>
        {c.lessons.length} de {c.planned} aulas disponíveis.{" "}
        {c.lessons.length < c.planned
          ? "As demais estão em preparação."
          : "Todas as aulas deste curso estão disponíveis para estudo."}
      </p>
      <ol className="lesson-list">
        {c.lessons.map((l) => (
          <li key={l.id}>
            <Link to={`/cursos/${c.id}/aulas/${l.id}`}>{l.title}</Link>
            <span>
              {store.data.lessons[l.id]?.reviewRequired
                ? "Conteúdo atualizado: revisar"
                : store.data.lessons[l.id]?.completed
                ? "Concluída"
                : store.data.lessons[l.id]
                  ? "Em andamento"
                  : "Pode começar aqui"}
            </span>
          </li>
        ))}
      </ol>
      {!reset ? (
        <button className="text-button" onClick={() => setReset(true)}>
          Reiniciar curso
        </button>
      ) : (
        <div className="callout">
          <p>Apagar o progresso e as tentativas deste curso neste navegador?</p>
          <button
            onClick={() => {
              const lessons = { ...store.data.lessons };
              const archive = { ...store.data.archive };
              c.lessons.forEach((l) => delete lessons[l.id]);
              c.lessons.forEach((l) => delete archive[l.id]);
              store.save({ ...store.data, lessons, archive });
              setReset(false);
            }}
          >
            Sim, reiniciar curso
          </button>
          <button className="secondary" onClick={() => setReset(false)}>
            Manter progresso
          </button>
        </div>
      )}
    </>
  );
}
function LessonRoute({ store }: { store: Store }) {
  const { courseId, lessonId } = useParams();
  const lesson = courses
    .find((c) => c.id === courseId)
    ?.lessons.find((l) => l.id === lessonId);
  return lesson ? (
    <LessonView
      key={lesson.id}
      lesson={lesson}
      store={store}
      courseId={courseId!}
    />
  ) : (
    <>
      <h1>Aula não encontrada</h1>
      <Link to="/cursos">Ver aulas disponíveis</Link>
    </>
  );
}
function LessonView({
  lesson,
  store,
  courseId,
}: {
  lesson: Lesson;
  store: Store;
  courseId: string;
}) {
  const saved = store.data.lessons[lesson.id];
  const [step, setStep] = useState(
    Math.min(saved?.step ?? 0, lesson.slides.length + 2),
  );
  const [continuous, setContinuous] = useState(false);
  const [reset, setReset] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const [resetGeneration, setResetGeneration] = useState(0);
  const total = lesson.slides.length + 3;
  // LessonView is keyed by lesson ID: opening an existing lesson updates the resume target once.
  useEffect(() => { persist(step); }, []);
  function persist(next = step, completed = saved?.completed ?? false) {
    store.save({
      ...store.data,
      lastLessonId: lesson.id,
      lessons: {
        ...store.data.lessons,
        [lesson.id]: { step: next, completed, attempts: saved?.attempts ?? {}, contentVersion: lessonRevision(lesson.id), reviewRequired: completed ? false : saved?.reviewRequired ?? false },
      },
    });
  }
  function move(next: number) {
    setStep(next);
    persist(next);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function record(q: string, answer: string) {
    const attempts = { ...saved?.attempts };
    const old = attempts[q];
    attempts[q] = {
      first: old?.first ?? answer,
      last: answer,
      count: (old?.count ?? 0) + 1,
    };
    store.save({
      ...store.data,
      lastLessonId: lesson.id,
      lessons: {
        ...store.data.lessons,
        [lesson.id]: { step, completed: saved?.completed ?? false, attempts, contentVersion: lessonRevision(lesson.id), reviewRequired: saved?.reviewRequired ?? false },
      },
    });
  }
  return (
    <>
      <Link to={`/cursos/${courseId}`}>← Índice do curso</Link>
      <div className="lesson-heading">
        <div>
          <p className="eyebrow">Aprenda e pratique</p>
          <h1>{lesson.title}</h1>
          <p>{lesson.objective}</p>
        </div>
        <button
          className="secondary"
          aria-pressed={continuous}
          onClick={() => setContinuous(!continuous)}
        >
          {continuous ? "Ver em slides" : "Ler tudo em sequência"}
        </button>
      </div>
      {saved?.reviewRequired && <p className="notice" role="status">Esta aula recebeu uma atualização de conteúdo. Seu histórico anterior foi preservado abaixo. Revise a versão atual no seu ritmo.</p>}
      {!!store.data.archive[lesson.id]?.length && <details><summary>Ver progresso de versões anteriores</summary><ul>{store.data.archive[lesson.id].map((state, index) => <li key={index}>Versão {state.contentVersion}: {state.completed ? 'concluída' : 'em andamento'}, {Object.keys(state.attempts).length} questões com tentativas registradas.</li>)}</ul></details>}
      {lessonMedia[lesson.id] && <Media key={`${lesson.id}-${resetGeneration}`} id={lessonMedia[lesson.id]} />}
      <div className="lesson-layout" id="pratica-da-aula" key={resetGeneration}>
        <nav className="lesson-nav" aria-label="Etapas da aula">
          {[
            ...lesson.slides.map((s) => s.title),
            "Experimentar",
            "Praticar decisões",
            "Para levar com você",
          ].map((title, i) => (
            <button
              key={title}
              className={step === i ? "selected" : ""}
              aria-current={step === i ? "step" : undefined}
              onClick={() => move(i)}
            >
              <span>{i + 1}.</span> {title}
            </button>
          ))}
        </nav>
        <div className="lesson-body">
          <p className="eyebrow">
            Etapa {step + 1} de {total}
          </p>
          <progress aria-label="Posição na aula" value={step + 1} max={total} />
          {continuous ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Leitura completa
              </h2>
              {lesson.slides.map((s) => (
                <section key={s.id} className="lesson-topic">
                  <h3>{s.title}</h3>
                  {s.paragraphs.map((p, index) => (
                    <div className={`teaching-block ${index === 0 ? 'teaching-focus' : 'teaching-detail'}`} key={p}><span className="teaching-label">{index === 0 ? 'Em foco' : 'Entenda melhor'}</span><p>{p}</p></div>
                  ))}
                </section>
              ))}
              <Simulation kind={lesson.simulation ?? "incident"} />
              {lesson.id === 'conversar-com-ia' && <ResearchPractice />}
              <Quiz questions={lesson.questions} onAnswer={record} />
              <AccessGuide lessonId={lesson.id} />
              <Summary lesson={lesson} />
            </>
          ) : step < lesson.slides.length ? (
            <article className="lesson-topic">
              <h2 ref={heading} tabIndex={-1}>
                {lesson.slides[step].title}
              </h2>
              {lesson.slides[step].paragraphs.map((p, index) => (
                <div className={`teaching-block ${index === 0 ? 'teaching-focus' : 'teaching-detail'}`} key={p}><span className="teaching-label">{index === 0 ? 'Em foco' : 'Entenda melhor'}</span><p>{p}</p></div>
              ))}
            </article>
          ) : step === lesson.slides.length ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Experimente com segurança
              </h2>
              <Simulation kind={lesson.simulation ?? "incident"} />
              {lesson.id === 'conversar-com-ia' && <ResearchPractice />}
            </>
          ) : step === lesson.slides.length + 1 ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Pratique suas decisões
              </h2>
              <Quiz questions={lesson.questions} onAnswer={record} />
            </>
          ) : (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Para levar com você
              </h2>
              <AccessGuide lessonId={lesson.id} />
              <Summary lesson={lesson} />
            </>
          )}
          {assistantEnabled && <Tutor lessonId={lesson.id} hint={continuous || step === lesson.slides.length + 1} />}
          {saved?.completed && (
            <p className="success" role="status">
              Aula concluída. Você pode revisar e praticar quantas vezes quiser.
            </p>
          )}
          <div className="actions pagination">
            <button
              className="secondary"
              disabled={step === 0}
              onClick={() => move(step - 1)}
            >
              ← Anterior
            </button>
            {step < total - 1 && !continuous ? (
              <button onClick={() => move(step + 1)}>Continuar →</button>
            ) : (
              <button onClick={() => persist(step, true)}>Concluir aula</button>
            )}
          </div>
          <button className="text-button" onClick={() => setReset(true)}>
            Reiniciar esta aula
          </button>
          {reset && (
            <div className="callout">
              <p>Apagar as tentativas e começar esta aula novamente?</p>
              <button
                onClick={() => {
                  store.save({
                    ...store.data,
                    archive: Object.fromEntries(Object.entries(store.data.archive).filter(([id]) => id !== lesson.id)),
                    lessons: {
                      ...store.data.lessons,
                      [lesson.id]: { step: 0, completed: false, attempts: {}, contentVersion: lessonRevision(lesson.id), reviewRequired: false },
                    },
                  });
                  setStep(0);
                  setContinuous(false);
                  setResetGeneration(value => value + 1);
                  setReset(false);
                  requestAnimationFrame(() => heading.current?.focus());
                }}
              >
                Sim, reiniciar aula
              </button>
              <button className="secondary" onClick={() => setReset(false)}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
function Summary({ lesson }: { lesson: Lesson }) {
  const course = courses.find(item => item.lessons.some(item => item.id === lesson.id))!;
  return (
    <>
      <ul className="lesson-takeaways">
        {lesson.summary.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      <Link className="button secondary" to={`/cursos/${course.id}/aulas/${lesson.id}/consulta`}>
        Abrir material de consulta para imprimir
      </Link>
      <h3>Fontes desta aula</h3>
      {sources
        .filter((s) => lesson.sourceIds.includes(s.id))
        .map((s) => (
          <p key={s.id}>
            <a href={s.url} rel="noreferrer">
              {s.title} (site externo)
            </a>
            <br />
            <small>Revisão: 14/11/2026.</small>
          </p>
        ))}
    </>
  );
}
function Quiz({
  questions,
  onAnswer,
}: {
  questions: Question[];
  onAnswer: (id: string, answer: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const legend = useRef<HTMLLegendElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const q = questions[index];
  return (
    <section className="quiz" aria-label="Exercícios">
      <p>
        Questão {index + 1} de {questions.length} · Sem limite de tentativas
      </p>
      <fieldset>
        <legend ref={legend} tabIndex={-1}>{q.prompt}</legend>
        {q.options.map((o) => (
          <label key={o.id} className={`option ${confirmed ? o.correct ? 'option-correct' : answer === o.id ? 'option-incorrect' : '' : ''}`}>
            <input
              type="radio"
              name={q.id}
              value={o.id}
              checked={answer === o.id}
              disabled={confirmed}
              onChange={() => setAnswer(o.id)}
            />
            <span>{o.text}</span>
          </label>
        ))}
      </fieldset>
      <button
        disabled={!answer || confirmed}
        onClick={() => {
          setConfirmed(true);
          onAnswer(q.id, answer);
          requestAnimationFrame(() => feedback.current?.focus());
        }}
      >
        Conferir resposta
      </button>
      {confirmed && (
        <div className={`feedback ${q.options.find(o => o.id === answer)?.correct ? 'feedback-correct' : 'feedback-incorrect'}`} ref={feedback} tabIndex={-1}>
          <p role="status">
            <strong>
              {q.options.find((o) => o.id === answer)?.correct
                ? "✓ Você acertou. Essa escolha ajuda a conferir com segurança."
                : "! Essa escolha merece cuidado. Vamos entender por quê."}
            </strong>
          </p>
          {q.options.map((o) => (
            <p key={o.id} className={`answer-explanation ${o.correct ? 'answer-correct' : 'answer-caution'}`}>
              <strong>
                <span className="answer-label">{o.correct ? '✓ Escolha recomendada' : '! Por que evitar'}{answer === o.id ? ' · Sua resposta' : ''}</span>
                {o.text}
              </strong>
              <br />
              {o.explanation}
            </p>
          ))}
          <div className="actions">
            <button
              className="secondary"
              onClick={() => {
                setAnswer("");
                setConfirmed(false);
                requestAnimationFrame(() => legend.current?.focus());
              }}
            >
              Tentar novamente
            </button>
            {index < questions.length - 1 ? (
              <button
                onClick={() => {
                  setIndex(index + 1);
                  setAnswer("");
                  setConfirmed(false);
                  requestAnimationFrame(() => legend.current?.focus());
                }}
              >
                Próxima questão
              </button>
            ) : (
              <p>Prática finalizada. Continue para o resumo da aula.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
function Sources() {
  return (
    <>
      <h1>Fontes e revisão</h1>
      <p>
        As fontes ajudam a conferir o conteúdo. Links abaixo levam a sites
        externos.
      </p>
      {sources.map((s) => (
        <article key={s.id}>
          <h2>
            <a href={s.url} rel="noreferrer">
              {s.title}
            </a>
          </h2>
          <p>{s.supports}</p>
          <p>Consultada em 14/11/2026.</p>
        </article>
      ))}
    </>
  );
}
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
