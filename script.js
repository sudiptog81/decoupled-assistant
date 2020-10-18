const textLbl = document.querySelector('.text-lbl');
const speakBtn = document.querySelector('#speak-btn');

const SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
const SpeechGrammarList = webkitSpeechGrammarList || SpeechGrammarList;
const SpeechRecognitionEvent = webkitSpeechRecognitionEvent || SpeechRecognitionEvent;

const grammar = `
#JSGF V1.0;
grammar trigger;
public <trigger> = food | colour;
`;

const recognition = new SpeechRecognition();
const speechRecognitionList = new SpeechGrammarList();

speechRecognitionList.addFromString(grammar, 1);

recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-IN';
recognition.interimResults = false;
recognition.maxAlternatives = 0;

recognition.onstart = () => {
  speakBtn.disabled = true;
  textLbl.textContent = `listening`;
  console.log('Ready');
  speakBtn.classList.toggle('listening');
};

recognition.onresult = (event) => {
  let result = event.results[0][0].transcript;
  if (result.includes('food') || result.includes('colour')) {
    textLbl.textContent = `i heard say ${result}`;
    setTimeout(() => {
      speakBtn.disabled = false;
      textLbl.textContent = `press tap to speak`;
    }, 3000);
  } else {
    speakBtn.classList.toggle('danger');
    textLbl.textContent = `i could not hear a valid phrase`;
    setTimeout(() => {
      speakBtn.disabled = false;
      speakBtn.classList.toggle('danger');
      textLbl.textContent = `press tap to speak`;
    }, 3000);
  };
};

recognition.onspeechend = () => {
  speakBtn.classList.toggle('listening');
  recognition.stop();
};

speakBtn.addEventListener('click', () => {
  recognition.start();
});