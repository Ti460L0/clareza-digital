# Operação, publicação e código aberto
## Implantação
Escolher hospedagem após verificar suporte SPA/rotas, HTTPS, cache, API, preço e limites atuais. Não criar conta, contratar serviço ou registrar domínio automaticamente. Entrega de planejamento não é ordem de publicação.
Pipeline: lockfile → validação de conteúdo → lint/typecheck → testes → build → revisão de segredos/bundle → prévia → testes de acessibilidade/mobile → publicação autorizada.
Vídeo renderizado separado do build comum; arquivos grandes em storage/release apropriado. Fontes editáveis versionadas. CI de contribuições externas não recebe segredos.

## Segurança
HTTPS, CSP adequada, política de referrer/frame, poucos terceiros e dependências revisadas. API com schema, corpo limitado, timeout, rate limit compartilhado, orçamento e erros sem segredos. Nunca buscar URLs do usuário. CORS não é autenticação.

## Manutenção
Monitorar disponibilidade, falha e custo sem gravar texto pessoal. Feature flag desliga IA; cursos continuam. Backup de conteúdo/configuração sem segredos; rollback por versão de build. Atualizar dependências com verificações.
Revisar fontes e instruções antes de publicar e periodicamente; mudanças de interface/legislação/canais exigem revisão prioritária. Mostrar data de atualização do material.

## Licenças propostas
MIT para código e CC BY 4.0 para conteúdo autoral, ainda sujeitas à escolha. Inventário de dependências, modelos, fontes, vídeos, capturas e vozes. Não relicenciar material de terceiros sem direito. Criar LICENSE, CONTENT-LICENSE, CONTRIBUTING, CODE_OF_CONDUCT e SECURITY quando definidos termos e contatos reais. Nunca inventar canal de reporte privado.

## Publicação GitHub
Revisar segredos/histórico/dados, README de uso e configuração, limitações das simulações e IA. Marcas fictícias; nenhum dado de aluno. Código público não deve enfraquecer controles do servidor. Não confundir intenção open source com autorização para expor dados de terceiros.