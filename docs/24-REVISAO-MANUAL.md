# Revisão manual da versão sem assistente

## Estado em 16/11/2026

Capturas de oito situações foram inspecionadas e estão em `docs/evidence/review`. Isso comprova apenas as amostras e tamanhos descritos em 16-STATUS. Ainda falta executar o roteiro abaixo em navegador visível com leitor de tela e zoom nativo. Não marcar os itens por aprovação visual de PNG, árvore de acessibilidade ou teste automatizado.

O controle Windows falhou ao inicializar recursos locais. Chrome DevTools MCP não está disponível. Para continuar a auditoria de desempenho pelo conector, a configuração indicada pelo workflow é:

```json
"chrome-devtools": {
  "type": "local",
  "command": ["npx", "-y", "chrome-devtools-mcp@latest"]
}
```

Não instalado automaticamente. Não há LCP, INP ou CLS medidos nesta entrega.

## Preparar

Executar `npm run build`, depois `npm run preview`. Abrir `http://127.0.0.1:4173`. Registrar navegador/versão, sistema, leitor/versão, largura e resultado de cada tarefa. Não usar dados pessoais nas simulações. Para desempenho no Workers local, usar `npm run cf:dev` e porta 8787 após build.

## Tarefas e aceite

| Tarefa | O que observar | Resultado atual |
|---|---|---|
| Abrir início e usar Pular para o conteúdo só pelo teclado | Link visível ao foco; foco entra no conteúdo, sem armadilha | Automação pertinente passou; manual pendente |
| Entrar em Segurança → Antes de clicar com leitor de tela | Título da página, título principal, objetivo e navegação compreensíveis; sem texto essencial oculto | Pendente |
| Avançar slide, abrir Experimentar, escolher outro caminho e pedir pista | Mudança de etapa e resposta compreensíveis; botões nomeados; endereços fictícios sem navegação externa | Percurso automatizado passou; leitura assistiva pendente |
| Responder quiz, conferir e tentar novamente | Grupo/opções identificados; feedback lido; foco previsível; sem exigir cor | Teclado/foco automatizados passaram; anúncio real pendente |
| Abrir leitura contínua, resumo e consulta | Ordem de títulos e leitura coerentes; links de fonte e retorno claros | Capturas e Axe passaram; leitura assistiva pendente |
| Navegar com zoom nativo a 200% | Controles/texto essenciais acessíveis, sem sobreposição/perda horizontal no viewport escolhido | Fonte CSS 200% passou; zoom nativo pendente |
| Carregar vídeo, pausar e abrir alternativa textual | Controles operáveis, texto substitui ações visuais | Decodificação/seek passaram; leitura em aparelho real pendente |
| Recarregar e voltar pelo histórico; reiniciar após confirmar | Etapa preservada; confirmação clara; estado limpo após reinício | E2E passou; revisão assistiva pendente |
| Abrir ChatGPT e listagens oficiais pelo guia | Nome/desenvolvedor corretos; campo de mensagem e instalação atuais; não pedir conta para concluir curso | Textos oficiais reconsultados; interfaces em aparelho/navegador pendentes |

## Referências reconsultadas

Em 16/11/2026, a página oficial inicial do ChatGPT confirma campo de mensagem e acesso sem conta variável por região/rede. Google Play identifica ChatGPT/OpenAI e controle Install; App Store Brasil identifica ChatGPT/OpenAI OpCo, LLC e compras opcionais. Requisitos de sistema não foram fixados no curso para evitar obsolescência. Leitura dessas páginas não é execução/instalação dos aplicativos nem inspeção de uma sessão autenticada.

- https://help.openai.com/en/articles/9125172-the-chatgpt-home-page
- https://play.google.com/store/apps/details?id=com.openai.chatgpt
- https://apps.apple.com/br/app/chatgpt/id6448311069

## Antes da publicação

Concluir as pendências ou obter decisão explícita do responsável sobre as limitações, apresentar o build revisável e pedir autorização específica para publicar no domínio. Nenhum consentimento genérico para continuar substitui essa etapa. Depois de publicar, validar HTTPS, rotas, cabeçalhos, mídias, progresso e ausência de chamadas de IA no domínio público, registrando versão e rollback.
