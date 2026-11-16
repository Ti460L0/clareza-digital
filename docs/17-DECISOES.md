# Decisões de implementação — 14/11/2026

O pedido anexado autoriza implementar todo o lançamento e substitui as restrições antigas de planejamento e de execução apenas das etapas 0–2. Publicação continua dependendo de revisão e autorização expressa. Não criar contas ou contratar recursos.

- Frontend React/TypeScript/Vite, publicado futuramente como arquivos estáticos no Cloudflare Workers em https://clarezadigital.cod4ti.com. Rotas SPA conforme documentação oficial consultada nesta data: https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/.
- Backend do assistente na VPS do usuário, em Docker, separado por contrato HTTP. Nenhum recurso remoto foi inspecionado ou alterado ainda. Definir exposição HTTPS após inventário autorizado da infraestrutura existente.
- npm com lockfile para instalação reproduzível; Node local 24.19.0, npm 11.17.0. Vite publicado consultado no registro oficial: 8.2.2, compatível com Node local. Demais versões serão registradas no lockfile após resolução.
- Git inicializado em pasta que não possuía repositório; arquivos de planejamento preservados.
- Docker ausente do ambiente local: entregar e revisar configuração não substitui testar execução de contêiner.
- Contador no rodapé solicitado somente se dispensar backend: não incluir contador global fictício. Contagem pública única requer agregação em servidor/serviço; localStorage não mede visitantes globais. Nenhum rastreamento adicional autorizado ou implementado.

Decisões reversíveis: ferramenta ensinada, adaptador de IA, licenças e limites serão definidos e documentados nas respectivas etapas; custos não presumidos ilimitados. Integração real, revisão manual e produção não serão marcadas concluídas por testes com mocks.

## Correção de escopo pelo usuário — 15/11/2026
- IA somente com custo zero, preferindo a ideia de Hugging Face. Não há autorização para consumo pago, compra de créditos ou assinatura. Se não houver alternativa gratuita viável, o usuário autoriza lançar sem assistente generativo. Essa instrução substitui a exigência incondicional anterior de IA e a solicitação de orçamento OpenAI; o adaptador preparado não representa provedor escolhido.
- A API Inference Providers do Hugging Face informa atualmente ausência de créditos para contas gratuitas. ZeroGPU oferece possibilidade gratuita com condições de conta e cotas; não confundir com API gratuita ilimitada. Fontes consultadas: https://huggingface.co/docs/inference-providers/pricing e https://huggingface.co/docs/hub/spaces-zerogpu.
- Workers AI também documenta franquia gratuita no plano Free com recusa ao esgotar; plano da conta e viabilidade ainda precisam ser conferidos. Nenhuma inferência disparada: https://developers.cloudflare.com/workers-ai/platform/pricing/.
- Usuário indicou consultar arquivos do iSeek para acesso à VPS Hostinger. SSH autenticado e inventário somente de leitura realizados. Não instalar modelo, contêiner ou alterar serviços existentes antes da revisão e autorização final.
- Usuário confirmou Workers Free. Testes reais de dois candidatos foram possíveis dentro da franquia, sem alteração de plano. Candidatos não atingiram os critérios de qualidade; manter versão pública sem assistente por enquanto. Evidências em 23-TRIAGEM-IA-GRATUITA.md. A falta de acesso/gratuidade deixou de ser o motivo; a pendência real é qualidade e integração validada.
