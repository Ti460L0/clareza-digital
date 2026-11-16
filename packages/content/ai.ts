import type { Lesson } from "./index";
import { q, lesson } from "./authoring";
export const aiLessons: Lesson[] = [
  lesson(
    "o-que-ia-faz",
    "O que uma IA faz",
    "Distinguir uma resposta útil de uma afirmação que precisa ser conferida.",
    ["cert-ia", "ai-truth"],
    [
      [
        "Uma ferramenta para trabalhar com informações",
        [
          "Sistemas de IA podem gerar textos, imagens, voz e vídeo. Um chatbot recebe uma pergunta ou instrução e produz uma resposta a partir de padrões aprendidos e do contexto disponível.",
          "Você pode usá-lo para explorar uma ideia, organizar um texto ou pedir uma explicação mais simples. O resultado ainda precisa de leitura e avaliação.",
        ],
      ],
      [
        "Soar convincente não é acertar",
        [
          "Exemplo inventado: um assistente explica uma palavra de maneira clara. Depois afirma que uma biblioteca da cidade abrirá no feriado, mas não apresenta fonte. A clareza da primeira resposta não confirma a segunda.",
          "Modelos podem produzir datas erradas e referências inexistentes. Se a informação muda sua decisão, procure uma fonte que realmente a sustente.",
        ],
      ],
      [
        "O curso não exige uma conta de IA",
        [
          "Neste curso, o ChatGPT é um exemplo concreto de ferramenta. As orientações podem mudar conforme a versão, o país e o plano. As fontes oficiais estão ao fim das aulas.",
          "Você pode praticar no simulador educativo do portal. Ele usa respostas escritas previamente e informa isso claramente. Não é o assistente generativo do projeto.",
        ],
      ],
    ],
    [
      q(
        "i1-confianca",
        "Uma resposta é bem escrita e parece segura. O que isso indica?",
        [
          [
            "Que todas as afirmações são verdadeiras.",
            false,
            "Uma boa apresentação não comprova os fatos. Modelos também podem expressar erros com confiança.",
          ],
          [
            "Que vale ler, mas conferir afirmações importantes.",
            true,
            "Você pode aproveitar a explicação sem tomar a fluência como evidência. Confira o que afeta decisões.",
          ],
          [
            "Que toda resposta de IA deve ser descartada.",
            false,
            "A ferramenta pode ser útil. O cuidado é avaliar o resultado e reconhecer quando precisa de fonte ou revisão.",
          ],
        ],
      ),
    ],
    [
      "Use a IA como apoio.",
      "Confira fatos importantes fora da resposta.",
      "Não trate confiança no tom como prova.",
    ],
    "ai",
  ),
  lesson(
    "ia-no-navegador",
    "Acessar pelo navegador",
    "Chegar à ferramenta oficial e enviar uma pergunta sem dados pessoais.",
    ["ai-home", "ai-free", "ai-truth"],
    [
      [
        "Comece pelo endereço confirmado",
        [
          "Abra o navegador que você já usa. Digite chatgpt.com na barra de endereço, não em um anúncio. A referência oficial desta aula aponta para esse domínio.",
          "Se aparecer uma página diferente, uma cobrança inesperada ou um pedido que você não entende, pare e confira o endereço. Não use páginas imitadas para informar suas credenciais.",
        ],
      ],
      [
        "Escreva, envie e leia",
        [
          "Na página inicial, encontre o campo de mensagem. Escreva: “Explique o que é uma senha forte em linguagem simples, sem pedir minha senha”. Use o controle de envio ao lado do campo.",
          "Aguarde a resposta terminar, leia e, se necessário, peça um exemplo mais simples. As posições e os rótulos podem variar com o idioma e as atualizações; consulte o guia oficial e suas telas atuais abaixo.",
        ],
      ],
      [
        "Conta, limites e alternativa",
        [
          "O acesso sem conta existe em regiões atendidas, mas pode variar por localização ou rede. Se a tela pedir entrada ou criação de conta, essa etapa ocorre somente no serviço oficial. O Clareza Digital nunca recebe sua senha.",
          "Há uma modalidade gratuita e opções pagas. Recursos têm regras e limites próprios, que podem mudar. Você não precisa assinar nada para concluir este curso; use o simulador quando preferir.",
        ],
      ],
    ],
    [
      q(
        "i2-site",
        "Você quer experimentar a ferramenta. Qual caminho escolhe?",
        [
          [
            "Um anúncio que promete acesso ilimitado mediante taxa.",
            false,
            "O anúncio não confirma que o serviço seja oficial. Confira o endereço e as condições diretamente no provedor.",
          ],
          [
            "Digitar o endereço oficial confirmado ou usar o simulador do curso.",
            true,
            "Você pode chegar ao serviço por um endereço conhecido ou estudar sem uma conta externa.",
          ],
          [
            "Enviar minha senha ao portal para abrir a ferramenta.",
            false,
            "O portal não precisa nem deve receber suas credenciais de outro serviço.",
          ],
        ],
      ),
    ],
    [
      "Use chatgpt.com, conforme a fonte oficial.",
      "Pergunte sem dados pessoais.",
      "Sem conta ou acesso, pratique no simulador.",
    ],
    "ai",
  ),
  lesson(
    "ia-no-celular",
    "Acessar no Android e no iPhone",
    "Encontrar o aplicativo oficial e evitar instalar um imitador.",
    ["ai-mobile", "ai-play", "ai-store", "ai-free"],
    [
      [
        "Android: Google Play",
        [
          "Abra a Google Play e pesquise “OpenAI ChatGPT”. Confira o nome ChatGPT e o publicador OpenAI. O link oficial do aplicativo está no guia desta aula.",
          "Leia compatibilidade e informações de dados na loja; toque em Instalar e, após o download, em Abrir. Se o aplicativo não for compatível, use o navegador ou o simulador. Não instale um APK recebido por mensagem.",
        ],
      ],
      [
        "iPhone: App Store",
        [
          "Abra a App Store e pesquise “OpenAI ChatGPT”. Confira o nome ChatGPT e o desenvolvedor OpenAI OpCo, LLC. Use a página oficial vinculada nesta aula para comparar.",
          "Confira a compatibilidade na loja. Use Obter ou o símbolo de download e siga a confirmação do próprio aparelho. Depois abra o aplicativo. Se pedir autenticação, faça isso no serviço oficial, nunca neste portal.",
        ],
      ],
      [
        "O que observar depois de abrir",
        [
          "A instalação pode ser gratuita e o aplicativo oferecer compras ou planos pagos. Não é necessário contratar um plano para estudar aqui. Requisitos e ofertas vigentes ficam na loja oficial.",
          "Para a prática por texto, não é necessário usar câmera, microfone ou compartilhar a tela. Avalie pedidos de permissão conforme o recurso escolhido. Se não quiser continuar no serviço externo, volte ao simulador.",
        ],
      ],
    ],
    [
      q(
        "i3-app",
        "Dois aplicativos têm nomes parecidos. Qual verificação ajuda?",
        [
          [
            "Escolher apenas o ícone mais conhecido.",
            false,
            "Nome e ícone podem ser imitados. Confira o desenvolvedor e a página oficial.",
          ],
          [
            "Baixar um arquivo enviado por desconhecido.",
            false,
            "Não use arquivos ou APKs recebidos por mensagem para instalar essa ferramenta.",
          ],
          [
            "Conferir a loja oficial e o desenvolvedor indicado no guia.",
            true,
            "A referência oficial ajuda a confirmar a listagem correta antes da instalação.",
          ],
        ],
      ),
    ],
    [
      "Android: publicador OpenAI na Google Play.",
      "iPhone: desenvolvedor OpenAI OpCo, LLC na App Store.",
      "Confira compatibilidade, compras e privacidade na loja.",
    ],
    "ai",
  ),
  lesson(
    "conversar-com-ia",
    "Conversar e proteger informações",
    "Escrever uma instrução clara com o mínimo de dados necessário.",
    ["cert-ia", "ai-data", "ai-truth"],
    [
      [
        "Diga o que você quer aprender",
        [
          "Uma boa pergunta pode incluir a tarefa, o contexto e o formato. Exemplo inventado: “Explique como organizar uma lista de compras para uma pessoa. Use cinco passos curtos”.",
          "Se a resposta ficar difícil, reformule: “Troque os termos técnicos por palavras comuns e mostre um exemplo”. Você também pode perguntar o que ficou incerto.",
        ],
      ],
      [
        "Retire informações que não são necessárias",
        [
          "Não cole senhas, códigos, documentos ou informações privadas de outras pessoas. Para estudar, use situações inventadas e termos genéricos.",
          "Compare: “Meu documento e minha senha são...” não é necessário para pedir uma explicação sobre proteção de contas. Pergunte pelo conceito sem entregar o segredo.",
        ],
      ],
      [
        "Entenda o destino da pergunta",
        [
          "Ao usar o ChatGPT, suas mensagens são processadas pelo provedor. Em configurações pessoais, há controles sobre uso das conversas para melhorar modelos. Consulte Configurações e Controles de dados; rótulos podem variar por idioma.",
          "Desativar o uso para treinamento não impede o processamento necessário para responder nem elimina todos os registros do provedor. Leia as regras do serviço e evite enviar dados sensíveis mesmo assim. No simulador deste curso, a prática fica nesta página e não vai a um provedor.",
        ],
      ],
      ["Pesquisar com um pedido mais claro", [
        "Em vez de escrever apenas “pesquise sobre energia solar”, diga seu objetivo: “Quero entender como funciona a energia solar em uma casa. Sou iniciante. Explique em cinco tópicos curtos e dê um exemplo, sem calcular economia garantida”.",
        "Acrescente: “Se você tiver acesso à pesquisa na internet, mostre fontes e datas para as afirmações principais. Se não puder pesquisar, diga isso e sugira onde conferir”. Pedir uma pesquisa não garante que a ferramenta tenha consultado a internet. Na atividade, monte um pedido de exemplo sem enviar dados a uma IA.",
      ]],
      ["Confira antes de usar a resposta", [
        "Abra as fontes citadas. Confira quem publicou, quando e se o conteúdo sustenta a afirmação. Uma lista de links pode conter páginas inexistentes ou que tratam de outro assunto. Em informações atuais, peça o período e confirme a data.",
        "Se o resultado ficar genérico, refine: “Compare duas possibilidades, separe fatos de sugestões e diga o que ainda precisa ser verificado”. Um prompt mais adequado ajuda a orientar a resposta; não elimina erros nem substitui sua conferência.",
      ]],
    ],
    [
      q('i4-pesquisa', 'Você quer pesquisar um assunto que ainda não conhece. Qual pedido ajuda mais?', [
        ['“Pesquise tudo e garanta que sua resposta está certa.”', false, 'O pedido é amplo e exige uma garantia que a IA não pode dar. Mesmo uma resposta confiante precisa ser conferida.'],
        ['“Sou iniciante. Explique o assunto em cinco tópicos, indique fontes e datas se puder pesquisar e diga o que preciso conferir.”', true, 'O pedido informa contexto, formato e verificação. Depois, abra as fontes; citá-las não comprova que a resposta esteja correta.'],
        ['“Invente uma fonte se não encontrar nenhuma.”', false, 'Uma fonte inventada não serve de evidência. Quando falta informação, a resposta deve reconhecer esse limite.'],
      ]),
      q("i4-prompt", "Qual pergunta é adequada para praticar?", [
        [
          "“Explique autenticação em duas etapas com um exemplo fictício.”",
          true,
          "A pergunta é clara e não precisa expor dados reais para permitir uma explicação.",
        ],
        [
          "“Aqui está minha senha; diga se ela é boa.”",
          false,
          "Não envie uma senha real. Peça critérios gerais e exemplos fictícios.",
        ],
        [
          "“Analise o documento de outra pessoa sem perguntar a ela.”",
          false,
          "Informações de terceiros exigem cuidado. Para estudar, use exemplos sem dados pessoais.",
        ],
      ]),
    ],
    [
      "Descreva tarefa e formato.",
      "Use exemplos fictícios.",
      "Revise a resposta e as opções de privacidade.",
    ],
    "ai",
  ),
  lesson(
    "conteudo-sintetico",
    "Imagens, vozes e vídeos sintéticos",
    "Investigar origem e contexto sem confiar em um detector infalível.",
    ["cert-ia", "boatos", "ai-truth"],
    [
      [
        "Uma imagem não conta toda a história",
        [
          "Uma imagem pode ser gerada, editada ou publicada fora de contexto. Um vídeo real de outro lugar ou outra data também pode induzir a uma conclusão errada.",
          "Neste exercício, as ilustrações e falas são fictícias e identificadas. Elas mostram como uma apresentação convincente pode ser usada para sustentar uma afirmação sem evidência.",
        ],
      ],
      [
        "Erros visuais são pistas limitadas",
        [
          "Mãos estranhas, sombras ou cortes podem chamar atenção, mas não provam sozinhos o modo de produção. A ausência de defeitos também não prova que o registro seja autêntico.",
          "Não use uma porcentagem de detector ou a opinião de um chatbot como veredito final. Procure origem, publicação completa, data e evidências independentes.",
        ],
      ],
      [
        "Como conferir um pedido com voz ou vídeo",
        [
          "Um áudio parecido com o de um conhecido não basta para autorizar um pagamento. Use um contato anterior para confirmar o pedido.",
          "Para uma notícia, localize quem publicou primeiro e procure o contexto completo. Se não houver evidência suficiente, diga “não verificado” e evite compartilhar como fato.",
        ],
      ],
    ],
    [
      q(
        "i5-video",
        "Um vídeo parece perfeito. Isso prova que a notícia é verdadeira?",
        [
          [
            "Sim, porque a IA sempre deixa defeitos visíveis.",
            false,
            "Não existe essa garantia. Um conteúdo real também pode estar fora de contexto.",
          ],
          [
            "Não; preciso investigar origem, data e evidências.",
            true,
            "A aparência é insuficiente para confirmar a alegação. O contexto e a fonte precisam ser conferidos.",
          ],
          [
            "Um detector com porcentagem alta encerra a dúvida.",
            false,
            "Detectores têm limites e podem errar. Uma pontuação isolada não substitui a investigação.",
          ],
        ],
      ),
    ],
    [
      "Aparência não comprova origem.",
      "Conteúdo real pode estar fora de contexto.",
      "Sem evidência, não compartilhe como confirmado.",
    ],
    "news",
  ),
  lesson(
    "investigar-noticia",
    "Investigar uma notícia",
    "Separar alegação, fonte e conclusão de uma checagem.",
    ["boatos", "ai-truth"],
    [
      [
        "Transforme a mensagem em uma pergunta",
        [
          "Exemplo fictício: “O Parque das Nuvens fechará amanhã”. Separe o que é verificável: qual parque, qual data, quem anunciou e por quanto tempo?",
          "Procure a publicação original e veja se a data combina com a mensagem atual. Um recorte pode esconder uma condição importante.",
        ],
      ],
      [
        "Abra as fontes, não apenas a lista",
        [
          "Busque a fonte primária relacionada à afirmação: por exemplo, o comunicado do responsável pelo parque. Se houver checagem jornalística, leia as evidências e o método.",
          "Uma IA pode inventar uma referência. Mesmo uma fonte existente pode tratar de outro assunto. Abra o endereço e confira se o conteúdo sustenta exatamente a conclusão. A concordância entre chatbots não é confirmação independente.",
        ],
      ],
      [
        "Escolha uma conclusão proporcional à evidência",
        [
          "Confirmado: a evidência sustenta a afirmação. Falso: a evidência a contradiz. Enganoso: o recorte ou contexto distorce. Não verificado: falta evidência suficiente. Essas categorias dependem do caso.",
          "Você pode pedir à IA: “Separe as afirmações e diga o que precisa ser confirmado. Se não conseguir verificar, diga isso claramente”. Sem pesquisa atual, não trate a resposta como checagem do que aconteceu hoje.",
        ],
      ],
    ],
    [
      q(
        "i6-fonte",
        "A IA cita um relatório que você não consegue localizar. Como seguir?",
        [
          [
            "Compartilhar, porque o título parece técnico.",
            false,
            "Um título plausível não prova que o relatório exista nem que sustente a afirmação.",
          ],
          [
            "Pedir a outra IA para confirmar e encerrar.",
            false,
            "Dois modelos podem repetir o mesmo erro. Isso não é uma fonte independente.",
          ],
          [
            "Buscar a fonte original e manter como não verificado se faltar evidência.",
            true,
            "Reconhecer a falta de evidência evita transformar uma referência não confirmada em certeza.",
          ],
        ],
      ),
    ],
    [
      "Separe a afirmação.",
      "Confira origem, data e contexto.",
      "Abra a fonte e veja o que ela sustenta.",
      "Declare a incerteza quando necessário.",
    ],
    "news",
  ),
  lesson(
    "pratica-ia",
    "Prática final de IA",
    "Aplicar os cuidados em seis situações de uso e de informação.",
    ["ai-mobile", "ai-data", "ai-truth", "boatos"],
    [
      [
        "Pratique com situações novas",
        [
          "As situações são fictícias. Você vai decidir sobre notícia antiga, título exagerado, imagem sem origem, citação inventada, aplicativo imitador e excesso de dados.",
          "Cada alternativa recebe explicação. Você pode repetir sem punição e consultar as aulas anteriores.",
        ],
      ],
      [
        "Um processo que você pode repetir",
        [
          "Antes de perguntar, retire dados que não são necessários. Depois da resposta, separe o que é explicação do que precisa ser confirmado.",
          "Para fatos, procure evidências. Para instruções, confira se fazem sentido e se o serviço oficial as recomenda. Para dúvidas, peça uma reformulação.",
        ],
      ],
      [
        "Continue com autonomia",
        [
          "Usar IA com cuidado não significa aceitar tudo nem rejeitar tudo. Significa aproveitar o apoio e manter a responsabilidade pela decisão.",
          "O resumo pode ser impresso. Nenhuma conta externa, plano pago ou uso do assistente é necessário para concluir este curso.",
        ],
      ],
    ],
    [
      q(
        "if1",
        "Uma postagem de três anos atrás circula como notícia de hoje.",
        [
          [
            "Conferir data e contexto da publicação original.",
            true,
            "Uma publicação real pode ser enganosa quando reapresentada com data ou contexto diferente.",
          ],
          [
            "Compartilhar porque a foto é verdadeira.",
            false,
            "Uma foto verdadeira não confirma que o fato esteja ocorrendo hoje.",
          ],
        ],
      ),
      q(
        "if2",
        "O título diz “todos”, mas o estudo trata de um pequeno grupo.",
        [
          [
            "Repetir o título sem abrir o estudo.",
            false,
            "O título pode extrapolar o alcance da evidência. Leia o que realmente foi estudado.",
          ],
          [
            "Conferir a população e os limites da fonte.",
            true,
            "A conclusão precisa respeitar o alcance da evidência, sem generalizar indevidamente.",
          ],
        ],
      ),
      q("if3", "Uma imagem circula sem origem identificada.", [
        [
          "Tratar como não verificada e buscar a origem.",
          true,
          "Sem origem e contexto suficientes, não há base para confirmá-la só pela aparência.",
        ],
        [
          "Declarar verdadeira porque não vejo defeitos.",
          false,
          "Ausência de defeitos não comprova autenticidade nem contexto.",
        ],
      ]),
      q("if4", "Uma IA fornece uma citação que você não encontra.", [
        [
          "Usar assim mesmo, pois tem autor e data.",
          false,
          "Autor e data também podem ser inventados. A fonte precisa ser localizada e conferida.",
        ],
        [
          "Não usar como prova até verificar a fonte.",
          true,
          "Uma referência não verificada não deve sustentar uma afirmação factual.",
        ],
      ]),
      q("if5", "Um app usa o nome ChatGPT, mas tem outro publicador.", [
        [
          "Conferir a listagem indicada na documentação oficial.",
          true,
          "O nome isolado não garante que seja o aplicativo oficial. Confira o desenvolvedor.",
        ],
        [
          "Instalar porque o ícone parece igual.",
          false,
          "Ícones podem ser copiados. Não conclua a origem apenas pela aparência.",
        ],
      ]),
      q("if6", "Você quer ajuda para entender um formulário.", [
        [
          "Enviar documentos e senhas de toda a família.",
          false,
          "Isso expõe informações desnecessárias. Use uma pergunta genérica e exemplos fictícios.",
        ],
        [
          "Descrever a dúvida sem dados pessoais.",
          true,
          "É possível aprender o significado de campos ou termos sem expor documentos e credenciais.",
        ],
      ]),
    ],
    [
      "Escolha o aplicativo oficial.",
      "Pergunte sem dados privados.",
      "Leia criticamente e reformule.",
      "Verifique referências, origem e contexto.",
    ],
    "news",
  ),
];
