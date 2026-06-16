const translateBtn =
document.getElementById("translateBtn");

const swapBtn =
document.getElementById("swapBtn");

const inputText =
document.getElementById("inputText");

const outputText =
document.getElementById("outputText");

const sourceLang =
document.getElementById("sourceLang");

const targetLang =
document.getElementById("targetLang");

translateBtn.addEventListener(
"click",
async () => {

const text = inputText.value;

if(!text) return;

const url =
`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang.value}|${targetLang.value}`;

const res = await fetch(url);

const data = await res.json();

outputText.value =
data.responseData.translatedText;
}
);

swapBtn.addEventListener(
"click",
() => {

let temp = sourceLang.value;

sourceLang.value =
targetLang.value;

targetLang.value = temp;

let txt = inputText.value;

inputText.value =
outputText.value;

outputText.value = txt;

}
);

document
.getElementById("copyBtn")
.addEventListener(
"click",
() => {

navigator.clipboard.writeText(
outputText.value
);

alert("Copied!");
}
);

document
.getElementById("speakBtn")
.addEventListener(
"click",
() => {

const utter =
new SpeechSynthesisUtterance(
outputText.value
);

speechSynthesis.speak(utter);

}
);

document
.getElementById("voiceBtn")
.addEventListener(
"click",
() => {

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const recognition =
new SpeechRecognition();

recognition.lang =
sourceLang.value === "hi"
? "hi-IN"
: "en-US";

recognition.start();

recognition.onresult =
(event) => {

inputText.value =
event.results[0][0].transcript;

};

}
);

ScrollReveal().reveal(
'.translator-card',
{
delay:200,
distance:'60px',
origin:'bottom'
}
);
