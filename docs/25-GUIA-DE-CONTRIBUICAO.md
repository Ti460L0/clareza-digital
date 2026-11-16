# Guia para adicionar conteúdo

Este guia descreve a implementação atual. Os documentos antigos de planejamento podem apresentar esquemas futuros. Comece com uma alteração pequena; preserve o conteúdo existente. Há [prompts prontos](26-PROMPTS-DE-CONTEUDO.md) e um [modelo de rascunho](templates/AULA.md).

## Defina o que o aluno aprenderá a fazer

Prefira objetivos observáveis: “Conferir uma cobrança por um caminho independente da mensagem”. Evite “Dominar segurança” ou promessas de proteção absoluta.

Use português brasileiro simples e adulto. Explique siglas, escreva ações curtas e uma ideia por bloco. Não culpe quem erra. O aluno deve poder dizer “não consigo confirmar” e escolher outro caminho.

Fluxo recomendado: situação cotidiana → explicação → exemplo → decisão → consequência e motivo → resumo com ações. Para uma nova aula, proponha de três a cinco blocos, duas questões com três alternativas e três ou quatro ações no resumo. São metas editoriais: o esquema mínimo atual permite três blocos, uma questão com duas alternativas e um item de resumo. Passar no esquema não comprova qualidade pedagógica.

## Fontes, exemplos e exercícios

Priorize fontes primárias: CERT.br, órgãos públicos e documentação oficial do serviço abordado. Abra a referência e confira se sustenta a afirmação. Registre título, URL, assunto sustentado e data real de consulta. Revalide interfaces, versões, acesso e preços quando mencionados. Não atualize uma data de revisão sem conferir a fonte.

Não invente estatísticas, referências, participantes, diagnósticos ou resultados de aprendizagem. Se faltar evidência, marque a pendência no rascunho e mantenha-o fora do catálogo. Explique com suas palavras; não copie materiais completos de terceiros.

- Identifique exemplos como fictícios e simulações como educativas. Não reproduza marcas reais, forneça links maliciosos ou colete credenciais.
- Faça perguntas sobre a decisão ensinada. A interface usa escolha única: escreva **exatamente uma alternativa recomendada**, embora o validador apenas exija ao menos uma.
- Explique todas as alternativas: motivo, consequência e caminho recomendado. Não use apenas “certo” ou “errado”. O esquema exige pelo menos 20 caracteres por explicação.
- Preserve estudo sem cadastro e sem IA, alternativa textual e acesso gratuito. Não acrescente certificado, suporte humano ou coleta de dados dos alunos.

## Onde editar

| Material | Arquivo atual |
| --- | --- |
| Aulas de segurança | `packages/content/security.ts`; a primeira está em `index.ts` como `pilot` |
| Aulas de IA | `packages/content/ai.ts` |
| Fontes | `packages/content/security-sources.ts` e `ai-sources.ts`; referências históricas também em `index.ts` |
| Catálogo, ordem e total do curso | `courses` em `packages/content/index.ts`: `lessons` e `planned` |
| Esquema e validação | `lessonSchema`, `questionSchema` e `validateContent` em `packages/content/index.ts` |
| Auxiliares de autoria | `packages/content/authoring.ts`: `lesson` e `q` |
| Revisão pedagógica | `packages/content/versions.ts` |
| Associação aula/vídeo | `apps/web/src/Media.tsx`: `lessonMedia` |
| Player narrado e dimensões | `apps/web/src/NarratedLesson.tsx` |
| Vídeo leve, capa e WebVTT | `apps/web/public/media/` |
| Transcrição publicada | `packages/content/narrated-transcripts.json` |

Uma fonte usa `{ id, title, url, reviewedAt, supports }`: ID único, título, endereço, data real e afirmação sustentada. Cite seu ID em `sourceIds` da aula. `Lesson` não possui campo de data/versão no esquema atual: a revisão fica em `versions.ts`; a data da fonte, em `reviewedAt`.

O exemplo abaixo demonstra o formato, **não uma aula já integrada nem uma fonte revalidada nesta documentação**. Reconfira a referência existente `cert` antes de propor sua inclusão. Para integrar, adicione a chamada `lesson(...)` ao array exportado no arquivo de aulas correspondente, preservando os imports existentes:

