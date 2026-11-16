import { incidentCases } from "../../../packages/content/incidents";
import { AiPractice, NewsPractice } from "./AiPractice";
import { useState } from "react";
export function SmsSimulation({ kind }: { kind: string }) {
  const [page, setPage] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [hint, setHint] = useState(false);
  return (
    <section className="simulation" aria-label="Simulação de mensagem">
      <p className="simulation-label">
        Simulação educativa · Empresa e dados fictícios
      </p>
      <div className="phone">
        <p className="phone-top">
          {page ? "Página ilustrada" : "Mensagem de texto"}
        </p>
        {page ? (
          <>
            <div className="fake-address">
              entrega-clara.test.validacao.example
            </div>
            <h3>Entrega Clara</h3>
            <p>Pedido demonstrativo 0000</p>
            <p>Taxa ilustrativa: R$ 4,90</p>
            <p>Nenhum campo aceita dados e não há pagamento.</p>
            <AddressPractice />
          </>
        ) : (
          <>
            <h3>Entrega Clara</h3>
            <blockquote>
              Sua entrega está pendente. Pague a taxa para liberar hoje.
            </blockquote>
            <p className="fine">
              O nome e o cenário são inventados para esta atividade.
            </p>
          </>
        )}
      </div>
      <div className="actions">
        {!page && (
          <button
            className="secondary"
            onClick={() => {
              setPage(true);
              setFeedback("");
            }}
          >
            Abrir exemplo ilustrado
          </button>
        )}
        <button
          onClick={() =>
            setFeedback(
              "Você saiu da cobrança e abriu, por conta própria, o aplicativo da compra. Agora pode conferir o pedido sem depender desta mensagem.",
            )
          }
        >
          Conferir por outro caminho
        </button>
        <button className="secondary" onClick={() => setHint(!hint)}>
          Pedir pista
        </button>
      </div>
      {hint && (
        <p className="callout">
          A urgência não precisa decidir por você. Onde você consultaria essa
          compra se não tivesse recebido o SMS?
        </p>
      )}
      {page && (
        <button
          className="text-button"
          onClick={() =>
            setFeedback(
              "O cadeado trata da conexão; não confirma que a empresa é quem diz ser. Uma página imitada também pode ter conexão protegida.",
            )
          }
        >
          E se eu confiar no cadeado?
        </button>
      )}
      <p role="status">{feedback}</p>
      <button
        className="text-button"
        onClick={() => {
          setPage(false);
          setFeedback("");
          setHint(false);
        }}
      >
        Repetir simulação
      </button>
      <span hidden>{kind}</span>
    </section>
  );
}
export function AddressPractice() {
  const [inspect, setInspect] = useState(false);
  return (
    <section className="address-practice">
      <h3>Olhe com calma — e reconheça o limite</h3>
      <p>Endereços fictícios, sem navegação:</p>
      <ul>
        <li>
          <code>banco-exemplo.test</code> — referência do exercício
        </li>
        <li>
          <code>banco-exemplo.test.validacao.example</code> — endereço diferente
        </li>
        <li>
          <code>banc0-exemplo.test</code> — contém o número zero
        </li>
        <li>
          <code>bаnco-exemplo.test</code> — contém uma letra de outro alfabeto
        </li>
      </ul>
      <button
        className="secondary"
        aria-expanded={inspect}
        onClick={() => setInspect(!inspect)}
      >
        Examinar caracteres
      </button>
      {inspect && (
        <div className="callout">
          <p>
            <span className="large-letter">a / а</span>
          </p>
          <p>
            À esquerda: letra a latina, U+0061. À direita: letra a cirílica,
            U+0430. Elas podem parecer iguais. A exibição de caracteres
            internacionais varia entre navegadores.
          </p>
          <p>
            Contar pontos ou procurar erros não basta para confirmar um destino.
            Você pode escolher: “Não consigo confirmar; vou por outro caminho”.
          </p>
        </div>
      )}
    </section>
  );
}

