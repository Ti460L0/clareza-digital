import { aiLessons } from "./ai";
import { aiSources } from "./ai-sources";
import { securityLessons } from "./security";
import { securitySources } from "./security-sources";
import { z } from "zod";
const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  correct: z.boolean(),
  explanation: z.string().min(20),
});
export const questionSchema = z
  .object({
    id: z.string(),
    prompt: z.string(),
    options: z.array(optionSchema).min(2),
  })
  .refine(
    (q) => q.options.some((o) => o.correct),
    "Questão sem alternativa correta",
  );
export const lessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  objective: z.string(),
  sourceIds: z.array(z.string()).min(1),
  slides: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        paragraphs: z.array(z.string()).min(1),
      }),
    )
    .min(3),
  questions: z.array(questionSchema).min(1),
  summary: z.array(z.string()).min(1),
  simulation: z
    .enum(["sms", "family", "bank", "address", "ai", "news"])
    .optional(),
});
export type Lesson = z.infer<typeof lessonSchema>;
export type Question = z.infer<typeof questionSchema>;
export const sources = [
  ...aiSources,
  ...securitySources,
  {
    id: "https",
    title: "Chromium — O significado da conexão HTTPS",
    url: "https://blog.chromium.org/2023/05/an-update-on-lock-icon.html",
    reviewedAt: "2026-11-14",
    supports:
      "HTTPS protege a conexão, mas não garante a confiabilidade do site. O ícone varia entre navegadores.",
  },
  {
    id: "idn",
    title: "Chromium — Nomes de domínio internacionais",
    url: "https://chromium.googlesource.com/chromium/src/+/main/docs/idn.md",
    reviewedAt: "2026-11-14",
    supports:
      "Caracteres de alfabetos distintos podem parecer iguais; políticas de Unicode e punycode variam entre navegadores.",
  },
  {
    id: "cert",
    title: "CERT.br — Cartilha de Segurança para Internet",
    url: "https://cartilha.cert.br/fasciculos/",
    reviewedAt: "2026-11-14",
    supports:
      "Cuidados com links desconhecidos, aplicativos falsos, códigos e dados pessoais.",
  },
];
export const pilot: Lesson = {
  id: "antes-de-clicar",
  title: "Antes de clicar",
  objective: "Conferir uma cobrança por um caminho independente da mensagem.",
  sourceIds: ["cert", "https", "idn"],
  simulation: "sms",
  slides: [
    {
      id: "pausa",
      title: "Uma pausa muda a decisão",
      paragraphs: [
        "Você recebe uma mensagem dizendo que uma entrega ficou parada. Ela pede uma taxa e dá pouco tempo para pagar. Neste exemplo fictício, vamos praticar uma decisão sem pressa.",
        "Não é preciso descobrir tudo olhando a mensagem. Abra por conta própria o aplicativo da compra ou use um contato que você já conhecia.",
      ],
    },
    {
      id: "aparencia",
      title: "A aparência não confirma a cobrança",
      paragraphs: [
        "Um nome conhecido, uma foto ou um desenho de cadeado pode fazer parte de uma página imitada. Estar esperando uma encomenda também não confirma quem enviou o SMS.",
        "O exemplo a seguir é uma simulação educativa. Os endereços não abrem sites e nenhum pagamento ou dado pessoal será solicitado.",
      ],
    },
    {
      id: "caminho",
      title: "Confira por outro caminho",
      paragraphs: [
        "Saia da mensagem. Abra o aplicativo que já usa para acompanhar a compra. Procure o pedido e as informações da entrega ali.",
        "Se ainda houver dúvida, procure o atendimento dentro desse aplicativo. Não use o telefone ou o link fornecido pela mensagem que você está tentando confirmar.",
      ],
    },
    {
      id: "limite",
      title: "Você pode dizer: não consigo confirmar",
      paragraphs: [
        "Não precisa pagar nem adivinhar para terminar esta aula. Quando um endereço confunde você, escolher outro caminho é uma decisão válida.",
        "Se já abriu uma página, interrompa a interação e avalie o que fez: só abriu, informou dados, instalou algo ou pagou? Cada situação pede cuidados diferentes. Abrir uma página, por si só, não prova que houve perda de dinheiro.",
      ],
    },
  ],
  questions: [
    {
      id: "s1-entrega",
      prompt:
        "Você espera uma encomenda. Um SMS pede uma taxa urgente. Qual é o próximo passo mais seguro?",
      options: [
        {
          id: "pagar",
          text: "Pagar porque estou esperando uma compra.",
          correct: false,
          explanation:
            "Esperar uma compra não confirma o remetente nem a cobrança. A coincidência pode tornar a mensagem convincente.",
        },
        {
          id: "conferir",
          text: "Abrir o aplicativo da compra por conta própria.",
          correct: true,
          explanation:
            "Esse caminho permite conferir o pedido sem depender do link ou do telefone fornecido no SMS.",
        },
        {
          id: "logo",
          text: "Confiar se a página tiver um logotipo conhecido.",
          correct: false,
          explanation:
            "Uma página pode copiar a aparência de uma empresa. O desenho não confirma a origem do pedido.",
        },
      ],
    },
    {
      id: "s1-duvida",
      prompt:
        "O endereço parece conhecido, mas você não consegue ter certeza. Como agir?",
      options: [
        {
          id: "tentar",
          text: "Informar alguns dados para ver se funciona.",
          correct: false,
          explanation:
            "Testar com dados pessoais entrega informações antes de confirmar o destino. Não use seus dados como teste.",
        },
        {
          id: "pontos",
          text: "Contar os pontos e decidir só pela aparência.",
          correct: false,
          explanation:
            "Endereços variam e podem confundir. Uma regra visual isolada não confirma a identidade de quem está do outro lado.",
        },
        {
          id: "independente",
          text: "Não consigo confirmar; vou por outro caminho.",
          correct: true,
          explanation:
            "Você não precisa decifrar o endereço para se proteger. Procure o serviço pelo aplicativo ou contato já conhecido.",
        },
      ],
    },
  ],
  summary: [
    "Pause antes de agir sob pressão.",
    "Confira o pedido fora da mensagem.",
    "Não use aparência como prova de identidade.",
    "Se não conseguir confirmar, interrompa e procure um canal conhecido.",
  ],
};
export const courses = [
  {
    id: "seguranca",
    title: "Segurança digital no dia a dia",
    description:
      "Pratique decisões sobre mensagens, cobranças e pedidos inesperados.",
    lessons: [pilot, ...securityLessons],
    planned: 6,
  },
  {
    id: "ia",
    title: "Educação digital na era da IA",
    description:
      "Aprenda a conversar com IA e conferir informações com senso crítico.",
    lessons: aiLessons,
    planned: 7,
  },
];
export function validateContent() {
  const ids = new Set<string>();
  for (const c of courses)
    for (const l of c.lessons) {
      lessonSchema.parse(l);
      for (const id of [
        l.id,
        ...l.slides.map((s) => s.id),
        ...l.questions.map((q) => q.id),
      ]) {
        if (ids.has(id)) throw Error(`ID duplicado: ${id}`);
        ids.add(id);
      }
      for (const s of l.sourceIds)
        if (!sources.some((x) => x.id === s))
          throw Error(`Fonte ausente: ${s}`);
      for (const q of l.questions)
        if (new Set(q.options.map((o) => o.id)).size !== q.options.length)
          throw Error("Opções duplicadas");
    }
  return true;
}
validateContent();
