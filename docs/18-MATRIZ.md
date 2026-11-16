# Matriz de lançamento — 14/11/2026

Parcial não significa concluído. Evidências em docs/16-STATUS.md.

Atualização de 15/11/2026: usuário exige IA a custo zero e autoriza lançamento sem assistente se não houver alternativa gratuita viável. Build público atualmente sem tutor/API de IA, verificado nas 13 aulas. Linhas de assistente e VPS abaixo registram a integração preparada e suas pendências, condicionais à ativação futura; não exigem contratar provedor ou instalar backend numa publicação sem IA.

| Requisito | Implementação | Verificação | Pendência |
|---|---|---|---|
| Website PT-BR/mobile | apps/web | Build, Axe, 320 px, teclado do quiz e texto 200% em cinco rotas; 38 E2E totais | Leitor de tela, zoom nativo, revisão manual |
| Segurança S1–S6 | packages/content, seis aulas | Percurso E2E completo desktop/mobile | Revisão editorial e manual final |
| IA I1–I7 | packages/content, sete aulas | Percurso E2E completo desktop/mobile, sem POST | Revisão editorial e manual final |
| Slides/resumo/consulta | Treze aulas, treze materiais independentes e consulta rápida após incidente | 4 E2E desktop/mobile; amostras PDF de ajuda (2 páginas) e S1 (1 página), renderizadas e inspecionadas | Revisão editorial final dos demais materiais |
| Quizzes | 26 questões, todas as alternativas explicadas | E2E e schema | Revisão editorial final |
| Simulações | SMS/página/endereços/homógrafos/familiar/central/IA/notícia | Percursos E2E | Revisão manual |
| Remotion | Seis MP4, capas PNG, transcrição HTML compartilhada com roteiro | Decodificação, duração, dimensões e busca início/meio/fim; falha de mídia; licença individual confirmada pelo uso pessoal acadêmico | Revisão de leitura em aparelho real |
| Guias de IA | AccessGuide, fontes oficiais ChatGPT web/Android/iPhone | Aulas E2E, links consultados | Inspeção final das interfaces reais |
| Assistente | API local, recuperação, validação, adaptador OpenAI, reservas SQLite obrigatórias, proxy Worker e interface opcional | Suíte de 73 testes passou; depois 11 testes de limites passaram, incluindo dois novos casos com quatro processos reais; HTTP local e 6 E2E com transporte simulado | 30 casos de qualidade e provedor real; operação no contêiner |
| Progresso | progress.ts, formato 2, revisões/arquivo e última aula | Migração 1→2, revisão pedagógica, rollback/futuro preservado, retomada e reset E2E desktop/mobile | Revisão manual final |
| Segurança/desempenho | Controles de API/proxy, CSP e demais cabeçalhos | Build, testes negativos e CSP em Workers local | LCP, revisão final e ambiente público |
| Workers/domínio | wrangler.jsonc, assets e proxy; não provisionado | Tipos, dry-run produção com 19 arquivos e 5 testes Workers; zona ativa, nome do Worker livre | Autorização, DNS específico e produção |
| VPS Docker | Dockerfile, Compose, healthcheck, backup e guia operacional | Build Node e teste real de backup SQLite; Docker ausente | Build/execução Docker, inventário VPS, restore/rollback operacional e produção |
| Código aberto | MIT, CC BY 4.0, avisos de dependências, contribuição/conduta/segurança | Inventário de 8 dependências de produção; npm sem alertas conhecidos após correção; busca de padrões de segredos; elegibilidade Remotion confirmada | Canal privado antes da publicação do repositório; revisão final dos arquivos a versionar |
| Produção | Não publicada | Nenhuma | Revisão, autorização, domínio/backend reais |
| Contador sem backend | Não incluído | Viabilidade analisada | Total público requer serviço; sem rastreamento |