export function Simulation({ kind }: { kind: string }) {
  if (kind === "ai") return <AiPractice />;
  if (kind === "news") return <NewsPractice />;
  if (kind === "sms") return <SmsSimulation kind="sms" />;
  if (kind === "address")
    return (
      <section className="simulation">
        <p className="simulation-label">
          Simulação educativa · Endereços fictícios
        </p>
        <AddressPractice />
        <IndependentDecision />
      </section>
    );
  if (kind === "incident") return <IncidentPractice />;
  return <Conversation key={kind} kind={kind} />;
}
function IndependentDecision() {
  const [decision, setDecision] = useState("");
  return (
    <>
      <p>
        Você recebeu esse endereço em uma mensagem inesperada. Qual caminho
        escolhe?
      </p>
      <button
        onClick={() =>
          setDecision(
            "Boa decisão: abra o aplicativo ou contato conhecido, fora da mensagem. Não é necessário decifrar cada caractere.",
          )
        }
      >
        Não consigo confirmar; vou por outro caminho
      </button>
      <button
        className="secondary"
        onClick={() =>
          setDecision(
            "A aparência, sozinha, não confirma a identidade. Você pode mudar de decisão e procurar um canal conhecido.",
          )
        }
      >
        Confiar só na aparência
      </button>
      <p role="status">{decision}</p>
    </>
  );
}
function Conversation({ kind }: { kind: string }) {
  const [stage, setStage] = useState<"message" | "confirm" | "explanation">(
    "message",
  );
  const [feedback, setFeedback] = useState("");
  const family = kind === "family";
  const restart = () => {
    setStage("message");
    setFeedback("");
  };
  return (
    <section className="simulation">
      <p className="simulation-label">
        Simulação educativa · Pessoas e serviços fictícios
      </p>
      <div className="phone">
        <p className="phone-top">
          {family
            ? "Conversa com número novo"
            : "Ligação ilustrada — Central Horizonte"}
        </p>
        <h3>{family ? "“Sou sua filha”" : "“Sua conta corre perigo”"}</h3>
        <blockquote>
          {family
            ? "Meu celular quebrou. Preciso de uma transferência agora. Não posso falar."
            : "Transfira para uma conta segura. Leia o código recebido e instale nosso suporte remoto."}
        </blockquote>
        <p>Não há chamada, pagamento ou código real nesta atividade.</p>
      </div>
      {stage === "message" ? (
        <div className="actions">
          <button
            onClick={() => {
              setStage("confirm");
              setFeedback(
                "Você interrompeu o pedido e escolheu confirmar fora desse contato.",
              );
            }}
          >
            {family
              ? "Ligar para o contato anterior"
              : "Encerrar e abrir o aplicativo do banco"}
          </button>
          <button
            className="secondary"
            onClick={() => {
              setStage("explanation");
              setFeedback(
                family
                  ? "A foto pode ser copiada. A urgência e o pedido para não ligar não comprovam a identidade. Você pode tentar de novo e confirmar pelo número anterior."
                  : "Um código pode autorizar acesso. Uma transferência de teste também envia dinheiro. Interrompa e procure o banco por um canal já conhecido.",
              );
            }}
          >
            {family
              ? "Confiar na foto e na urgência"
              : "Seguir as instruções do contato"}
          </button>
        </div>
      ) : stage === "confirm" ? (
        <div className="callout">
          <h3>
            {family
              ? "Ligação simulada ao número anterior"
              : "Consulta simulada no aplicativo já conhecido"}
          </h3>
          <p>
            {family
              ? "O contato anterior atende: “Não pedi dinheiro. Obrigado por conferir.”"
              : "Você procurou o atendimento dentro do aplicativo. O pedido recebido não é confirmado."}
          </p>
          <button
            onClick={() => {
              setStage("explanation");
              setFeedback(
                "Você confirmou por um caminho independente. Se não tivesse conseguido confirmação, poderia esperar, sem pagar nem fornecer dados.",
              );
            }}
          >
            Ver a explicação
          </button>
        </div>
      ) : null}
      <p role="status">{feedback}</p>
      {stage !== "message" && (
        <button className="secondary" onClick={restart}>
          Repetir simulação
        </button>
      )}
    </section>
  );
}
function IncidentPractice() {
  const [selected, setSelected] = useState("");
  const cases = incidentCases;
  return (
    <section className="simulation">
      <p className="simulation-label">
        Simulação educativa · Não informe dados do seu caso
      </p>
      <h3>Qual ação aconteceu neste exemplo?</h3>
      <p>
        Escolha uma situação fictícia para ver os primeiros cuidados. Você pode
        consultar todas.
      </p>
      <div className="actions">
        {cases.map((c) => (
          <button
            className="secondary"
            key={c.label}
            aria-pressed={selected === c.label}
            onClick={() => setSelected(c.label)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p role="status">{cases.find((c) => c.label === selected)?.text}</p>
    </section>
  );
}
