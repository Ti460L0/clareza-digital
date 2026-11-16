# Experiência e acessibilidade
Meta: WCAG 2.2 AA, com verificação manual e automática; não alegar conformidade só por ferramenta.

## Rotas
/, /cursos, /cursos/:slug, /cursos/:slug/aulas/:lesson, /praticar, /preciso-de-ajuda, /fontes, /privacidade, /sobre.
Ajuda é conteúdo automático, não atendimento humano.

Implementado: `/cursos/:courseId/aulas/:lessonId/consulta` entrega material independente com resumo e fontes, adequado à impressão. A página `/preciso-de-ajuda` reúne primeiros cuidados nas quatro situações e preservação de evidências sem formulário nem coleta de dados. A impressão oculta navegação e controles, mantém URLs das fontes e usa margens A4.

Aula: título, objetivo, posição, bloco principal, voltar/continuar e índice. Modo apresentação usa o mesmo conteúdo e teclado; leitura contínua disponível. Sem carrossel automático.

## Requisitos
- Texto base proposto 20px, espaçamento confortável e largura moderada.
- Botões propostos 44x44 CSS px ou maiores, com espaço e rótulos claros.
- Contraste AA; nada depende só de cor/som/ícone.
- Zoom 200%, reflow 320 CSS px e ampliação maior sem perda essencial.
- HTML semântico, foco visível, link para pular, ordem e rótulos corretos.
- Feedback anunciado sem excesso; foco restaurado após navegação.
- Sem cronômetro, autoplay sonoro, flashes ou arrastar obrigatório.
- prefers-reduced-motion; alternativa estática/textual para animações.
- Simulações com botões e teclado, não só canvas/vídeo.
- Vídeos com controles, transcrição das ações e legendas quando aplicáveis.
- Áudio sintético opcional; voz do navegador varia e não é dependência.
- Português simples, respeitoso e sem infantilização.

## Estados
Primeiro acesso; em construção; retomada; conclusão; reset; armazenamento bloqueado; versão incompatível; offline; mídia indisponível; IA carregando/limitada/indisponível; resposta insuficiente.

## Visual
Acolhedor, legível, pouca decoração e ilustrações funcionais. Identidade centralizada para renomeação. Mobile primeiro. Testar tarefas reais sem exigir depoimento ou formulário de feedback do público.
