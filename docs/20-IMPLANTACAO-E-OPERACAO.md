# Implantação e operação — 15/11/2026

## Publicação vigente — 16/11/2026
Frontend autorizado e publicado em https://clarezadigital.cod4ti.com, versão Workers `208230bc-e039-4f69-940a-d6bbd24fb9b6`. Sem assistente/credenciais/backend, sem alterações na VPS. Comandos Docker abaixo são preparação histórica para eventual integração futura. Atualização: build com `VITE_ASSISTANT_ENABLED=false`, depois `npx wrangler deploy --env production`. Conferência pública: `npx playwright test --config playwright.production.config.ts`. Não presumir console limpo: CSP bloqueia scripts injetados pela borda conforme registro em 16-STATUS. Manter política restrita e avaliar configuração específica do hostname sem alterar os demais sites. Não houve teste de rollback; primeira versão serve de referência para futuras reversões.

## Situação e autorização
Configuração preparada e validada localmente. Nenhuma implantação, alteração DNS ou instalação na VPS realizada. Docker não está disponível neste computador: build/execução/healthcheck do contêiner continuam pendentes. Os comandos de produção abaixo são procedimentos para depois da revisão e autorização, não evidência de execução.

## Arquitetura entregue
Workers Static Assets serve `dist` e as rotas SPA. Só `/api` e `/api/*` passam primeiro pelo Worker. O proxy aceita apenas status e tutor, constrói cabeçalhos próprios e encaminha para uma única origem HTTPS configurada. `BACKEND_ORIGIN` está vazio até o inventário da VPS: sem configuração, IA retorna indisponível. O curso funciona normalmente.

API Node 24 em Docker, porta publicada apenas em `127.0.0.1:8788` da VPS. Um proxy HTTPS já existente deverá encaminhar exclusivamente os endpoints necessários. Não instalar outro proxy, abrir firewall ou escolher um hostname sem inspecionar o ambiente. O segredo compartilhado entre Worker e API não é a chave OpenAI. Não encaminhar cookies ou autorização do visitante.

O Worker usa `CF-Connecting-IP` da borda e rejeita subrequisições com `CF-Worker`, pois IPs em subrequisições têm regras diferentes. Não confiar em `X-Forwarded-For` recebido do navegador. A API só aceita o IP próprio do proxy após autenticação por segredo e origem exata. Essa fronteira exige teste público após implantação; CORS não é autenticação. O limite global de custo permanece obrigatório mesmo se atacantes conseguirem contornar o agrupamento por IP.

## Verificações locais
```sh
npm ci
npm run build
npm run api:build
npm test
npm run test:ops
npm run cf:types
npm run cf:check
npm run test:worker
```
`cf:check` termina em dry-run e não publica. `test:worker` inicia um Workers local se não houver um na porta 8787. A ausência de segredo local é esperada para testar IA desligada. API real local: README e `.env.example`. Não usar chave real nos testes automatizados comuns.

Tipos do Worker são gerados pelo Wrangler e verificados separadamente, para não misturar APIs do navegador, Node e runtime Cloudflare. Regerar após mudar bindings. A configuração contém ambiente `production`, custom domain e `workers.dev`/URLs de prévia desativados.

## Inventário antes da implantação
Após receber o acesso necessário, verificar em modo somente leitura: conta/zona Cloudflare, DNS atual de `clarezadigital.cod4ti.com`, Workers existentes e limites do plano; sistema/arquitetura da VPS, Docker/Compose existentes, CPU/RAM/disco livre, portas ocupadas, proxy/certificados/firewall e volumes. Não listar valores de segredos nem copiar configuração de outros serviços para o repositório. Registrar só informações operacionais necessárias, sem endereços privados ou identificadores sensíveis no Git público.

Definir o hostname HTTPS do backend conforme esse inventário e configurar `BACKEND_ORIGIN` de produção com a origem exata, sem caminho. `PUBLIC_ORIGIN` deve coincidir com o site. O backend não recebe tráfego de navegador diretamente. Restringir o proxy a `/api/status` GET e `/api/tutor` POST, corpo máximo 16 KB, timeout compatível com 23 segundos do Worker, sem registrar corpo/Authorization. Revisar retenção dos logs técnicos da infraestrutura e ajustar a página de privacidade antes de publicar.

## Docker na VPS — depois de autorizado
1. Usar uma pasta própria do projeto. Copiar código revisado e criar `.env` protegido (`chmod 600 .env`) com dois segredos aleatórios distintos. Nunca usar os valores fictícios dos exemplos. Manter `AI_ENABLED=false` até concluir a avaliação e configurar modelo, preços e orçamento aprovados.
2. Definir `PUBLIC_ORIGIN=https://clarezadigital.cod4ti.com`. Compose define HOST/PORT/DATABASE_PATH internos; não alterar portas ou redes de outros serviços.
3. Definir uma etiqueta imutável de versão em `RELEASE_TAG` e registrar o digest oficial da imagem Node em `NODE_IMAGE`. A tag `node:24-bookworm-slim` é a base inicial, não prova de reprodutibilidade futura. Guardar lockfile e digest junto à versão. Dimensionamento inicial 256 MB/1 CPU deve ser revisto conforme a VPS e teste de carga.
4. Executar `docker compose config --quiet` (não imprimir configuração resolvida, que inclui segredos), `docker compose build api` e `docker compose up -d --no-deps api`. Conferir `docker compose ps` e saúde local em `http://127.0.0.1:8788/health`. Health verifica o processo, não a qualidade/disponibilidade da IA.
5. O contêiner usa usuário sem root, raiz somente leitura, volume persistente e capacidades removidas. Banco não tem porta de rede. A imagem final contém bundle Node e script de backup; não contém `.env`, fontes do site, dependências de desenvolvimento ou chave do provedor.
6. Integrar o proxy HTTPS existente, testar certificado e verificar rejeição de chamada sem segredo. Registrar imagem anterior e volume; não apagar volumes com `down -v`.

