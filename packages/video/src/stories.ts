export const stories=[
{id:'SmsEntrega',sceneSeconds:10,scenes:[
{title:'Uma cobrança chegou',example:'Entrega Clara: pague a taxa para liberar hoje.',text:'Você espera uma encomenda. A mensagem parece fazer sentido.'},
{title:'A urgência pede pausa',example:'“Preciso resolver agora?”',text:'Não deixe o prazo da mensagem decidir por você.'},
{title:'Saia da mensagem',example:'Abra o aplicativo da compra por conta própria.',text:'Não use o link ou o telefone fornecido na cobrança.'},
{title:'Confira o pedido',example:'O aplicativo mostra essa pendência?',text:'Se ainda houver dúvida, use o atendimento dentro do aplicativo.'}]},
{id:'FamiliarNumeroNovo',sceneSeconds:10,scenes:[
{title:'“Meu número mudou”',example:'Mãe, preciso de uma transferência. Não posso falar.',text:'Mensagem fictícia. Uma foto conhecida pode ser copiada.'},
{title:'A foto não confirma',example:'Nome, foto e voz não bastam como prova.',text:'Informações conhecidas podem tornar o pedido convincente.'},
{title:'Use o contato anterior',example:'Ligue para o número que você já tinha salvo.',text:'Não confirme apenas pelo novo número que pediu dinheiro.'},
{title:'Não conseguiu falar?',example:'Espere antes de transferir.',text:'Procure outro canal conhecido. A urgência não confirma a identidade.'}]},
{id:'DominioEmFoco',sceneSeconds:12,scenes:[
{title:'Parece igual?',example:'banco-exemplo.test\nbanc0-exemplo.test',text:'No segundo endereço, há um zero no lugar da letra o. Endereços fictícios.'},
{title:'Letras podem confundir',example:'a  /  а',text:'A primeira é latina. A segunda é cirílica. A aparência pode ser semelhante.'},
{title:'O navegador pode variar',example:'Unicode ou uma forma iniciada por xn--',text:'A exibição depende das regras do navegador. Não confie só no olhar.'},
{title:'Você pode escolher',example:'Não consigo confirmar. Vou por outro caminho.',text:'Abra o aplicativo ou endereço já conhecido, fora da mensagem.'}]},
{id:'CentralBancaria',sceneSeconds:10,scenes:[
{title:'Uma ligação inesperada',example:'“Transfira para uma conta segura.”',text:'Cenário fictício. O pedido tenta usar o medo para apressar uma ação.'},
{title:'Não siga novas ordens',example:'Não repasse códigos nem instale acesso remoto.',text:'Dados corretos sobre você não confirmam quem está ligando.'},
{title:'Encerre o contato',example:'Procure o banco pelo aplicativo ou canal conhecido.',text:'Faça a confirmação por um caminho independente da ligação.'},
{title:'Já transferiu?',example:'Procure seu banco rapidamente pelo canal oficial.',text:'Peça orientação sobre contestação. A devolução não é garantida.'}]},
{id:'PrimeiraConversaIA',sceneSeconds:12,scenes:[
{title:'Comece com um objetivo',example:'“Explique o que é uma senha forte em linguagem simples.”',text:'Esta conversa é ilustrativa. Não representa resposta de uma IA real.'},
{title:'Envie sem dados pessoais',example:'Não inclua senhas, documentos ou códigos.',text:'Um exemplo inventado é suficiente para praticar uma pergunta.'},
{title:'Leia com atenção',example:'Uma resposta convincente também pode estar errada.',text:'Confira informações importantes em fontes confiáveis.'},
{title:'Peça uma nova explicação',example:'“Use um exemplo do dia a dia e explique o termo difícil.”',text:'Reformular ajuda na compreensão. Não transforma a resposta em prova.'}]},
{id:'NoticiaEFontes',sceneSeconds:12,scenes:[
{title:'Separe a afirmação',example:'“O Parque das Nuvens fechará amanhã.”',text:'Notícia fictícia para praticar. O que exatamente precisa ser confirmado?'},
{title:'Procure a origem',example:'Quem publicou? Em que data? Em qual contexto?',text:'Uma publicação antiga pode voltar a circular como se fosse atual.'},
{title:'Abra a referência',example:'A fonte realmente diz o que a mensagem afirma?',text:'Uma citação pode não existir ou não sustentar a conclusão.'},
{title:'Reconheça o limite',example:'Sem evidência suficiente: não verificado.',text:'Concordância entre chatbots não substitui uma fonte independente.'}]}
];
