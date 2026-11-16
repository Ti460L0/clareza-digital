# Materiais e dependências de terceiros

Revisão local: 15/11/2026. Este arquivo não declara concluída a auditoria de lançamento.

## Código em produção
React, React DOM, Scheduler, React Router, React Router DOM, Zod, cookie e set-cookie-parser mantêm licença MIT, conforme os arquivos instalados pelo lockfile. Os textos completos e avisos de copyright estão preservados em `apps/web/public/third-party-notices.txt`, distribuído com o site, e o inventário de versões em `docs/licenses/runtime-inventory.json`.

`node scripts/license-notices.mjs` regenera esse material a partir do lockfile e dos pacotes instalados. O script interrompe se encontrar licença diferente ou aviso ausente: mudanças de dependência exigem nova revisão. A imagem Node e a infraestrutura mantêm suas próprias licenças; não são relicenciadas por este projeto.

## Produção de vídeo
Remotion 4.0.543 usa licença própria, **não MIT**. O texto instalado está em `packages/video/node_modules/remotion/LICENSE.md`; consulta oficial: https://www.remotion.dev/pricing . Ele permite uso gratuito a indivíduos, organizações com fins lucrativos de até três funcionários e organizações sem fins lucrativos, além da situação de avaliação prevista no texto. Em 16/11/2026, o responsável confirmou projeto pessoal para a disciplina Sistemas da Informação e Sociedade do curso de Engenharia de Software. Esse enquadramento individual atende à licença gratuita da versão usada; nenhuma licença foi comprada. Reavaliar se o responsável ou enquadramento mudar.

A MIT deste repositório cobre o código autoral das composições, não o motor Remotion nem uma derivação dele. O site entrega MP4 pré-renderizado e não inclui Remotion Player ou renderização por visitante. Os vídeos são cenas e textos autorais; não contêm música, voz sintética, fotografias de banco ou gravação do autor. Atualizar Remotion exige revisar novamente sua licença.

## Fontes, interfaces e imagens
Os guias de ChatGPT remetem às páginas oficiais e às lojas. Não foram redistribuídas capturas de interfaces ou logotipos dos produtos. As marcas são citadas para identificar a ferramenta ensinada, sem alegação de parceria. PDFs oficiais são referências externas; não foram incorporados como conteúdo autoral licenciado pelo projeto.

O site usa fontes de sistema, sem arquivo de fonte de terceiros distribuído. As composições usam fontes disponíveis no ambiente de renderização; a distribuição é de pixels renderizados, não dos arquivos de fonte. Não há cessão de direitos sobre fontes de sistema. Ícones/ilustrações do portal são elementos de código autorais e os exemplos de marcas/dados são fictícios.

## Ferramentas de desenvolvimento
Vite, TypeScript, Vitest, Playwright, Axe, Wrangler e ferramentas do projeto de mídia têm licenças próprias preservadas pelos pacotes. Não distribuir `node_modules` junto ao código autoral ou tratar ferramentas de build como MIT do projeto. Revisar avisos e dependências transitivas ao atualizar. O runtime Docker final contém apenas bundle da API, avisos e script de backup, além da imagem oficial Node.
