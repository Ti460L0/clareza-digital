import { useState } from "react";
export function ResearchPractice() {
  const [topic, setTopic] = useState('Como economizar água em casa');
  const [built, setBuilt] = useState(false);
  return <section className="simulation research-practice" aria-label="Montar uma pergunta de pesquisa">
    <p className="simulation-label">Oficina de prompt · Sem envio a uma IA</p>
    <h3>Transforme um assunto em uma boa pergunta</h3>
    <p>Prompt é o pedido que você escreve para a IA. Compare um pedido vago com outro que explica o que você precisa.</p>
    <label className="field" htmlFor="research-topic">Escolha um assunto de exemplo</label>
    <select id="research-topic" value={topic} onChange={event => { setTopic(event.target.value); setBuilt(false); }}>
      <option>Como economizar água em casa</option><option>Como funciona a energia solar</option><option>Como identificar fontes de uma notícia</option>
    </select>
    <div className="teaching-block teaching-focus"><span className="teaching-label">Pedido vago</span><p>“Pesquise sobre {topic.toLowerCase()}.”</p><p>Falta dizer o objetivo, o nível de detalhe e como conferir a informação.</p></div>
    <button onClick={() => setBuilt(true)}>Montar um pedido mais completo</button>
    {built && <div className="research-result" role="status">
      <h4>Pedido para experimentar no serviço oficial</h4>
      <blockquote>Quero aprender sobre {topic.toLowerCase()}. Sou iniciante. Explique em linguagem simples, em cinco tópicos, com um exemplo do dia a dia. Separe fatos de sugestões. Se você puder pesquisar na web, procure fontes primárias, informe links e datas e diga o que cada fonte sustenta. Se não puder pesquisar, avise e sugira termos para eu buscar. Não invente referências e indique o que precisa ser confirmado.</blockquote>
      <ol><li><strong>Assunto e objetivo:</strong> o que você quer aprender.</li><li><strong>Contexto:</strong> você está começando e precisa de linguagem simples.</li><li><strong>Formato:</strong> cinco tópicos e um exemplo.</li><li><strong>Verificação:</strong> fontes, datas e limites da resposta.</li></ol>
      <p><strong>Depois da resposta:</strong> abra os links, confira quem publicou, a data e se a fonte realmente apoia a afirmação. Um prompt melhor ajuda a orientar a resposta, mas não garante que ela esteja correta.</p>
      <p>Nenhuma pesquisa foi realizada aqui. Este texto é um exemplo previamente escrito; você pode adaptá-lo sem incluir dados pessoais.</p>
    </div>}
  </section>;
}
export function AiPractice() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");
  const send = () => {
    if (!prompt.trim()) return;
    setReply(
      /etapas|fatores/i.test(prompt)
        ? "Resposta previamente escrita: a verificação em duas etapas acrescenta uma segunda verificação à senha, como uma confirmação no aplicativo autenticador. Ela ajuda a proteger a conta, mas não elimina todos os riscos. Nunca repasse códigos a quem entrou em contato pedindo isso."
        : /simples|exemplo|senha/i.test(prompt)
        ? "Resposta previamente escrita: uma senha deve ser difícil de adivinhar e diferente em cada serviço. Não envie sua senha aqui. Para aprender mais, peça uma explicação sobre verificação em duas etapas."
        : "Este simulador não gera respostas livres. Ele ensina o ciclo de escrever, enviar, ler e reformular. Experimente o exemplo sugerido; nenhuma mensagem foi enviada a um serviço de IA.",
    );
  };
  return (
    <section className="simulation">
      <p className="simulation-label">
        Simulador educativo · Respostas previamente escritas, sem IA real
      </p>
      <h3>Experimente uma conversa sem conta</h3>
      <p>
        Seu texto fica nesta página e é apagado ao sair. Use apenas situações
        fictícias, sem senhas ou dados pessoais.
      </p>
      <button
        className="secondary"
        onClick={() =>
          setPrompt("Explique verificação em duas etapas em linguagem simples.")
        }
      >
        Usar uma pergunta de exemplo
      </button>
      <label className="field" htmlFor="practice-prompt">
        Pergunta de prática (até 300 caracteres)
      </label>
      <textarea
        id="practice-prompt"
        maxLength={300}
        rows={3}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="actions">
        <button disabled={!prompt.trim()} onClick={send}>
          Enviar no simulador
        </button>
        <button
          className="secondary"
          onClick={() => {
            setPrompt("");
            setReply("");
          }}
        >
          Limpar conversa simulada
        </button>
      </div>
      <div role="status">{reply && <p>{reply}</p>}</div>
      {reply && (
        <button
          className="secondary"
          onClick={() => {
            setPrompt("Explique com um exemplo do dia a dia.");
            setReply(
              "Resposta previamente escrita: pense em duas barreiras para entrar. A senha é uma barreira; a segunda etapa acrescenta outra verificação. A comparação ajuda a entender, mas não garante proteção absoluta. Nunca repasse um código a quem entrou em contato pedindo isso.",
            );
          }}
        >
          Pedir um exemplo mais simples
        </button>
      )}
    </section>
  );
}
export function NewsPractice() {
  const [source, setSource] = useState(false);
  const [verdict, setVerdict] = useState("");
  return (
    <section className="simulation">
      <p className="simulation-label">
        Simulação educativa · Lugar, notícia e fonte inventados
      </p>
      <h3>O que a evidência permite dizer?</h3>
      <div className="news-illustration">
        <svg
          role="img"
          aria-label="Ilustração fictícia de um parque, sem valor de registro fotográfico"
          viewBox="0 0 400 140"
        >
          <rect width="400" height="140" fill="#e0ead6" />
          <path d="M0 105 Q120 40 220 95 T400 90 V140 H0" fill="#7d9d67" />
          <circle cx="320" cy="35" r="18" fill="#f8e8a1" />
          <path
            d="M80 105 V45 M65 70 Q40 35 80 20 Q120 35 95 70"
            stroke="#295745"
            strokeWidth="9"
            fill="#adc495"
          />
          <text x="170" y="125" fontSize="16" fill="#173c30">
            ILUSTRAÇÃO FICTÍCIA
          </text>
        </svg>
        <p>
          <strong>Mensagem inventada:</strong> “O Parque das Nuvens vai fechar
          amanhã para sempre!”
        </p>
        <p>
          <strong>Áudio ilustrado em texto:</strong> “Ouvi de um conhecido.
          Espalhe antes que apaguem.”
        </p>
        <p>
          <strong>Vídeo ilustrado:</strong> um recorte mostra o portão fechado,
          sem data e sem o contexto completo. Isso não comprova a afirmação.
        </p>
      </div>
      <button
        className="secondary"
        aria-expanded={source}
        onClick={() => setSource(!source)}
      >
        Abrir a fonte simulada
      </button>
      {source && (
        <article className="callout">
          <h4>Comunicado fictício do Parque das Nuvens</h4>
          <p>
            Publicado há três anos: “Fecharemos somente na próxima terça-feira
            para manutenção. Reabriremos na quarta-feira.”
          </p>
          <p>
            A fonte deste exercício não afirma fechamento permanente nem informa
            a situação atual. Ela é um texto inventado, não um site externo.
          </p>
        </article>
      )}
      <p>Qual conclusão é adequada sobre a mensagem recebida?</p>
      <div className="actions">
        <button
          className="secondary"
          onClick={() =>
            setVerdict(
              "A imagem e o tom urgente não confirmam a notícia. Abra a fonte e compare data e alcance da afirmação.",
            )
          }
        >
          Confirmada pela imagem
        </button>
        <button
          className="secondary"
          onClick={() =>
            setVerdict(
              source
                ? "Neste exercício, a mensagem é enganosa: transformou um fechamento temporário antigo em uma afirmação atual e permanente. A situação atual ainda precisaria de uma fonte recente."
                : "Antes de concluir, abra a fonte simulada e compare o que ela diz com a mensagem.",
            )
          }
        >
          Enganosa pelo contexto
        </button>
        <button
          className="secondary"
          onClick={() =>
            setVerdict(
              "Sem conferir a fonte, não há base para afirmar o fechamento. Neste exercício, abrir o comunicado permite identificar a distorção; sobre a situação real atual, faltaria informação.",
            )
          }
        >
          Ainda não verificada
        </button>
      </div>
      <p role="status">{verdict}</p>
      <button
        className="text-button"
        onClick={() => {
          setSource(false);
          setVerdict("");
        }}
      >
        Repetir investigação
      </button>
    </section>
  );
}
export function AccessGuide({ lessonId }: { lessonId: string }) {
  if (!["ia-no-navegador", "ia-no-celular"].includes(lessonId)) return null;
  return (
    <aside className="callout">
      <h3>Referências oficiais para acompanhar o guia</h3>
      <p>
        Referências revisadas em 16/11/2026. As lojas exibem telas do aplicativo; o
        visual pode mudar com a versão. Os links abrem serviços externos, com
        suas próprias regras de dados e conta.
      </p>
      <ul>
        {lessonId === "ia-no-navegador" ? (
          <>
            <li>
              <a href="https://chatgpt.com/" rel="noreferrer">
                Abrir ChatGPT no navegador (site externo)
              </a>
            </li>
            <li>
              <a
                href="https://help.openai.com/en/articles/9125172-the-chatgpt-home-page"
                rel="noreferrer"
              >
                Consultar orientação oficial de acesso
              </a>
            </li>
          </>
        ) : (
          <>
            <li>
              <a
                href="https://play.google.com/store/apps/details?id=com.openai.chatgpt"
                rel="noreferrer"
              >
                Android: ChatGPT na Google Play — OpenAI
              </a>
            </li>
            <li>
              <a
                href="https://apps.apple.com/br/app/chatgpt/id6448311069"
                rel="noreferrer"
              >
                iPhone: ChatGPT na App Store — OpenAI OpCo, LLC
              </a>
            </li>
          </>
        )}
      </ul>
      <p>
        Prefere estudar sem acessar outro serviço? Use o simulador desta aula.
      </p>
    </aside>
  );
}
