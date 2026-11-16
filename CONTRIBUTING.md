# Contribuir com o Clareza Digital

Leia README, AGENTS e o índice de docs. Para adicionar aulas, siga o [guia de conteúdo](docs/25-GUIA-DE-CONTRIBUICAO.md), use os [prompts reutilizáveis](docs/26-PROMPTS-DE-CONTEUDO.md) e o [modelo de rascunho](docs/templates/AULA.md). Preserve o acesso sem conta, as alternativas textuais, a linguagem adulta e simples e o estudo sem IA. Conteúdo só deve parecer concluído quando tiver objetivo, explicação, exercício, resumo e fonte revisada.

Sem experiência em programação? Abra uma [proposta de conteúdo](https://github.com/Ti460L0/clareza-digital/issues/new?template=conteudo.md), com tema, objetivo, rascunho e fontes. Não é necessário produzir vídeo. Para enviar código, faça um fork, crie uma branch para sua alteração e abra um pull request para main. Prefira uma aula ou correção por contribuição.

Faça mudanças pequenas e verificáveis. Use dados e marcas fictícios em simulações. Não inclua relatos, credenciais ou dados de participantes. Não invente resultados de uso ou aprendizagem.

Para alterações de código: `npm ci`, `npm run build`, `npm test` e testes de navegador pertinentes. Para Worker: `npm run cf:types`, `npm run cf:check` e `npm run test:worker`. Para operação: `npm run test:ops`. Mídia tem instalação separada em packages/video e segue docs/08. Testes comuns não precisam de credencial de IA.

Mudanças pedagógicas relevantes incrementam a revisão da aula em `packages/content/versions.ts`; correções de grafia não devem apagar progresso. Revalide fontes oficiais e registre o que foi realmente testado em docs/16 e docs/18. Verificação automática de acessibilidade não substitui teclado/leitor de tela.

Ao enviar contribuição, indique autoria e origem dos materiais. Código autoral entra sob MIT; conteúdo educativo sob CC BY 4.0. Materiais de terceiros só podem entrar com permissão/licença compatível e aviso preservado. Não publique nem implante mudanças automaticamente; essas ações dependem de autorização do responsável pelo projeto.

O repositório é público. Não há prazo garantido de revisão de contribuições nem atendimento humano aos alunos. Nunca use um relato público para enviar vulnerabilidade sensível, tokens ou dados pessoais; consulte SECURITY.md.

Informe se utilizou IA e o que realmente conferiu; texto gerado não prova verificação factual. Não habilite serviços pagos ou o assistente público em uma contribuição de conteúdo. Atribuição e licença de materiais devem ser preservadas; isso não exige trailer de coautoria nos commits.
