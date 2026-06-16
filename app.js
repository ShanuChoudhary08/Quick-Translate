// System State Architecture
let activeTranslationConfiguration = 'en-hi'; 
let internalPipelineDebounceRef = null;
let persistentOutputCache = "";

// UI Document Node References
const srcTextArea = document.getElementById('srcTextArea');
const targetTextDisplay = document.getElementById('targetTextDisplay');
const srcLangText = document.getElementById('srcLangText');
const targetLangText = document.getElementById('targetLangText');
const swapBtn = document.getElementById('swapBtn');
const micBtn = document.getElementById('micBtn');
const micIcon = document.getElementById('micIcon');
const micPulse = document.getElementById('micPulse');
const speakSrcBtn = document.getElementById('speakSrcBtn');
const speakTargetBtn = document.getElementById('speakTargetBtn');
const copyBtn = document.getElementById('copyBtn');
const charCount = document.getElementById('charCount');
const shimmerOverlay = document.getElementById('shimmerOverlay');
const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');

// Language Schema Dictionaries
const localizedAppConfig = {
    'en-hi': { src: 'en', target: 'hi', labelSrc: 'ENGLISH', labelTarget: 'HINDI (हिंदी)', srcCode: 'en-US', targetCode: 'hi-IN', fallbackPlaceholder: 'Translation pipeline standing by...' },
    'hi-en': { src: 'hi', target: 'en', labelSrc: 'HINDI (हिंदी)', labelTarget: 'ENGLISH', srcCode: 'hi-IN', targetCode: 'en-US', fallbackPlaceholder: 'अनुवाद पाइपलाइन तैयार है...' }
};

// INTERCHANGE DIRECTIONAL CONTROL EXECUTION
swapBtn.addEventListener('click', () => {
    activeTranslationConfiguration = activeTranslationConfiguration === 'en-hi' ? 'hi-en' : 'en-hi';
    
    // Re-render System Labels
    srcLangText.innerText = localizedAppConfig[activeTranslationConfiguration].labelSrc;
    targetLangText.innerText = localizedAppConfig[activeTranslationConfiguration].labelTarget;
    
    const underlyingInputText = srcTextArea.value;
    const underlyingOutputText = (targetTextDisplay.classList.contains('italic')) ? "" : persistentOutputCache;
    
    // Swap text data parameters safely
    srcTextArea.value = underlyingOutputText;
    charCount.innerText = `${underlyingOutputText.length} / 5000`;
    
    if (underlyingInputText.trim()) {
        dispatchTranslationPipeline(underlyingInputText);
    } else {
        purgeSystemDisplayConsoles();
    }
    triggerSystemNotification('Swapped translation parameters');
});

// ASYNCHRONOUS DEBOUNCED EVENT CAPTURE
srcTextArea.addEventListener('input', (event) => {
    const analyticalTextLength = event.target.value;
    charCount.innerText = `${analyticalTextLength.length} / 5000`;
    
    clearTimeout(internalPipelineDebounceRef);
    if (!analyticalTextLength.trim()) {
        purgeSystemDisplayConsoles();
        return;
    }

    // 500ms safe-zone buffer block to prevent request spamming
    internalPipelineDebounceRef = setTimeout(() => {
        dispatchTranslationPipeline(analyticalTextLength);
    }, 500);
});

