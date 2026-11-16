# Arquitetura
## Estrutura futura
apps/web: React + TypeScript + Vite, rotas, componentes e estilos.
apps/api: ajuda contextual, políticas, recuperação e adaptador de provedor.
packages/content: cursos, esquemas, exercícios e fontes.
packages/shared: contratos sem segredos.
packages/video: composições Remotion e cenas.
public/media: derivados leves, posters e legendas.
tests: navegação, persistência, simulações, acessibilidade e harness.
docs: planejamento e decisões.

Proposta: workspace pnpm, Zod para validação, React Router, Vitest/Testing Library/Playwright. Verificar versões compatíveis antes de instalar; não congelar versões fictícias. Começar somente com pacotes necessários.

## Fluxos
Manifesto validado → curso → lição → blocos → exercício determinístico → progresso local.
Pergunta → API própria → limites → trechos publicados → modelo → validação da saída → resposta e referências internas.

## Contratos
ContentRef: courseId, lessonId, blockId, version.
Progress: schemaVersion, contentVersion, courseId, completedLessonIds, currentBlockId, attempts resumidas, updatedAt.
AssistantRequest: message, courseId?, lessonId?, conversation limitada. Cliente não define system prompt.
AssistantResponse: status (answered/needs-clarification/out-of-scope/unavailable), text, contentRefs[], suggestedActions[]. Nunca renderizar HTML arbitrário.

## Infraestrutura
Frontend estático e backend separados; hospedagem ainda a escolher. Não provisionar serviço específico implicitamente. Índice da IA pode ser gerado no build. Sem banco obrigatório no início.
Rate limit em várias instâncias exige armazenamento compartilhado; contador em memória não basta. Sem proteção adequada, assistente permanece desabilitado na publicação.

## Migração
IDs estáveis e schemaVersion; correção textual não apaga progresso. Mudança pedagógica relevante pede revisão sem perda silenciosa. Desenvolvimento primeiro local; publicação posterior.
## Infraestrutura confirmada na implementação
Cloudflare Workers com arquivos estáticos para frontend; domínio clarezadigital.cod4ti.com. Assistente em backend Docker na VPS existente, sem presumir serviço de banco contratado. Nenhum recurso remoto foi criado ou modificado. A exposição HTTPS e eventual proxy dependem do inventário da infraestrutura, com segredos somente no servidor. Decisões e estado de validação em 17-DECISOES.md e 16-STATUS.md.
