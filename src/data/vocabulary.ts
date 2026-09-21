import type { VocabCategory } from '../types'

export const vocabulary: VocabCategory[] = [
  {
    id: 'greetings',
    title: 'Saudações',
    emoji: '👋',
    description: 'Formas de dizer olá, se apresentar e se despedir.',
    words: [
      { id: 'g1', en: 'Hello', pt: 'Olá', phonetic: 'hə-LOH', exampleEn: 'Hello, my name is Ana.', examplePt: 'Olá, meu nome é Ana.', level: 'A1' },
      { id: 'g2', en: 'Good morning', pt: 'Bom dia', phonetic: 'good MOR-ning', exampleEn: 'Good morning, everyone!', examplePt: 'Bom dia, pessoal!', level: 'A1' },
      { id: 'g3', en: 'How are you?', pt: 'Como você está?', phonetic: 'how ar yoo', exampleEn: 'Hi! How are you today?', examplePt: 'Oi! Como você está hoje?', level: 'A1' },
      { id: 'g4', en: 'Nice to meet you', pt: 'Prazer em conhecê-lo', phonetic: 'nais too meet yoo', exampleEn: 'Nice to meet you, I am John.', examplePt: 'Prazer em conhecê-lo, eu sou o John.', level: 'A1' },
      { id: 'g5', en: 'See you later', pt: 'Até mais', phonetic: 'see yoo LAY-ter', exampleEn: 'See you later, have a good day.', examplePt: 'Até mais, tenha um bom dia.', level: 'A1' },
      { id: 'g6', en: 'Goodbye', pt: 'Tchau / Adeus', phonetic: 'good-BAI', exampleEn: 'Goodbye, take care!', examplePt: 'Tchau, se cuida!', level: 'A1' },
    ],
  },
  {
    id: 'food',
    title: 'Comida',
    emoji: '🍽️',
    description: 'Vocabulário para restaurantes, mercado e refeições.',
    words: [
      { id: 'f1', en: 'Water', pt: 'Água', phonetic: 'WAH-ter', exampleEn: 'Can I have some water, please?', examplePt: 'Posso pegar água, por favor?', level: 'A1' },
      { id: 'f2', en: 'Bread', pt: 'Pão', phonetic: 'bred', exampleEn: 'I would like some bread.', examplePt: 'Eu gostaria de pão.', level: 'A1' },
      { id: 'f3', en: "I'm hungry", pt: 'Estou com fome', phonetic: 'aim HUNG-gree', exampleEn: "I'm hungry, let's eat.", examplePt: 'Estou com fome, vamos comer.', level: 'A1' },
      { id: 'f4', en: 'The bill, please', pt: 'A conta, por favor', phonetic: 'thuh bil pleez', exampleEn: 'Could we have the bill, please?', examplePt: 'Podemos pedir a conta, por favor?', level: 'A2' },
      { id: 'f5', en: 'Delicious', pt: 'Delicioso', phonetic: 'dih-LIH-shus', exampleEn: 'This soup is delicious!', examplePt: 'Esta sopa está deliciosa!', level: 'A2' },
      { id: 'f6', en: 'Vegetables', pt: 'Vegetais', phonetic: 'VEJ-tuh-buls', exampleEn: 'I eat vegetables every day.', examplePt: 'Eu comer vegetais todos os dias.', level: 'A1' },
    ],
  },
  {
    id: 'travel',
    title: 'Viagem',
    emoji: '✈️',
    description: 'Frases úteis para aeroportos, hotéis e turismo.',
    words: [
      { id: 't1', en: 'Where is the airport?', pt: 'Onde fica o aeroporto?', phonetic: 'wair iz thee AIR-port', exampleEn: 'Excuse me, where is the airport?', examplePt: 'Com licença, onde fica o aeroporto?', level: 'A1' },
      { id: 't2', en: 'I have a reservation', pt: 'Eu tenho uma reserva', phonetic: 'ai hav uh rez-er-VAY-shun', exampleEn: 'Hi, I have a reservation for tonight.', examplePt: 'Oi, eu tenho uma reserva para hoje à noite.', level: 'A2' },
      { id: 't3', en: 'How much is the ticket?', pt: 'Quanto custa a passagem?', phonetic: 'how much iz thuh TIH-ket', exampleEn: 'How much is the ticket to New York?', examplePt: 'Quanto custa a passagem para Nova York?', level: 'A2' },
      { id: 't4', en: 'Luggage', pt: 'Bagagem', phonetic: 'LUH-gij', exampleEn: 'My luggage is missing.', examplePt: 'Minha bagagem está perdida.', level: 'A2' },
      { id: 't5', en: 'Passport', pt: 'Passaporte', phonetic: 'PASS-port', exampleEn: 'Please show your passport.', examplePt: 'Por favor, mostre seu passaporte.', level: 'A1' },
    ],
  },
  {
    id: 'work',
    title: 'Trabalho',
    emoji: '💼',
    description: 'Vocabulário para o ambiente profissional e entrevistas.',
    words: [
      { id: 'w1', en: 'Meeting', pt: 'Reunião', phonetic: 'MEE-ting', exampleEn: 'We have a meeting at 3 pm.', examplePt: 'Temos uma reunião às 15h.', level: 'A2' },
      { id: 'w2', en: 'Deadline', pt: 'Prazo final', phonetic: 'DED-lain', exampleEn: 'The deadline is next Friday.', examplePt: 'O prazo final é a próxima sexta-feira.', level: 'B1' },
      { id: 'w3', en: 'I am responsible for...', pt: 'Eu sou responsável por...', phonetic: 'ai am rih-SPON-suh-bul for', exampleEn: 'I am responsible for the marketing team.', examplePt: 'Eu sou responsável pela equipe de marketing.', level: 'B1' },
      { id: 'w4', en: 'Coworker', pt: 'Colega de trabalho', phonetic: 'KOH-wer-ker', exampleEn: 'She is my coworker.', examplePt: 'Ela é minha colega de trabalho.', level: 'A2' },
      { id: 'w5', en: 'Could you send me the report?', pt: 'Você poderia me enviar o relatório?', phonetic: 'kood yoo send mee thuh ree-PORT', exampleEn: 'Could you send me the report by email?', examplePt: 'Você poderia me enviar o relatório por e-mail?', level: 'B1' },
    ],
  },
  {
    id: 'daily',
    title: 'Rotina diária',
    emoji: '☀️',
    description: 'Palavras e frases do dia a dia.',
    words: [
      { id: 'd1', en: 'I wake up at 7', pt: 'Eu acordo às 7', phonetic: 'ai wayk up at SEH-ven', exampleEn: 'I wake up at 7 every morning.', examplePt: 'Eu acordo às 7 todas as manhãs.', level: 'A1' },
      { id: 'd2', en: 'Weather', pt: 'Clima / Tempo', phonetic: 'WETH-er', exampleEn: "The weather is nice today.", examplePt: 'O clima está bom hoje.', level: 'A1' },
      { id: 'd3', en: 'I am tired', pt: 'Estou cansado(a)', phonetic: 'ai am TAI-erd', exampleEn: 'I am tired after work.', examplePt: 'Estou cansado depois do trabalho.', level: 'A1' },
      { id: 'd4', en: 'Neighbor', pt: 'Vizinho', phonetic: 'NAY-ber', exampleEn: 'My neighbor is very friendly.', examplePt: 'Meu vizinho é muito simpático.', level: 'A2' },
      { id: 'd5', en: 'What time is it?', pt: 'Que horas são?', phonetic: 'wut taim iz it', exampleEn: 'Excuse me, what time is it?', examplePt: 'Com licença, que horas são?', level: 'A1' },
    ],
  },
  {
    id: 'emotions',
    title: 'Emoções',
    emoji: '😊',
    description: 'Vocabulário para expressar sentimentos.',
    words: [
      { id: 'e1', en: 'Happy', pt: 'Feliz', phonetic: 'HAP-ee', exampleEn: 'I am so happy today!', examplePt: 'Estou tão feliz hoje!', level: 'A1' },
      { id: 'e2', en: 'Nervous', pt: 'Nervoso', phonetic: 'NER-vus', exampleEn: 'I am a little nervous about the interview.', examplePt: 'Estou um pouco nervoso com a entrevista.', level: 'A2' },
      { id: 'e3', en: 'Excited', pt: 'Animado', phonetic: 'ek-SAI-ted', exampleEn: "I'm excited about the trip.", examplePt: 'Estou animado com a viagem.', level: 'A2' },
      { id: 'e4', en: 'I am proud of you', pt: 'Estou orgulhoso de você', phonetic: 'ai am proud of yoo', exampleEn: 'I am proud of you for finishing the course.', examplePt: 'Estou orgulhoso de você por terminar o curso.', level: 'B1' },
    ],
  },
]

export const allWords = vocabulary.flatMap((c) => c.words)
