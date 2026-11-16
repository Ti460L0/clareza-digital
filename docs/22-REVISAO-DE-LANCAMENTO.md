# Revisão de lançamento — 15/11/2026

Auditoria dos critérios de `13-QUALIDADE.md` na implementação local. Não é aprovação de lançamento. Windows, Node 24.19, Chromium do Playwright; nenhum participante ou resultado de campo foi medido.

| Critério | Evidência e estado |
|---|---|
| Fontes sustentam afirmações e foram revalidadas | Fontes oficiais registradas por aula com data e escopo. Leitura editorial das 13 aulas e 26 questões concluída nesta revisão. Guias ainda exigem inspeção das interfaces reais; não marcar aprovação integral. |
| Sem promessas de detector infalível ou garantias financeiras | Texto revisado: detector e aparência têm limites; MED não garante devolução; curso não garante imunidade a golpes. |
| Sem generalização de cadeado, WhatsApp, erros ou aparência | Texto distingue conexão HTTPS de legitimidade; admite comunicações institucionais legítimas e confirmação independente. |
| Alternativas explicadas, sem rascunhos publicados | Schema e percurso das 26 questões verificam explicações; 13 aulas presentes. |
| Rotas, voltar, retomar, reiniciar e migração | Rotas diretas no Workers local, retomada, reinício e migração testados. Revisão manual da navegação de retorno pendente. |
| Armazenamento bloqueado | E2E desktop/mobile confirma estudo e aviso sem persistência. |
| Simulações isoladas | Endereços fictícios sem navegação externa ou formulário de senha/pagamento. Pergunta do simulador permanece em memória; não é IA real. |
| Curso sem IA e sem vídeo | Percursos completos dos dois cursos com assistente indisponível; mídia somente sob demanda e alternativa textual. |
| Verificação automática de acessibilidade | Axe nos percursos e consultas sem violações nas regras exercitadas. Não equivale a conformidade WCAG integral. |
| Teclado, foco e leitura | Teclado no quiz, feedback, repetição e títulos testados. Ordem de leitura assistiva precisa de revisão manual. |
| Leitor de tela | Pendente. Controle visual falhou na inicialização, inclusive após reset; nenhuma experiência com leitor de tela foi simulada como verificação. |
| Reflow, zoom, contraste, movimento | 320 px, fonte ampliada a 200%, regras automáticas de contraste e redução de movimento testadas. Zoom nativo e inspeção visual manual pendentes. |
| Nada essencial só por cor/áudio/animação | Respostas explicadas em texto; vídeos sem áudio, com roteiro estático; decisões não dependem exclusivamente de cor. |
| Transcrição com ações visuais | Texto e composição compartilham roteiro; quadros renderizados inspecionados. Leitura em aparelho real pendente. |
| Avaliação legítima/adversarial de IA | 30 casos e runner preparados; nenhuma chamada real executada. Pendente modelo, preços, teto autorizado, credencial e revisão dos resultados. |
| Referências do assistente | IDs e citações literais contra trechos recuperados, caminhos construídos pelo servidor; testes negativos e de interface. Qualidade semântica real pendente. |
| Segredos em frontend/Git/logs | Busca por padrões de chaves conhecidas e chaves privadas sem achados nos arquivos não ignorados e no dist. Não há arquivos rastreados/commits; exemplos privados e dados são ignorados. Busca por padrões não garante ausência universal. Logs reais de infraestrutura não disponíveis. |
| Limites, orçamento, timeout e desligamento | Testes de API e persistência; quatro processos reais disputaram teto e vaga sem ultrapassá-los. Docker/VPS e provedor reais pendentes. |
| Saída sem execução HTML; sem busca de URL | Renderização textual, validação de destinos internos, provedor com endpoint fixo e sem ferramentas; testes de rejeição. |
| Indisponibilidade clara | E2E de falha e cancelamento; cursos continuam. Resposta simulada só nos testes e no simulador identificado. |
| Desempenho | Build: JS 136,15 KB gzip, CSS 2,95 KB gzip; vídeos não carregam inicialmente. LCP, rede limitada e aparelho modesto ainda não medidos. Chrome DevTools MCP solicitado. |
| Direitos e reprodução | MIT/CC BY 4.0 autorais, oito licenças de produção preservadas, comandos documentados. Elegibilidade Remotion pendente. Auditoria npm sem alertas após correção de minimatch da ferramenta de lint. |
| Privacidade real | Texto descreve progresso local, envio opcional, memória da conversa, reservas/IP derivado e retenção do provedor. Conferir logs e configuração efetiva antes de publicar. |
| Implantação e rollback | Procedimentos preparados; Docker ausente, VPS/Cloudflare não alterados. Não testados operacionalmente. |
| Evidências acadêmicas | Sem alegações de participantes, eficácia, diagnóstico ou impacto medido. Evidências atuais são técnicas locais. |

## Pendências de ambiente e decisões

- Revisão visual: ferramenta de controle da sessão precisa voltar a funcionar; leitor de tela e zoom nativo ainda não testados.
- Desempenho: conector Chrome DevTools indisponível, sem números de LCP inventados.
- Remotion: confirmar enquadramento do responsável nos termos da licença; pergunta já apresentada ao usuário.
- IA: definir modelo/preços/teto de avaliação e fornecer credencial fora do Git. Não enviar chave no chat. Executar avaliação real antes de aprovar qualidade.
- Operação: ambiente Docker, inventário da VPS e da conta Cloudflare, HTTPS do backend e autorização final antes de mudanças remotas.

O contador público de visitantes únicos não foi acrescentado: consolidar pessoas/navegadores distintos exige serviço compartilhado. Não foi substituído por número fictício ou contador apenas deste aparelho.

## Atualização de escopo e evidência

Em 15/11/2026 o usuário restringiu IA a custo zero e autorizou lançamento sem assistente se não houver opção gratuita viável; avaliação OpenAI paga deixa de ser pendência exigível. Investigação gratuita ainda em andamento. Acesso à VPS e autenticação Cloudflare encontrados e conferidos; não falta acesso SSH, mas instalação/publicação continuam não autorizadas. Navegação pelo histórico e preservação de etapa confirmadas em seis execuções desktop/mobile, incluindo foco dentro do conteúdo retornado. Demais pendências manuais permanecem.

Build padrão sem assistente verificado no Workers local: quatro testes passaram, incluindo as 13 aulas sem chamadas à API de IA e privacidade correspondente. Nesse modo, não é necessário instalar a API na VPS. O frontend de validação da integração futura é habilitado explicitamente apenas nos testes; dez E2E focados passaram. Plano Workers da conta não confirmado porque consulta de assinaturas retornou 403; nenhum gasto/inferência autorizado ou realizado.

Em 16/11/2026: uso pessoal acadêmico confirmado, elegível à licença gratuita instalada Remotion 4.0.543. Oito capturas do build foram inspecionadas e corrigida quebra da numeração no índice; cinco testes Workers passaram. Revisão visual por capturas está documentada em 16-STATUS; leitor de tela e zoom nativo permanecem pendentes. Usuário confirmou Workers Free e triagem real foi realizada conforme documento 23; candidatos não aprovados, publicação continua sem IA. Essas evidências substituem os estados históricos de licença/plano desconhecidos acima.