// UPGRADED FAIL-SAFE NETWORKING TRANSLATION CORE
async function dispatchTranslationPipeline(rawContentPayload) {
    shimmerOverlay.classList.remove('opacity-0');
    targetTextDisplay.classList.add('opacity-30');
    
    const sourceLang = localizedAppConfig[activeTranslationConfiguration].src;
    const targetLang = localizedAppConfig[activeTranslationConfiguration].target;
    
    try {
        // High performance global gateway api configuration
        const queryEndpoint = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(rawContentPayload)}`;
        
        const responseStream = await fetch(queryEndpoint);
        const logicalDataJson = await responseStream.json();
        
        if (logicalDataJson && logicalDataJson[0] && logicalDataJson[0][0]) {
            // Re-compile all matching segment sentence fragments cleanly
            persistentOutputCache = logicalDataJson[0].map(fragment => fragment[0]).join('');
            targetTextDisplay.innerText = persistentOutputCache;
            targetTextDisplay.classList.remove('italic', 'text-slate-500');
            targetTextDisplay.classList.add('text-slate-200');
        } else {
            throw new Error("Payload evaluation exception");
        }
    } catch (exceptionErr) {
        targetTextDisplay.innerText = "Processing nodes congested. Verifying backup routes...";
        triggerSystemNotification("Pipeline latency identified.", true);
    } finally {
        shimmerOverlay.classList.add('opacity-0');
        targetTextDisplay.classList.remove('opacity-30');
    }
}

function purgeSystemDisplayConsoles() {
    persistentOutputCache = "";
    targetTextDisplay.innerText = localizedAppConfig[activeTranslationConfiguration].fallbackPlaceholder;
    targetTextDisplay.classList.add('italic', 'text-slate-500');
    targetTextDisplay.classList.remove('text-slate-200');
}

// SPEECH SYNTHESIS FRAMEWORK (TEXT-TO-SPEECH AUDIO)
function deployAcousticSynthesis(vocalPayloadText, designatorLangCode) {
    if (!vocalPayloadText || vocalPayloadText === localizedAppConfig[activeTranslationConfiguration].fallbackPlaceholder) return;
    
    if (!('speechSynthesis' in window)) {
        triggerSystemNotification("Speech framework access unsupported by host engine.", true);
        return;
    }

    window.speechSynthesis.cancel(); // Abort hanging or unfinished voice channels
    const voiceChannelUtterance = new SpeechSynthesisUtterance(vocalPayloadText);
    voiceChannelUtterance.lang = designatorLangCode;
    
    const hostPlatformVoicesAvailable = window.speechSynthesis.getVoices();
    const optimizedVoiceMatch = hostPlatformVoicesAvailable.find(profileVoice => profileVoice.lang.includes(designatorLangCode));
    if (optimizedVoiceMatch) voiceChannelUtterance.voice = optimizedVoiceMatch;

    window.speechSynthesis.speak(voiceChannelUtterance);
    triggerSystemNotification("Streaming acoustic pronunciation tracking...");
}

speakSrcBtn.addEventListener('click', () => deployAcousticSynthesis(srcTextArea.value, localizedAppConfig[activeTranslationConfiguration].srcCode));
speakTargetBtn.addEventListener('click', () => deployAcousticSynthesis(persistentOutputCache, localizedAppConfig[activeTranslationConfiguration].targetCode));

// HIGH FIDELITY AUDIO DICTATION INTERFACE (SPEECH-TO-TEXT)
const ClientPlatformSpeechEngine = window.SpeechRecognition || window.webkitSpeechRecognition;
if (ClientPlatformSpeechEngine) {
    const acousticSystemProcessor = new ClientPlatformSpeechEngine();
    acousticSystemProcessor.continuous = false;
    acousticSystemProcessor.interimResults = false;

    micBtn.addEventListener('click', () => {
        try {
            acousticSystemProcessor.lang = localizedAppConfig[activeTranslationConfiguration].srcCode;
            acousticSystemProcessor.start();
        } catch(overlappingStateError) {
            acousticSystemProcessor.stop();
        }
    });

    acousticSystemProcessor.onstart = () => {
        micPulse.classList.remove('hidden');
        micIcon.className = "fa-solid fa-microphone-lines text-rose-400 animate-pulse";
        triggerSystemNotification("Vocal recording node active. Speak now...");
    };

    acousticSystemProcessor.onresult = (streamEvent) => {
        const parsedTranscriptionResult = streamEvent.results[0][0].transcript;
        if (parsedTranscriptionResult.trim()) {
            srcTextArea.value = parsedTranscriptionResult;
            charCount.innerText = `${parsedTranscriptionResult.length} / 5000`;
            dispatchTranslationPipeline(parsedTranscriptionResult);
        }
    };

    acousticSystemProcessor.onerror = () => {
        triggerSystemNotification("Audio input mapping processing timed out.", true);
    };

    acousticSystemProcessor.onend = () => {
        micPulse.classList.add('hidden');
        micIcon.className = "fa-solid fa-microphone text-base";
    };
} else {
    micBtn.style.display = 'none'; // Graceful hide if browser platform drops module variables
}

// CLIPBOARD INTERACTION LOGIC
copyBtn.addEventListener('click', () => {
    if (!persistentOutputCache) return;
    navigator.clipboard.writeText(persistentOutputCache).then(() => {
        triggerSystemNotification("Transferred result parameter to system clipboard!");
    }).catch(() => {
        triggerSystemNotification("Clipboard write process rejected.", true);
    });
});

// SYSTEM NOTIFICATION DISPATCH TOAST
function triggerSystemNotification(notificationMessageText, analyticalErrorState = false) {
    toastMessage.innerText = notificationMessageText;
    if (analyticalErrorState) {
        toastIcon.className = "fa-solid fa-triangle-exclamation text-rose-400 text-sm";
        toast.className = "fixed bottom-6 right-6 glass-canvas border-rose-500/40 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transform transition-all duration-500 z-50 text-xs font-bold tracking-wider uppercase opacity-100 translate-y-0";
    } else {
        toastIcon.className = "fa-solid fa-circle-check text-emerald-400 text-sm";
        toast.className = "fixed bottom-6 right-6 glass-canvas border-indigo-500/40 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transform transition-all duration-500 z-50 text-xs font-bold tracking-wider uppercase opacity-100 translate-y-0";
    }
    
    setTimeout(() => {
        toast.className = "fixed bottom-6 right-6 glass-canvas border-indigo-500/40 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 transform translate-y-28 opacity-0 transition-all duration-500 z-50 text-xs font-bold tracking-wider uppercase";
    }, 3500);
}

// Pre-warm up system accent allocations
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {};
}
