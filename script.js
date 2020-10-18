const textLbl = document.querySelector('.text-lbl');
const speakBtn = document.querySelector('#speak-btn');

const SpeechRecognition = webkitSpeechRecognition || SpeechRecognition;
const SpeechGrammarList = webkitSpeechGrammarList || SpeechGrammarList;
const SpeechRecognitionEvent = webkitSpeechRecognitionEvent || SpeechRecognitionEvent;

const startAudio = new Audio('./on.mp3');
const stopAudio = new Audio('./off.mp3');

const recognition = new SpeechRecognition();
recognition.lang = 'en-IN';

const SpeechSynthesis = window.speechSynthesis;

const handleInvalidTrigger = () => {
  speakBtn.classList.toggle('danger');
  textLbl.textContent = `invalid phrase`;
  SpeechSynthesis.speak(
    new SpeechSynthesisUtterance('invalid phrase')
  );
  setTimeout(() => {
    speakBtn.disabled = false;
    speakBtn.classList.toggle('danger');
    textLbl.textContent = `press tap to speak`;
  }, 3000);
};

const resetButton = () => {
  setTimeout(() => {
    speakBtn.disabled = false;
    textLbl.textContent = `press tap to speak`;
  }, 3000);
};

recognition.onstart = () => {
  speakBtn.disabled = true;
  startAudio.play();
  textLbl.textContent = `listening`;
  speakBtn.classList.toggle('listening');
};

recognition.onresult = (event) => {
  let result = event.results[0][0].transcript;
  if (result.includes('food') || result.includes('colour')) {
    if (result.includes('colour')) {
      SpeechSynthesis.speak(
        new SpeechSynthesisUtterance(`looking for a colour`)
      );
      fetch(
        'https://cors-anywhere.herokuapp.com/' +
        'https://decoupled-assistant.netlify.app/.netlify/functions/colour'
      )
        .then(r => r.json())
        .then(d => {
          textLbl.textContent = `i think ${d.data} is a good colour`;
          SpeechSynthesis.speak(
            new SpeechSynthesisUtterance(`i think ${d.data} is a good colour`)
          );
          resetButton();
        });
    } else {
      textLbl.textContent = `i can not cook a food item`;
      SpeechSynthesis.speak(
        new SpeechSynthesisUtterance(`i can not cook a food item`)
      );
      resetButton();
    }
  } else {
    handleInvalidTrigger();
  };
};

recognition.onnomatch = handleInvalidTrigger;

recognition.onerror = () => {
  speakBtn.classList.toggle('listening');
  speakBtn.classList.toggle('danger');
  textLbl.textContent = `i could not hear you`;
  setTimeout(() => {
    speakBtn.disabled = false;
    speakBtn.classList.toggle('danger');
    textLbl.textContent = `press tap to speak`;
  }, 3000);
};

recognition.onspeechend = () => {
  speakBtn.classList.toggle('listening');
  stopAudio.play();
  recognition.stop();
};

speakBtn.addEventListener('click', () => {
  recognition.start();
});
