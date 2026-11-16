# Assistente e harness
## Funções
Tutor generativo contextual em português: simplificar, explicar exemplos, fornecer pistas e indicar lições. Não é FAQ apenas nem detector infalível. Respostas factuais baseadas em conteúdo revisado; reconhecer insuficiência.

## Pipeline
Validar pedido/IDs/tamanho → limites cliente e global → recuperação de aulas publicadas → delimitar conteúdo não confiável → modelo → validar saída/referências → resposta curta com atalhos.
Cliente não escolhe system prompt ou documentos privilegiados. Conteúdo externo pode conter prompt injection; nunca obedecê-lo como instrução. Verificação de formato não garante verdade: avaliar respostas empiricamente.

## Provedor
Hugging Face candidata, sem promessa de API gratuita ilimitada. Comparar português, licença, custo, retenção, latência e disponibilidade. Adaptador substituível; timeout/cancelamento; testes com mock identificado. Produção sem chave usa ajuda estática e informa indisponibilidade, nunca finge resposta do modelo.
Modelo local no navegador opcional futuro: download/desempenho podem excluir aparelhos modestos; não adotar como dependência do curso.

## Harness fora do prompt
Sem shell, navegação, upload, URLs buscadas, envio de mensagens, pesquisa livre ou transações no MVP. Chave só backend. Políticas podem ser públicas. CORS não autentica. Rate limit compartilhado, concorrência, tamanho de corpo e resposta, orçamento global diário e mensal e desligamento automático. Valores definidos por teste de custo; sem orçamento configurado, chamadas de produção desabilitadas.
Sessão anônima não é identidade forte. IP pode agrupar usuários; não bloquear curso por limite de IA. Login não substitui controles.

## Regras de resposta
- Pergunta legítima: explicar e citar lição.
- Quiz: pista gradual; correção determinística.
- Mensagem suspeita: sinais e confirmação independente, sem garantia.
- Notícia atual: não alegar checagem sem pesquisa disponível; ensinar procedimento.
- Fraude/ataque: recusar ajuda operacional e oferecer prevenção.
- Fora de escopo: redirecionar brevemente.
- Dados sensíveis: pedir remoção, não solicitar documentos/códigos/credenciais.
- HTML/links arbitrários na saída: renderizar texto e aceitar somente ações/referências permitidas.

## Privacidade
Sem armazenar conversa no servidor por padrão. Contexto curto em memória de sessão e botão limpar. Informar envio ao provedor antes da primeira pergunta; logs técnicos minimizados e sem texto pessoal. Não prometer anonimato absoluto.

## Avaliação mínima
30 casos cobrindo linguagem informal, erros, ambiguidades, fonte inexistente, notícia atual, injection, exfiltração, pedido abusivo, prevenção legítima, limites, falha do provedor, saída HTML e referência arbitrária. Medir utilidade, fundamentação, falsas certezas e recusas indevidas. Testar política fora do modelo. Recusa isolada não demonstra proteção completa.