## Workers — depois de autorizado
Confirmar conta e zona antes de executar mutações. Instalar o segredo com `npx wrangler secret put API_SHARED_SECRET --env production` por entrada segura; não colocá-lo na linha de comando, em `vars` ou no bundle. Registrar IDs de versões anteriores via `npx wrangler versions list --env production`.

Após configurar backend HTTPS e testar localmente, executar `npm run cf:check` e então `npx wrangler deploy --env production`. Esse último comando pode alterar o custom domain; exige autorização de publicação/DNS já prevista no pedido. Validar HTTPS, rotas diretas das 13 aulas, mídia, política de segurança, indisponibilidade da IA e integração real. Não marcar lançamento concluído antes desses testes públicos.

## Backup consistente
Conteúdo e código são versionáveis; SQLite guarda apenas reservas/metadados de uso, sem conversa. Cópia simples do `.sqlite` durante escrita pode perder o WAL: usar `backup-db.mjs`, que faz snapshot consistente e `integrity_check`. O destino precisa ser novo; o script não sobrescreve backup anterior.

Exemplo dentro do contêiner (trocar a data/hora a cada execução):
```sh
docker compose exec -T api node backup-db.mjs /app/data/backups/usage-20261115-120000.sqlite
```
Copiar esse arquivo para diretório privado fora do volume com `docker compose cp api:/app/data/backups/usage-20261115-120000.sqlite ./private/backups/usage-20261115-120000.sqlite` após criar o diretório. Guardar cópia externa protegida, separada da VPS; não contratar destino automaticamente. Backup dentro do mesmo volume não protege contra perda da VPS. Segredos precisam de cópia segura separada, nunca no Git. Definir retenção e testar restauração antes de confiar no procedimento.

## Atualização e rollback
Antes de atualizar: verificar testes, salvar backup, registrar etiqueta/digest anterior e estado do volume. Criar nova etiqueta, `docker compose build api`, depois `docker compose up -d --no-deps api`. Verificar saúde, status, limites e chamada controlada. Não executar migração destrutiva automaticamente.

Se falhar, selecionar a etiqueta anterior em `RELEASE_TAG` e executar `docker compose up -d --no-deps --no-build api`; preservar o volume atual. Na Cloudflare, usar `npx wrangler rollback ID_DA_VERSAO --env production` para uma versão previamente registrada. Testar compatibilidade entre frontend, Worker e API; rollback não apaga gastos já realizados.

Restauração de dados é uma operação distinta: desligar a IA, parar a API e conservar o volume atual intacto. Restaurar o snapshot validado em um **volume novo**, com proprietário UID 1000 e permissão 600 para o arquivo, sem reaproveitar arquivos `-wal`/`-shm` antigos. Apontar um override de Compose para esse volume e iniciar ainda com IA desligada. Conferir integridade e reservas. Um backup antigo perde gastos posteriores: reconciliar o período com o provedor ou manter orçamento zero até ajustar o saldo. Só reativar após essa reconciliação. O teste local comprova snapshot e leitura dos valores; a restauração em Docker e o rollback implantado ainda não foram executados.

## Mídia e manutenção
Cada MP4 tem aproximadamente 0,48–0,66 MB e só é solicitado por escolha do aluno. Workers Static Assets não atende intervalos Range: entrega o arquivo completo com 200. Reprodução e avanço foram verificados localmente com esse comportamento; para mídias grandes futuras, reavaliar distribuição sem presumir outro serviço contratado. Não há streaming adaptativo.

Revalidar preços/modelo antes de habilitar IA, acompanhar consumo no provedor e manter limites também no projeto da conta. Para desligar: `AI_ENABLED=false` no backend e recriar somente o serviço API. Conteúdo permanece acessível. Rever fontes, links, dependências, licenças e retenção antes de cada release. Monitorar saúde HTTP e erros sem armazenar perguntas; alertas/notificações externas dependem de autorização específica.

## Referências oficiais consultadas
- [SPA no Workers](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/) e [cabeçalhos estáticos](https://developers.cloudflare.com/workers/static-assets/headers/).
- [Limitações de arquivos estáticos, incluindo Range](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/).
- [Cabeçalhos Cloudflare e subrequisições](https://developers.cloudflare.com/fundamentals/reference/http-headers/).
- [Serviços Docker Compose](https://docs.docker.com/reference/compose-file/services/) e [imagem oficial Node](https://github.com/nodejs/docker-node).
- [Backup SQLite no Node 24](https://nodejs.org/download/release/v24.19.0/docs/api/sqlite.html#sqlitebackupsourceDb-path-options).
