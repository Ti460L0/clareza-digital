# Assistente: implementação parcial

## Estado
Núcleo e servidor HTTP local em `apps/api/src`, interface em `apps/web/src/Tutor.tsx`. Não há chamadas reais realizadas. O adaptador está preparado para OpenAI Responses; modelo, preços, orçamento e credencial precisam de configuração explícita. A seleção definitiva depende da avaliação real. Hugging Face permanece uma alternativa, sem promessa de gratuidade.

## Contrato e recuperação
Entrada estrita: pergunta de 3–1000 caracteres, aula publicada opcional, modo explicar/pista e até quatro mensagens de histórico. Não aceita papéis privilegiados, documentos externos ou campos de instrução do cliente.

Índice derivado dos slides publicados dos dois cursos. Busca lexical com normalização de acentos, peso de título/raridade e contexto da aula; até três trechos. Não indexa gabaritos. Não usa embeddings, navegação, ferramentas ou uploads. Busca lexical tem limites para sinônimos e linguagem informal: avaliar antes de lançamento.

Saída estruturada com tipo, resposta e referências. Servidor valida IDs contra os trechos recuperados e exige citações literais existentes. Caminhos e títulos vêm do catálogo, não do modelo. Bloqueia HTML e URLs na resposta. Isso não demonstra que a explicação é verdadeira ou sustentada integralmente: a avaliação humana dos casos permanece obrigatória.

Sem trecho relevante, retorna ajuda estática identificada (`generated: false`), sem chamar o modelo. Erros do provedor não devem exibir seu corpo ao usuário nem registrá-lo em logs.

## Adaptador
REST `POST https://api.openai.com/v1/responses`, saída JSON Schema estrita, `store: false`, teto de 900 tokens de saída, timeout de 20 segundos, resposta limitada a 64.000 bytes e redirecionamentos recusados. Trata recusa, resposta incompleta, JSON inválido e indisponibilidade. Não faz tentativas automáticas que multipliquem cobrança.

Fontes oficiais consultadas em 14/11/2026:
- [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs): formato não dispensa validação de regras e tratamento de falhas.
- [Controles de dados](https://developers.openai.com/api/docs/guides/your-data): `store: false` não equivale a retenção zero; registros de monitoramento de abuso podem ser retidos conforme a política do provedor. A interface deve informar isso antes do envio.

## Reserva de consumo
SQLite local compartilhado entre processos da mesma VPS. Transação `BEGIN IMMEDIATE` reserva teto de custo antes da chamada; valores inteiros em milionésimos de dólar, limites diário/mensal, pedidos por dia, janela de dez minutos por identificador derivado e concorrência. Qualquer limite zero desliga chamadas. Banco indisponível deve impedir chamadas, nunca liberar acesso sem controle.

Reserva conservadora usa bytes UTF-8 do corpo completo mais margem de 1024 como teto estimado de entrada e o máximo de saída, com preços explicitamente configurados por milhão de tokens. Revalidar tokenização/preços do modelo escolhido e confrontar estimativa com uso real antes de ativar. Não é relatório de faturamento e não substitui limites no projeto do provedor.

Custo reservado não é devolvido em falhas, pois uma resposta perdida pode ter sido cobrada. Finalização libera apenas a vaga concorrente. Vagas expiram em 60 segundos para recuperação de queda, acima do timeout do adaptador. Registros antigos são removidos após 35 dias quando uma nova reserva é tentada; são metadados de consumo, sem pergunta ou resposta. A integração deriva o identificador por HMAC do IP confiável, com rotação diária e segredo no servidor.

Não usar este arquivo SQLite em hosts/volumes independentes: isso multiplicaria o orçamento. Execução Docker, backup e restauração ainda pendentes.

## Evidência e próxima etapa
57 testes passaram (6 anteriores, 26 de tutor/adaptador, 9 de limites, 16 de API), incluindo duas conexões ao mesmo SQLite. Transporte de IA inteiramente simulado e explicitamente nomeado nos testes. TypeScript passou. Há teste HTTP local com provedor simulado e seis testes de interface desktop/mobile. Isso não substitui teste multiprocesso nem 30 casos de avaliação real do modelo.

Worker de proxy, empacotamento Docker e procedimentos de operação foram adicionados; evidências e limitações em docs/20-IMPLANTACAO-E-OPERACAO.md. Pendentes execução Docker, avaliação real autorizada e publicação.
