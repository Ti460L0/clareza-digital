# Dados, login e evidências
## Sem conta no MVP
Progresso versionado localmente; memória como fallback. Explicar perda ao limpar navegador e ausência de sincronização. Reset confirmado por aula/curso. Nenhum CPF/nome/telefone necessário.

## Login futuro opcional
Objetivo exclusivo inicial: continuar em aparelhos diferentes. OAuth é autorização; autenticação com OIDC/biblioteca gerenciada, state/nonce/PKCE/sessão conforme documentação. Não inventar protocolo. Planejar vinculação, revogação, exclusão/exportação e recuperação antes de lançar. Conteúdo público continua aberto.

## Métricas opcionais
MVP sem coleta de resultados no servidor. Se desejado depois: decisão explícita de finalidade, informação ao aluno, dados mínimos, retenção/exclusão. Pseudônimo não garante anonimato. Logs de infraestrutura podem conter IP; não prometer inexistência absoluta de dados.
Eventos candidatos: lesson_started, exercise_first_attempt, exercise_completed, lesson_completed. Só IDs/versão/resultado mínimo, sem pergunta livre ou dados pessoais. Sem rastreadores publicitários. Bots e repetição afetam contagem.

## Evidência acadêmica
Git e capturas comprovam desenvolvimento, não benefício social por si. Visitas não são pessoas únicas/capacitadas. Respostas locais não são coletadas automaticamente. Quiz não comprova redução de fraude real.
Não inventar diagnóstico, público, participação, autorização ou resultado. Diferenciar evidência técnica, utilização e aprendizado. Formato assíncrono e mudança de público não foram explicitamente aprovados pelo professor; registrar limite sem exigir contato que usuário rejeitou.
Evidências privadas ficam fora do repositório público. Produto sem atendimento humano/formulário de feedback.

## Segredos
.env.example só nomes e valores fictícios. Ignorar .env, logs, tokens, dumps, relatórios privados e evidências pessoais. Revisar histórico antes de publicar. Se vazar, revogar segredo; remoção de arquivo não apaga histórico.

## Progresso implementado — 15/11/2026
Formato local `schemaVersion: 2`: aulas com posição, conclusão, tentativas, `contentVersion` e indicação de revisão; arquivo de estados anteriores em `archive`; última aula visitada em `lastLessonId`. Sem envio desses dados à API. O formato inicial 1 migra para revisão 1 sem perder respostas, posição ou conclusão.

`packages/content/versions.ts` registra incrementos de revisão por aula. Correções ortográficas não exigem incremento; mudanças de objetivo, orientação importante ou exercícios devem incrementar a revisão. Na leitura, uma revisão anterior é arquivada e a aula atual passa a pedir revisão, com aviso visível e histórico consultável. A migração é idempotente após salvar: não duplica arquivo a cada visita.

Dados de formato ou revisão mais novos são preservados sem sobrescrita, inclusive após rollback. Nesse caso, estudo continua em memória e um aviso explica a situação. Reinício confirmado da aula/curso apaga também seu histórico anterior. A interface de reinício limpa estados dos exercícios, simulações e assistente, e devolve o foco ao início da aula.

A retomada usa a última aula visitada ainda não concluída, mesmo que o aluno não tenha avançado um slide. Se ela foi concluída/removida, oferece outra aula publicada em andamento. Não há promessa de sincronização ou recuperação após limpar o navegador.
