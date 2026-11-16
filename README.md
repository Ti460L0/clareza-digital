# Clareza Digital
Site publicado: **https://clarezadigital.cod4ti.com**. Versão de 16/11/2026 sem assistente generativo, sem backend instalado na VPS. Publicação autorizada pelo responsável; revisões manuais ampliadas e métricas de desempenho não foram realizadas. Registro vigente em docs/16-STATUS.md; descrições anteriores de planejamento abaixo são históricas.

Projeto pessoal acadêmico de Engenharia de Software, para a disciplina Sistemas da Informação e Sociedade.

Código-fonte: https://github.com/Ti460L0/clareza-digital.

Portal gratuito em português para pessoas leigas, incluindo idosos, aprenderem segurança digital e uso crítico de IA. Ensino autônomo por slides, simulações, quizzes e animações Remotion. Sem certificado, gravações do autor, suporte humano ou formulário de feedback.

Entrega atual: treze aulas, 27 questões explicadas, simulações e sete vídeos narrados do NotebookLM: cinco nas aulas S1–S5 e dois na aula de conversa com IA, incluindo um complemento vertical. Legendas e transcrições automáticas identificadas. A oficina de pesquisa ensina a formular prompts e conferir fontes. O assistente generativo permanece desligado, conforme orientação de custo zero do usuário. Consulte docs/16-STATUS.md para a versão publicada e as pendências de mídia. Nenhum resultado acadêmico presumido.

## Executar localmente
`VITE_ASSISTANT_ENABLED=false` é o padrão público: não mostra o tutor nem consulta sua API. Não habilitar para publicação sem comprovar custo zero e validar a integração real. Os testes E2E da integração futura habilitam essa interface somente no servidor local de testes e simulam o provedor; o teste de Workers usa o build sem IA.

Node 24 ou superior. Instale com `npm ci`, inicie com `npm run dev` e abra http://127.0.0.1:5173. Verificações: `npm test`, `npm run build` e, após `npx playwright install chromium`, `npm run test:e2e`.

O site funciona sem servidor de IA. Para desenvolver a API: copie `.env.example` para `.env`, gere dois segredos distintos e mantenha `AI_ENABLED=false`. Execute `npm run api:build` e `npm run api:start`. Para conectar o site à API local na porta 8788, defina `API_DEV_PROXY=true` e reinicie `npm run dev`. Os segredos ficam apenas nesses processos de servidor. Não habilite chamadas reais antes de configurar modelo, preços e orçamento autorizado. Detalhes em docs/19-ASSISTENTE-IMPLEMENTACAO.md.

O site está publicado no Cloudflare Workers em https://clarezadigital.cod4ti.com. O backend opcional está preparado para Docker, mas não foi instalado na VPS e não é necessário para a versão pública atual.

Configuração local de Workers: `npm run cf:check` verifica sem publicar; `npm run test:worker` testa rotas/cabeçalhos no runtime local. Docker, backup, atualização e rollback estão descritos em [docs/20-IMPLANTACAO-E-OPERACAO.md](docs/20-IMPLANTACAO-E-OPERACAO.md). O contêiner ainda precisa ser executado em um ambiente com Docker disponível.

Leia AGENTS.md e docs/00-INDICE.md. Para implementar, utilize docs/15-PROMPT-CODEX.md e avance por docs/12-IMPLEMENTACAO.md. Atualize docs/16-STATUS.md após cada entrega.

Decisões: dois cursos iniciais; acesso sem login; progresso local; IA contextual opcional com limites no servidor; curso utilizável sem IA. Gratuidade ilimitada do provedor não é presumida.

## Arquivos locais

O `.gitignore` exclui credenciais, dados privados, dependências, builds, relatórios temporários e a pasta `output/` com os vídeos originais e materiais gerados. As versões leves usadas pelo site ficam em `apps/web/public/media/` e são versionadas. Os exemplos `.env.example` e `.dev.vars.example` contêm somente valores fictícios. Nunca inclua chaves reais nesses exemplos.

Planejamento: 14/11/2026. Revalidar fontes, preços e interfaces antes do lançamento.

## Licenças e contribuições
Código autoral: [MIT](LICENSE). Conteúdo educativo autoral: [CC BY 4.0](CONTENT-LICENSE.md). Bibliotecas, ferramentas e fontes externas mantêm suas próprias licenças; veja [avisos de terceiros](THIRD-PARTY-NOTICES.md). Uso pessoal acadêmico confirmado pelo responsável em 16/11/2026, elegível à licença gratuita Remotion 4.0.543. Orientações em [CONTRIBUTING](CONTRIBUTING.md), [SECURITY](SECURITY.md) e [CODE_OF_CONDUCT](CODE_OF_CONDUCT.md).

Avaliação de IA: [docs/21-AVALIACAO-IA.md](docs/21-AVALIACAO-IA.md). `npm run ai:eval:build` prepara o avaliador e `npm run ai:eval` faz apenas estimativa por padrão; não há resultado de modelo real aprovado.
