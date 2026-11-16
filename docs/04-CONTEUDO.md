# Conteúdo e edição incremental
## Esquemas
Course: id, slug, title, description, audience, objectives[], estimatedMinutes, status (draft/published), version, lessons[].
Lesson: id, title, objective, estimatedMinutes, prerequisites?, blocks[], sources[], reviewedAt, contentVersion.
Block: id, type (explanation/demo/challenge/summary), heading, body, mediaRef?, simulationRef?, exerciseRef?, transcript?.
Exercise: id, objective, scenario, options[], correctOptionIds[], rationale de cada opção, hints[], retryPolicy, accessibilityDescription.
Source: id, publisher, title, url, accessedAt real, reviewedAt, supportedClaims[], reviewDueAt.
Media: id, sourceComposition, duration, aspectRatio, poster, renditions[], captions?, transcript, rights.

## Validação no build
IDs únicos; referências válidas; ao menos uma correta; explicação de todas as opções; fonte para afirmação verificável; alternativa de mídia; rotas válidas; rascunhos fora do catálogo e da IA. Sem HTML/JavaScript arbitrário em conteúdo.

## Padrão
Uma ideia → demonstração → decisão → consequência ilustrada → explicação → repetição → resumo.

## Publicação
Adicionar conteúdo, validar, revisar fontes/linguagem, testar renderização e só depois atualizar catálogo e índice da IA. IDs persistentes; migração explícita. Correções pequenas não apagam progresso. Diferenciar completou, praticou e primeira/final tentativa. Não confundir nota com imunidade a golpes.