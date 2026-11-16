# Prompts reutilizáveis

Substitua os campos entre colchetes. Anexe somente textos e fontes que pode compartilhar. Não envie dados pessoais, chaves ou conversas privadas. IA ajuda a preparar rascunhos; não comprova fontes, testes ou qualidade final. Use o [guia de contribuição](25-GUIA-DE-CONTRIBUICAO.md).

## 1. Criar uma aula

```text
Prepare um rascunho de aula para o Clareza Digital.
Tema: [TEMA]. Curso: [SEGURANÇA OU IA].
Objetivo observável: [O QUE O ALUNO APRENDERÁ A FAZER].
Fontes consultadas: [TÍTULO, URL, DATA REAL E AFIRMAÇÃO SUSTENTADA].
Conteúdo/trechos autorizados: [COLE AQUI].

Siga CONTRIBUTING.md e docs/25-GUIA-DE-CONTRIBUICAO.md.
Use português brasileiro simples e adulto, sem infantilizar ou culpar quem erra.
Entregue:
1. Título e objetivo.
2. De três a cinco blocos curtos, uma ideia por bloco.
3. Exemplo cotidiano explicitamente fictício e uma ação concreta.
4. Duas questões de decisão, com três alternativas e exatamente uma recomendada
   em cada; explique o motivo e a consequência de TODAS as opções.
5. Resumo com três ou quatro ações e orientação quando não for possível confirmar.
6. Relação entre afirmações verificáveis e fontes fornecidas.
7. Pendências e sugestão de atividade sem coleta de dados.

Não invente referências, estatísticas, interfaces, testes ou resultados.
Não prometa proteção absoluta, detector infalível ou recuperação de dinheiro.
Não acrescente cadastro, certificado, suporte humano ou serviço pago.
Não use links maliciosos nem peça dados reais. Preserve alternativa textual.
Se faltar evidência, marque PENDENTE em vez de preencher por suposição.
Não inclua o rascunho no catálogo nem publique automaticamente.
```

Exemplo de preenchimento: tema “Conferir um pedido de código”; curso “Segurança”; objetivo “Confirmar a origem de um pedido por um canal conhecido”. Consulte a fonte antes de preencher a data; não copie datas de exemplo como se fossem uma revisão nova.

## 2. Vídeo narrado no NotebookLM

Use somente o texto aprovado da aula correspondente, com ressalvas e referências. Selecione sua fonte isoladamente no notebook.

```text
Crie um vídeo educativo narrado em português brasileiro para a aula [TÍTULO],
com objetivo [OBJETIVO]. Use somente a fonte selecionada.
Público adulto leigo, inclusive pessoas idosas. Tom calmo, respeitoso,
frases curtas, pausas e nenhuma infantilização.

Vídeo completo: alvo de 3 a 5 minutos, sem acrescentar fatos para preencher tempo.
Prefira vertical 9:16 se o formato escolhido oferecer essa opção.
Se não oferecer, mantenha o formato nativo legível, sem recortar conteúdo.
Para complemento curto, explique somente [UMA IDEIA] em cerca de 60 segundos.

Abra com uma situação cotidiana identificada como fictícia.
Explique o conceito; compare uma decisão recomendada com uma que merece cuidado
e narre os motivos. Faça uma pergunta, ofereça pausa e explique a resposta.
Termine com três ações concretas e convide à atividade da aula.

Poucas palavras grandes por quadro, uma ideia por cena e alto contraste.
Verde escuro e creme como base, azul nas explicações e âmbar nos alertas.
Combine cores com rótulos e símbolos. Narre toda informação visual essencial.
Não leia parágrafos longos; evite música que concorra com a fala.

Preserve incertezas e ressalvas. Não invente fontes, estatísticas, marcas,
interfaces atuais ou garantias. Não apresente a ferramenta como parceira do projeto.
Não solicite dados pessoais nem convide a acessar endereços fictícios.
```

Escolha vídeo completo ou complemento curto conforme sua entrega. Confirme as dimensões exportadas: o prompt não altera necessariamente o formato do serviço. Legendas e transcrição devem acompanhar o áudio final; mantenha o texto da aula disponível.

## 3. Resumo e cartões

```text
Com base somente na aula [TÍTULO/TEXTO], prepare:
- Resumo com três ideias e três ações práticas.
- Cinco cartões com pergunta curta e explicação no verso.
- Uma confusão comum, seu risco e um caminho mais seguro.
Use português brasileiro simples e adulto. Identifique exemplos fictícios.
Não crie fatos ou referências; mantenha as ressalvas da aula.
Não confunda material gerado com conteúdo revisado ou publicado.
```

## 4. Revisar o rascunho

```text
Revise o rascunho conforme o padrão do Clareza Digital.
Entrada: [TEXTO, OBJETIVO, QUESTÕES, FONTES E ORIGEM DOS MATERIAIS].
Confira alinhamento com o objetivo, linguagem adulta, clareza das ações,
exemplos fictícios, uma única recomendada por questão, motivos de todas as opções,
ressalvas, alternativa sem vídeo/IA, direitos de uso e ausência de dados pessoais.
Relacione afirmações verificáveis às evidências fornecidas.
Se não conseguir abrir uma fonte, diga isso; não declare que a verificou.
Liste problemas concretos e sugestões de reescrita. Separe o que foi conferido
do que depende de consulta humana ou teste no site. Não afirme aprovação de
acessibilidade, teste executado ou vídeo revisado sem evidência correspondente.
Não publique, habilite serviços ou altere IDs existentes automaticamente.
```

Esse roteiro é para novas contribuições; não declara revisão adicional dos vídeos já publicados. Registre no PR o que de fato fez e o que está pendente.
