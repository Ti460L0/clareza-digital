import { q, lesson } from "./authoring";
import type { Lesson, Question } from "./index";
export const securityLessons: Lesson[] = [
  lesson(
    "quem-esta-falando",
    "Quem está falando?",
    "Confirmar pedidos de familiares por um contato independente.",
    ["fraudes", "golpes"],
    [
      [
        "Um pedido que mexe com você",
        [
          "Imagine esta conversa fictícia: “Mãe, meu celular quebrou. Este é meu número novo. Preciso pagar uma conta agora.” A foto é de alguém conhecido.",
          "Você pode querer ajudar e, ao mesmo tempo, fazer uma pausa para confirmar. Cuidado não é falta de carinho.",
        ],
      ],
      [
        "Uma foto não é uma confirmação",
        [
          "Nome, foto, detalhes da família e até uma voz parecida não bastam para confirmar um pedido de dinheiro. Uma conta conhecida também pode estar sob controle de outra pessoa.",
          "Perguntar algo pessoal pode ajudar na conversa, mas não deve ser sua única verificação. A informação pode ser conhecida por terceiros.",
        ],
      ],
      [
        "Faça a confirmação fora da conversa",
        [
          "Ligue para o número que já tinha salvo antes dessa mensagem. Se não conseguir, procure outro canal que já usava com a pessoa. Não dependa apenas de um número fornecido pelo novo contato.",
          "Se a pessoa insiste que você não pode ligar, isso não resolve a dúvida. Espere antes de transferir. No exercício, você pode praticar a ligação sem fazer uma chamada real.",
        ],
      ],
    ],
    [
      q(
        "s2-foto",
        "A foto é da sua filha, mas o número é novo e pede dinheiro. O que fazer?",
        [
          [
            "Transferir porque reconheci a foto.",
            false,
            "A foto é copiável. Reconhecê-la não confirma quem está usando o número.",
          ],
          [
            "Ligar para o contato anterior antes de decidir.",
            true,
            "Você confirma fora do canal que está fazendo o pedido. Se não conseguir, pode esperar.",
          ],
          [
            "Perguntar só o nome do cachorro e confiar.",
            false,
            "Uma informação pessoal pode ser conhecida por terceiros. Essa pergunta isolada não garante a identidade.",
          ],
        ],
      ),
    ],
    [
      "Confirme pelo contato anterior.",
      "Foto, voz e detalhes pessoais não são prova suficiente.",
      "Sem confirmação, espere antes de transferir.",
    ],
    "family",
  ),
  lesson(
    "falsa-central",
    "Falsa central e códigos",
    "Interromper pedidos de códigos, transferências e controle remoto.",
    ["fraudes", "golpes"],
    [
      [
        "O medo de perder dinheiro",
        [
          "Em uma ligação fictícia, alguém diz ser da Central Horizonte e alerta sobre uma compra. Em seguida, pede uma transferência para uma “conta segura”.",
          "O problema não é simplesmente receber uma ligação. É seguir uma operação arriscada porque uma pessoa inesperada disse que ela protege você.",
        ],
      ],
      [
        "O código também protege uma conta",
        [
          "Não repasse senhas ou códigos de verificação a quem entrou em contato. Eles podem autorizar acesso ou uma operação. Não instale aplicativos de acesso remoto por orientação desse interlocutor.",
          "Há diferença entre você iniciar um procedimento no aplicativo oficial e alguém inesperado pedir que entregue um código. Se estiver confuso, pare e confirme no próprio serviço.",
        ],
      ],
      [
        "Encerre e procure o banco",
        [
          "Interrompa a ligação ou conversa. Abra o aplicativo que já utiliza ou consulte o contato oficial que já conhece. Explique o pedido recebido e peça orientação.",
          "Na simulação não há ligação, transferência ou código real. Você escolhe uma resposta e lê a consequência ilustrada.",
        ],
      ],
    ],
    [
      q(
        "s3-central",
        "Um suposto atendente pede para transferir o saldo a uma “conta segura”.",
        [
          [
            "Fazer uma transferência pequena primeiro.",
            false,
            "Uma transferência de teste ainda envia dinheiro sem confirmar a legitimidade do pedido.",
          ],
          [
            "Informar um código, mas não a senha.",
            false,
            "Um código pode permitir acesso ou autorizar operações. Ele também precisa ser protegido.",
          ],
          [
            "Encerrar e procurar o banco por um canal conhecido.",
            true,
            "A confirmação independente interrompe a pressão e permite verificar a situação com o serviço.",
          ],
        ],
      ),
    ],
    [
      "Não repasse códigos nem senhas.",
      "Não instale controle remoto por contato inesperado.",
      "Confirme dentro do aplicativo ou canal oficial conhecido.",
    ],
    "bank",
  ),
  lesson(
    "ofertas-e-enderecos",
    "Benefícios, ofertas e endereços",
    "Reconhecer o limite da aparência e conferir pedidos em canais oficiais.",
    ["inss", "https", "idn"],
    [
      [
        "Ameaça e vantagem usam a pressa",
        [
          "Exemplos fictícios: “Seu benefício será suspenso hoje”; “Você ganhou um prêmio, pague uma taxa para receber”. Antes de agir, procure o órgão ou empresa por conta própria.",
          "Uma mensagem pode ser legítima, mas isso precisa ser confirmado. Não use a regra de que toda comunicação institucional é falsa.",
        ],
      ],
      [
        "Como consultar um benefício",
        [
          "O INSS orienta consultar a situação da prova de vida pelo Meu INSS ou pela Central 135. Há comunicações oficiais, inclusive situações em que o Governo do Brasil usa WhatsApp. Isso não valida qualquer mensagem recebida.",
          "Não pague nem entregue dados por uma ameaça de suspensão recebida em uma mensagem inesperada. Procure o canal oficial fora dela. A fonte abaixo descreve o procedimento vigente na revisão desta aula.",
        ],
      ],
      [
        "O endereço também tem limites",
        [
          "Compare os exemplos fictícios da atividade: um número pode parecer uma letra; letras de alfabetos diferentes podem parecer iguais. Navegadores usam regras diferentes para exibir nomes internacionais.",
          "HTTPS protege a conexão, mas não garante que o negócio seja confiável. Não basta contar pontos ou reconhecer um símbolo. Se não consegue confirmar, escolha outro caminho.",
        ],
      ],
    ],
    [
      q(
        "s4-beneficio",
        "Uma mensagem ameaça suspender um benefício se você pagar hoje. Qual escolha ajuda?",
        [
          [
            "Consultar o canal oficial fora da mensagem.",
            true,
            "A confirmação independente permite verificar a situação sem seguir a cobrança recebida.",
          ],
          [
            "Pagar porque o texto menciona um órgão público.",
            false,
            "O nome de um órgão pode ser usado sem autorização. Ele não confirma o pedido.",
          ],
          [
            "Concluir que todo WhatsApp de governo é falso.",
            false,
            "Existem comunicações legítimas. O cuidado é conferir o caso pelo canal oficial, sem generalizar.",
          ],
        ],
      ),
      q("s4-https", "Uma página usa HTTPS. O que isso permite concluir?", [
        [
          "A loja certamente é verdadeira.",
          false,
          "A conexão protegida não confirma a identidade comercial nem a honestidade da loja.",
        ],
        [
          "A conexão é protegida, mas ainda preciso confirmar o destino.",
          true,
          "HTTPS trata da conexão. A confirmação do pedido e do serviço exige outros cuidados.",
        ],
        [
          "Todo endereço parecido pertence à mesma empresa.",
          false,
          "Semelhança visual não estabelece vínculo entre endereços. Letras e trechos adicionais podem confundir.",
        ],
      ]),
    ],
    [
      "Confirme benefícios pelo canal oficial.",
      "Não pague para resolver uma ameaça sem conferir.",
      "Se o endereço confunde, não precisa adivinhar.",
    ],
    "address",
  ),
  lesson(
    "ja-interagi",
    "Já interagi. E agora?",
    "Escolher a primeira ação conforme o que aconteceu.",
    ["incidente", "bcb"],
    [
      [
        "Separe o que aconteceu",
        [
          "Só abriu uma página? Pare de interagir e observe se houve download, instalação ou envio de informações. Abrir, sozinho, não prova perda de dinheiro. Mantenha o aparelho atualizado.",
          "Se instalou um aplicativo indicado pelo contato, interrompa a conversa. Use um aparelho confiável para procurar seu banco ou serviço e orientação técnica. Não siga novas instruções do suposto atendente.",
        ],
      ],
      [
        "Informou senha ou código?",
        [
          "Procure o serviço pelo endereço ou aplicativo oficial em um aparelho confiável. Troque a senha comprometida e as senhas repetidas em outros serviços. Confira sessões abertas e ative a verificação em duas etapas.",
          "Um código repassado pode ter autorizado uma ação. Relate isso ao serviço; mudar apenas a senha pode não desfazer operações já realizadas.",
        ],
      ],
      [
        "Pagou ou transferiu?",
        [
          "Entre em contato com seu banco rapidamente pelos canais oficiais. Em golpe com Pix, solicite a contestação e orientação sobre o Mecanismo Especial de Devolução, o MED. Ele não garante recuperação do dinheiro.",
          "Guarde mensagens, comprovantes e protocolos. Registre ocorrência pelos canais oficiais da polícia. Não envie mais dinheiro a quem promete recuperar o valor mediante taxa. Não publique comprovantes com dados pessoais.",
        ],
      ],
    ],
    [
      q(
        "s5-pix",
        "Você percebeu que transferiu dinheiro após um pedido falso. O que fazer primeiro?",
        [
          [
            "Pagar outra taxa para liberar o reembolso.",
            false,
            "Um novo pagamento a quem fez a abordagem pode ampliar o prejuízo. Não aceite promessas de recuperação mediante taxa.",
          ],
          [
            "Contatar rapidamente o banco por canal oficial e guardar comprovantes.",
            true,
            "O banco pode orientar a contestação. No Pix, o MED é uma tentativa de recuperação, sem garantia de devolução.",
          ],
          [
            "Esperar uma semana para ver se o dinheiro volta.",
            false,
            "Agir rapidamente ajuda no tratamento da ocorrência. Não espere uma devolução espontânea.",
          ],
        ],
      ),
      q(
        "s5-abriu",
        "Você apenas abriu uma página e a fechou. Qual conclusão é adequada?",
        [
          [
            "Com certeza perdi todo o dinheiro.",
            false,
            "Só abrir não comprova transferência nem invasão. Avalie exatamente o que aconteceu, sem concluir uma perda não observada.",
          ],
          [
            "Não preciso observar mais nada, qualquer página é segura.",
            false,
            "Observe downloads ou outras ações e mantenha o aparelho atualizado. Evite continuar interagindo com conteúdo suspeito.",
          ],
          [
            "Interromper e avaliar se houve dados enviados, download ou instalação.",
            true,
            "Separar as ações realizadas ajuda a escolher os cuidados adequados sem pânico nem falsa garantia.",
          ],
        ],
      ),
    ],
    [
      "Interrompa o contato suspeito.",
      "Proteja contas em um aparelho confiável.",
      "Procure rapidamente o banco se houve pagamento.",
      "Guarde evidências e protocolos sem expor dados.",
    ],
  ),
  lesson(
    "pratica-seguranca",
    "Prática final de segurança",
    "Aplicar a confirmação independente em seis situações novas.",
    ["fraudes", "incidente", "bcb", "inss", "idn"],
    [
      [
        "Agora você escolhe",
        [
          "As seis situações a seguir são inventadas. Elas misturam pedidos de familiares, serviços, entregas, benefícios, endereços e ações após um incidente.",
          "Não há cronômetro, ranking ou nota mínima. Você pode repetir e ler a explicação de todas as alternativas.",
        ],
      ],
      [
        "Uma pergunta útil",
        [
          "Se eu não tivesse recebido essa mensagem, por qual caminho procuraria essa pessoa ou serviço?",
          "Um contato anterior, o aplicativo já instalado e o endereço oficial confirmado ajudam a sair do caminho indicado pela própria abordagem.",
        ],
      ],
      [
        "O que a prática significa",
        [
          "Terminar o curso não torna ninguém imune a golpes. O objetivo é praticar uma pausa e saber onde conferir antes de agir.",
          "Guarde o resumo ou imprima o material de consulta. Se algo já ocorreu, use a aula “Já interagi” para escolher os primeiros cuidados.",
        ],
      ],
    ],
    [
      q(
        "sf1",
        "Um “sobrinho” usa número novo e pede segredo sobre um pagamento.",
        [
          [
            "Confirmar por contato anterior.",
            true,
            "O contato independente ajuda a confirmar a pessoa antes de qualquer pagamento.",
          ],
          [
            "Enviar porque pediu segredo.",
            false,
            "O pedido de segredo aumenta a pressão e não confirma a identidade.",
          ],
        ],
      ),
      q("sf2", "Uma “central” pede o código que acabou de chegar.", [
        [
          "Ler o código em voz alta.",
          false,
          "O código pode autorizar acesso ou uma operação. Não o repasse ao interlocutor inesperado.",
        ],
        [
          "Encerrar e procurar o serviço oficial.",
          true,
          "Você pode verificar o que aconteceu sem entregar o código ao contato.",
        ],
      ]),
      q("sf3", "Um QR code em uma mensagem promete liberar sua compra.", [
        [
          "Consultar a compra pelo app já conhecido.",
          true,
          "O QR code também pode levar a um destino diferente do esperado. Confira fora da mensagem.",
        ],
        [
          "Pagar porque QR code é sempre oficial.",
          false,
          "Um QR code é uma forma de apresentar informação, não uma garantia de origem.",
        ],
      ]),
      q("sf4", "Um aviso ameaça cortar um benefício no mesmo dia.", [
        [
          "Usar apenas o telefone do aviso.",
          false,
          "O contato fornecido pelo próprio aviso não é uma confirmação independente.",
        ],
        [
          "Consultar Meu INSS ou 135, se o benefício for do INSS.",
          true,
          "Use os canais oficiais adequados ao benefício para verificar a situação.",
        ],
      ]),
      q("sf5", "Duas letras parecem iguais em um endereço.", [
        [
          "Escolher pelo desenho mais familiar.",
          false,
          "Caracteres de alfabetos distintos podem ter aparência semelhante. O olhar não basta.",
        ],
        [
          "Reconhecer a dúvida e usar outro caminho.",
          true,
          "Você pode usar um canal já conhecido sem precisar decifrar cada caractere.",
        ],
      ]),
      q("sf6", "Após informar uma senha, você suspeita da página.", [
        [
          "Trocar a senha no serviço oficial usando aparelho confiável.",
          true,
          "Proteja a conta e as demais em que repetiu a senha; confira as sessões e orientações do serviço.",
        ],
        [
          "Voltar à página suspeita para pedir que apague a senha.",
          false,
          "Isso mantém você no canal suspeito. Procure o serviço oficial de forma independente.",
        ],
      ]),
    ],
    [
      "Pause diante de urgência e segredo.",
      "Confirme a identidade por outro caminho.",
      "Não entregue senhas, códigos ou controle do aparelho.",
      "Se já agiu, procure o serviço adequado rapidamente.",
    ],
  ),
];
