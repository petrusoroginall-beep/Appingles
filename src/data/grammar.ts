import type { GrammarTopic } from '../types'

export const grammarTopics: GrammarTopic[] = [
  {
    id: 'subject-pronouns',
    title: 'Não esqueça do sujeito',
    emoji: '🙋',
    summary: 'Em português a gente esconde o sujeito, mas em inglês ele nunca pode desaparecer.',
    explanation:
      'Em português, a gente costuma esconder o sujeito da frase porque o verbo já indica quem está falando: "Gosto de pizza" já deixa claro que é "eu". Em inglês isso não funciona — o sujeito (I, you, he, she, it, we, they) é obrigatório em toda frase, sempre. Se você tirar o sujeito, a frase fica incompleta pro ouvinte americano.',
    examples: [
      { en: 'I like pizza.', pt: 'Eu gosto de pizza.', phonetic: 'ai laik pitza' },
      { en: 'She works downtown.', pt: 'Ela trabalha no centro.', phonetic: 'chi uorks dauntaun' },
      { en: "It's raining.", pt: 'Está chovendo.', phonetic: 'its reinin' },
      { en: 'We are tired.', pt: 'A gente está cansado.', phonetic: 'ui ar taird' },
    ],
    mistake: {
      wrong: 'Like pizza.',
      right: 'I like pizza.',
      explanation:
        'Como em português "Gosto de pizza" funciona sem sujeito, é comum esquecer de colocar o "I" em inglês. Mas sem o sujeito, a frase em inglês fica quebrada — sempre precisa do "I", "you", "he" etc. na frente do verbo.',
    },
  },
  {
    id: 'auxiliary-do',
    title: 'Do you...? Does he...?',
    emoji: '❓',
    summary: 'Perguntas e negativas em inglês quase sempre precisam do verbo auxiliar "do" ou "does".',
    explanation:
      'Em português, pra fazer uma pergunta a gente só muda a entonação: "Você gosta de café?" já é uma pergunta, sem precisar de nenhuma palavra extra. Em inglês, a maioria dos verbos (menos "be" e alguns modais) precisa do auxiliar "do" (ou "does" na terceira pessoa) pra formar perguntas e negativas. Sem ele, a frase soa completamente errada pra um nativo.',
    examples: [
      { en: 'Do you like coffee?', pt: 'Você gosta de café?', phonetic: 'du iu laik cofi' },
      { en: 'Does she speak English?', pt: 'Ela fala inglês?', phonetic: 'daz chi spik inglich' },
      { en: "I don't like coffee.", pt: 'Eu não gosto de café.', phonetic: 'ai dont laik cofi' },
      { en: "He doesn't work here.", pt: 'Ele não trabalha aqui.', phonetic: 'ri dazent uork rir' },
    ],
    mistake: {
      wrong: 'You like coffee?',
      right: 'Do you like coffee?',
      explanation:
        'Em português essa pergunta é natural só com a entonação. Em inglês, sem o "Do" no início, a frase parece uma afirmação estranha, não uma pergunta de verdade — o "do/does" é obrigatório.',
    },
  },
  {
    id: 'present-perfect',
    title: 'Present Perfect vs Passado Simples',
    emoji: '⏳',
    summary: '"I have done" e "I did" não são a mesma coisa — e o português não separa isso do mesmo jeito.',
    explanation:
      'Em português, "eu já fiz isso" pode se referir tanto a algo específico no passado quanto a uma experiência sem data definida — e isso confunde muito quando aprendemos inglês. O Simple Past (I did) é usado quando você fala de um momento específico e terminado no passado. O Present Perfect (I have done) é usado quando o momento exato não importa, só o fato de já ter acontecido.',
    examples: [
      { en: 'I have already eaten.', pt: 'Eu já comi (não importa quando).', phonetic: 'ai rev olredi iten' },
      { en: 'I ate at 7 PM yesterday.', pt: 'Eu comi às 7 da noite ontem (momento específico).', phonetic: 'ai eit at seven pi em iesterdei' },
      { en: 'Have you ever been to Miami?', pt: 'Você já esteve em Miami alguma vez na vida?', phonetic: 'rev iu ever bin tu maiami' },
      { en: 'I lived in Miami for two years.', pt: 'Eu morei em Miami por dois anos (período terminado).', phonetic: 'ai livd in maiami for tu iers' },
    ],
    mistake: {
      wrong: 'I have went there yesterday.',
      right: 'I went there yesterday.',
      explanation:
        '"Yesterday" marca um momento específico e terminado, então o certo é o Simple Past ("went"), nunca o Present Perfect. Misturar os dois é um dos erros mais comuns de quem fala português.',
    },
  },
  {
    id: 'adjective-order',
    title: 'A ordem do adjetivo muda',
    emoji: '🔄',
    summary: 'Em português o adjetivo vem depois do substantivo. Em inglês, é o contrário.',
    explanation:
      '"Casa branca" em português tem o substantivo primeiro e o adjetivo depois. Em inglês essa ordem se inverte: o adjetivo SEMPRE vem antes do substantivo que ele descreve. Essa é uma das trocas mais automáticas — e mais fáceis de esquecer — quando você está formando frases rápido.',
    examples: [
      { en: 'A white house.', pt: 'Uma casa branca.', phonetic: 'a uait raus' },
      { en: 'A big city.', pt: 'Uma cidade grande.', phonetic: 'a big siti' },
      { en: 'An expensive car.', pt: 'Um carro caro.', phonetic: 'an expensiv car' },
      { en: 'A funny movie.', pt: 'Um filme divertido.', phonetic: 'a fani muvi' },
    ],
    mistake: {
      wrong: 'A house white.',
      right: 'A white house.',
      explanation: 'Isso é uma tradução literal e direta da ordem do português, mas em inglês soa completamente errado. O adjetivo tem que vir sempre antes do substantivo.',
    },
  },
  {
    id: 'articles',
    title: 'Quando NÃO usar "the" ou "a"',
    emoji: '📰',
    summary: 'Em inglês, generalizações não usam artigo — mas em português a gente usa sempre.',
    explanation:
      'Em português, a gente fala "Eu amo A música" ou "O amor é importante", usando o artigo mesmo quando está falando de forma geral. Em inglês, quando você fala de algo de forma geral (não uma coisa específica), o artigo desaparece: "I love music" (não "the music"), "Love is important" (não "the love").',
    examples: [
      { en: 'I love music.', pt: 'Eu amo música.', phonetic: 'ai lav miuzic' },
      { en: 'Dogs are loyal.', pt: 'Cachorros são leais.', phonetic: 'dogs ar loial' },
      { en: "Money can't buy happiness.", pt: 'Dinheiro não compra felicidade.', phonetic: 'mani cant bai repines' },
      { en: 'I like the music at this restaurant.', pt: 'Eu gosto da música desse restaurante (específica).', phonetic: 'ai laik da miuzic at dis restarant' },
    ],
    mistake: {
      wrong: 'I love the music. (falando de música em geral)',
      right: 'I love music.',
      explanation: 'Se você está falando de música de forma geral, não usa "the". Usar "the" aqui faz parecer que você está falando de uma música específica já mencionada antes.',
    },
  },
  {
    id: 'double-negative',
    title: 'Duplo negativo é erro em inglês',
    emoji: '🚫',
    summary: '"Não sei nada" tem dois negativos em português. Em inglês, isso é considerado errado.',
    explanation:
      'Em português, é super normal usar dois negativos na mesma frase pra reforçar: "Eu não sei nada", "Eu não vi ninguém". Em inglês, dois negativos na mesma frase se cancelam ou soam gramaticalmente errados. A regra é: só UM negativo por frase. Depois do "not/don\'t/doesn\'t", você usa palavras afirmativas como "anything", "anyone", "anywhere".',
    examples: [
      { en: "I don't know anything.", pt: 'Eu não sei nada.', phonetic: 'ai dont nou enifin' },
      { en: "I didn't see anyone.", pt: 'Eu não vi ninguém.', phonetic: 'ai didnt si eniuan' },
      { en: "She doesn't have any money.", pt: 'Ela não tem dinheiro nenhum.', phonetic: 'chi dazent rev eni mani' },
      { en: "There isn't anything here.", pt: 'Não tem nada aqui.', phonetic: 'der izent enifin rir' },
    ],
    mistake: {
      wrong: "I don't know nothing.",
      right: "I don't know anything.",
      explanation: 'Essa é uma tradução direta do português. Em inglês formal isso é considerado gramaticalmente incorreto — o certo é usar só um negativo por frase.',
    },
  },
  {
    id: 'continuous-overuse',
    title: '-ING nem sempre é "-ndo"',
    emoji: '🏃',
    summary: 'Só porque em português usamos "estou fazendo" toda hora, não significa que o inglês usa o "-ing" do mesmo jeito.',
    explanation:
      'Em português, a gente usa "estou fazendo", "estou gostando", "estou sabendo" com muita liberdade. Em inglês, o tempo contínuo (-ing) só é usado pra ações acontecendo NESTE momento exato ou situações temporárias — e alguns verbos (como "like", "know", "want", "need") quase nunca são usados no -ing. Pra hábitos e verdades gerais, você usa o presente simples.',
    examples: [
      { en: 'I like pizza.', pt: "Eu gosto de pizza (não 'I am liking').", phonetic: 'ai laik pitza' },
      { en: 'I know the answer.', pt: "Eu sei a resposta (não 'I am knowing').", phonetic: 'ai nou di enser' },
      { en: "I'm eating right now.", pt: 'Eu estou comendo agora (ação no momento, aqui -ing é correto).', phonetic: 'aim itin rait nau' },
      { en: 'She works at a bank.', pt: "Ela trabalha num banco (hábito, não 'is working').", phonetic: 'chi uorks at a benk' },
    ],
    mistake: {
      wrong: 'I am liking this song.',
      right: 'I like this song.',
      explanation: '"Like" é um verbo de estado, não uma ação "acontecendo", então quase nunca é usado no tempo contínuo — mesmo que em português "estou gostando" pareça super natural.',
    },
  },
  {
    id: 'make-vs-do',
    title: 'Make vs Do',
    emoji: '🛠️',
    summary: 'Os dois significam "fazer" em português, mas em inglês eles não são intercambiáveis.',
    explanation:
      'Português tem só um verbo pra "fazer", mas o inglês divide em dois: "make" é usado pra CRIAR ou PRODUZIR algo novo (make a cake, make a decision, make a mistake), e "do" é usado pra tarefas e atividades em geral (do homework, do the dishes, do exercise). Não existe uma regra 100% perfeita, mas essa divisão cobre a maioria dos casos.',
    examples: [
      { en: 'I need to make a decision.', pt: 'Eu preciso tomar uma decisão.', phonetic: 'ai nid tu meik a disicion' },
      { en: 'Can you do the dishes?', pt: 'Você pode lavar a louça?', phonetic: 'quen iu du da dichis' },
      { en: 'She made a mistake.', pt: 'Ela cometeu um erro.', phonetic: 'chi meid a misteik' },
      { en: 'I have to do my homework.', pt: 'Eu tenho que fazer minha tarefa de casa.', phonetic: 'ai rev tu du mai roumuork' },
    ],
    mistake: {
      wrong: 'I need to do a decision.',
      right: 'I need to make a decision.',
      explanation: 'Como em português os dois viram "fazer", é comum misturar make e do. "Decision" é algo que você CRIA na sua cabeça, então usa "make", não "do".',
    },
  },
  {
    id: 'comparatives',
    title: 'Comparativos: -er ou more?',
    emoji: '📏',
    summary: 'Nem todo adjetivo vira comparativo com "-er" — e inventar isso é um erro clássico.',
    explanation:
      'Adjetivos curtos (1 sílaba, ou 2 sílabas terminando em -y) recebem "-er" no final: big → bigger, happy → happier. Adjetivos longos (3+ sílabas, ou a maioria das palavras de 2 sílabas) usam "more" na frente, sem mudar a palavra: expensive → more expensive, beautiful → more beautiful. Um erro clássico é inventar formas como "beautifuler", que simplesmente não existe.',
    examples: [
      { en: 'This one is bigger.', pt: 'Esse aqui é maior.', phonetic: 'dis uan iz bigguer' },
      { en: 'She is happier now.', pt: 'Ela está mais feliz agora.', phonetic: 'chi iz repier nau' },
      { en: 'This is more expensive.', pt: 'Isso é mais caro.', phonetic: 'dis iz mor expensiv' },
      { en: "He's more interesting than his brother.", pt: 'Ele é mais interessante que o irmão dele.', phonetic: 'riz mor intrestin den riz brader' },
    ],
    mistake: {
      wrong: 'This is beautifuler.',
      right: 'This is more beautiful.',
      explanation: '"Beautiful" tem três sílabas, então nunca recebe "-er" no final — a forma certa sempre usa "more" na frente. Inventar "-er" em palavras longas é um erro muito comum.',
    },
  },
  {
    id: 'prepositions',
    title: 'Preposições que não traduzem literalmente',
    emoji: '🔗',
    summary: 'Married WITH, depend OF... errado! As preposições em inglês raramente batem com o português.',
    explanation:
      'Preposições são uma das coisas mais traiçoeiras do inglês, porque quase nunca correspondem exatamente à preposição usada em português. Traduzir preposição por preposição é um erro certeiro. O melhor é aprender cada expressão como um pacote fixo, junto com a preposição certa.',
    examples: [
      { en: "I'm married to him.", pt: "Eu sou casada com ele (não 'married with').", phonetic: 'aim merid tu rim' },
      { en: "It depends on the weather.", pt: "Depende do tempo (não 'depend of').", phonetic: 'it dipends on da ueder' },
      { en: 'Listen to me.', pt: "Me escuta (não só 'listen me').", phonetic: 'lisen tu mi' },
      { en: "I'm afraid of spiders.", pt: 'Eu tenho medo de aranhas.', phonetic: 'aim afreid av spaiders' },
    ],
    mistake: {
      wrong: "I'm married with him.",
      right: "I'm married to him.",
      explanation: 'Em português usamos "casado COM", então é natural tentar traduzir direto. Mas em inglês a expressão fixa é "married TO", e trocar a preposição soa estranho pra qualquer nativo.',
    },
  },
  {
    id: 'reflexive-overuse',
    title: 'My name IS, não "I call myself"',
    emoji: '🪞',
    summary: 'Em português usamos "eu me chamo" toda hora. Em inglês, isso quase nunca é traduzido com um verbo reflexivo.',
    explanation:
      'O português usa pronomes reflexivos ("me", "se", "nos") com muito mais frequência que o inglês: "eu me chamo", "eu me levanto", "ele se veste". Em inglês, muitas dessas ideias são expressas sem nenhum reflexivo, ou de um jeito completamente diferente. O exemplo mais comum é "meu nome é" em vez de "eu me chamo".',
    examples: [
      { en: 'My name is Ana.', pt: "Meu nome é Ana (não 'I call myself Ana').", phonetic: 'mai neim iz ana' },
      { en: 'I wake up at 7.', pt: "Eu me levanto às 7 (não 'I wake myself up').", phonetic: 'ai ueik ap at seven' },
      { en: 'He got dressed quickly.', pt: 'Ele se vestiu rápido.', phonetic: 'ri gat drest quikli' },
      { en: 'I feel great today.', pt: 'Eu me sinto ótimo hoje.', phonetic: 'ai fil greit tudei' },
    ],
    mistake: {
      wrong: 'I call myself Ana.',
      right: 'My name is Ana.',
      explanation: 'Essa é uma tradução super literal de "eu me chamo" que nenhum americano usa — soa estranho. O jeito natural de se apresentar é sempre "My name is..." ou "I\'m...".',
    },
  },
  {
    id: 'gerund-infinitive',
    title: 'Gerúndio ou infinitivo depois do verbo',
    emoji: '🔀',
    summary: 'Alguns verbos pedem "-ing" depois, outros pedem "to + verbo" — e não tem uma regra visual óbvia.',
    explanation:
      'Depois de certos verbos em inglês, o verbo que vem a seguir tem que estar no gerúndio (-ing) ou no infinitivo (to + verbo), dependendo do primeiro verbo — e isso não tem uma tradução direta do português. Verbos como "enjoy", "avoid", "finish" pedem -ing. Verbos como "want", "need", "decide", "promise" pedem "to + verbo". A única forma de aprender é decorando caso a caso.',
    examples: [
      { en: 'I enjoy swimming.', pt: 'Eu gosto de nadar (enjoy + -ing).', phonetic: 'ai endjoi suimin' },
      { en: 'I want to swim.', pt: 'Eu quero nadar (want + to).', phonetic: 'ai uant tu suim' },
      { en: 'She avoids eating sugar.', pt: 'Ela evita comer açúcar (avoid + -ing).', phonetic: 'chi avoids itin chuguer' },
      { en: 'He promised to call.', pt: 'Ele prometeu ligar (promise + to).', phonetic: 'ri pramist tu col' },
    ],
    mistake: {
      wrong: 'I enjoy to swim.',
      right: 'I enjoy swimming.',
      explanation: '"Enjoy" é um dos verbos que exige "-ing" depois, nunca "to + verbo". Como não existe uma lógica visual clara, o jeito é ir memorizando quais verbos pedem qual forma.',
    },
  },
]