```ts
import { lesson, q } from "./authoring";

const exemploDeAula = lesson(
  "conferir-pedido-inesperado",
  "Conferir um pedido inesperado",
  "Confirmar um pedido por um contato que já era conhecido.",
  ["cert"],
  [
    ["Uma mensagem com pressa", [
      "Exemplo fictício: uma mensagem pede que você envie um código para resolver um problema agora.",
      "A pressa pode dificultar a decisão. Pare antes de responder.",
    ]],
    ["Escolha um caminho independente", [
      "Não envie o código. Procure o serviço pelo aplicativo que você já usa ou por um contato conhecido antes da mensagem.",
      "Um telefone fornecido na própria mensagem não é uma confirmação independente.",
    ]],
    ["Quando não conseguir confirmar", [
      "Interrompa a conversa. Você não precisa adivinhar nem enviar dados como teste.",
      "Se já compartilhou algo, consulte a aula Já interagi para distinguir os próximos cuidados.",
    ]],
  ],
  [q("conferir-pedido-inesperado-q1", "Uma mensagem urgente pede um código. O que fazer?", [
    ["Enviar para terminar logo.", false, "A urgência não confirma a identidade de quem pediu. Não compartilhe o código para testar a conversa."],
    ["Procurar o serviço por um contato já conhecido.", true, "Esse caminho permite conferir o pedido sem depender do contato fornecido pela própria mensagem."],
    ["Confiar porque a mensagem tem um logotipo.", false, "Imagens e nomes podem ser copiados. A aparência não confirma a origem do pedido."],
  ])],
  ["Pause antes de responder.", "Confira por um caminho independente.", "Não use códigos ou dados pessoais como teste."],
);
```

O exemplo omite `simulation`: o campo é opcional e só aceita simuladores já implementados (`sms`, `family`, `bank`, `address`, `ai`, `news`). Não invente um identificador para fazer uma atividade parecer pronta. Uma interação nova precisa de implementação acessível e verificação próprias.

IDs de aulas e questões devem ser únicos no catálogo; IDs de opções, únicos dentro da questão. Preserve IDs publicados. Os auxiliares geram IDs de blocos/opções por posição: reordenar itens antigos pode mudar sua identidade. Examine o progresso e incremente a revisão pedagógica para mudanças relevantes de explicação, decisão ou gabarito. Correções de grafia não devem apagar progresso. Não troque IDs para contornar migração.

Para uma aula em curso existente, confira sequência e `planned`. Um novo curso exige revisar também catálogo, rotas e testes pertinentes; não basta criar um arquivo solto.

## Vídeos e complementos

O vídeo pode conduzir a explicação, mas a aula deve continuar completa por texto. Uma proposta pode começar sem mídia; não coloque botão de vídeo sem arquivo funcional. No NotebookLM, selecione somente a fonte da aula e use o [prompt de vídeo](26-PROMPTS-DE-CONTEUDO.md). Prefira vertical 9:16 quando houver opção; aceite o formato nativo sem cortar conteúdo. Escrever “vertical” no prompt não comprova as dimensões do resultado.

Entregue MP4 compatível com navegador, capa, legenda WebVTT sincronizada e transcrição do áudio final. Informe origem, ferramenta e direitos de uso; confira informações e legibilidade. Legendas automáticas precisam de aviso enquanto não revisadas. Não invente transcrição a partir do roteiro: o áudio pode ser diferente.

Use componentes e cores existentes: verde escuro/creme, azul para explicações e âmbar para alertas, sempre com rótulos e símbolos. Narre a informação visual essencial e evite música que atrapalhe. No player, indique `vertical: true` apenas para um arquivo realmente vertical. Preserve controles, tela cheia e ausência de autoplay.

Originais e rascunhos ficam em `output/`, ignorada pelo Git. Cópias leves publicadas ficam em `apps/web/public/media/`; evite arquivos grandes e não adicione serviços pagos. `transcribe-lessons.py` e `publish-captions.mjs` listam os arquivos atuais explicitamente: **não descobrem uma nova aula automaticamente**. Atualize as listas ou integre a legenda/transcrição com cuidado, sem sobrescrever material existente. `prepare-notebooklm.ts` prepara fontes/prompts a partir do catálogo; arquivos gerados não provam que o vídeo existe.

Para usar Remotion, leia `docs/08-REMOTION.md`, confira a licença aplicável ao seu uso e siga o pacote `packages/video`. A elegibilidade acadêmica do responsável não se aplica automaticamente a qualquer colaborador.

## Verificações e envio

Para conteúdo integrado:

```sh
npm ci
npm run build
npx vitest run tests/content.test.ts
npm run dev
```

Confira a aula no celular e com teclado, cada alternativa, feedback e resumo. Para mídia, confira carregamento, proporção, legendas, transcrição e alternativa textual. Para mudanças de interação, execute os testes pertinentes em `tests/e2e` ou `tests/deployment`, com a configuração `playwright*.config.ts` adequada. Não use credenciais reais de IA para testar conteúdo estático. Testes automáticos não comprovam exatidão factual nem toda a acessibilidade.

Para documentação apenas, confira links e coerência com os arquivos reais; não precisa gerar vídeos ou repetir toda a suíte. Registre em `docs/16-STATUS.md` o que foi realmente feito e as pendências.

Abra um pull request com objetivo, arquivos, fontes consultadas e datas, origem/licença de materiais, uso de IA e verificações executadas. Não publique o site nem altere serviços remotos como parte da contribuição. A integração depende do responsável; não há prazo de revisão garantido.
