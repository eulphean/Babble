class VoiceSpeech {
    constructor(speechLoaded, speechStarted, speechEnded) {
        this.myVoice = new p5.Speech('Veena', speechLoaded); 
        this.myVoice.setVolume(1); 
        this.myVoice.setRate(0.8);
        this.myVoice.setPitch(0.5);
        this.myVoice.utterance.onerror = this.error; 
        this.myVoice.onLoad = speechLoaded;
        this.myVoice.onStart = speechStarted; 
        this.myVoice.onEnd = speechEnded;
    }

    utter(text) {
        this.myVoice.speak(text);
    }

    error(e) {
        print(e);
    }
}