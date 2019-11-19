class VoiceSpeech {
    constructor(speechStarted, speechEnded) {
        this.myVoice = new p5.Speech('Google हिन्दी'); 
        this.myVoice.setVolume(1); 
        this.myVoice.setRate(0.77);
        this.myVoice.setPitch(0.92);
        this.myVoice.utterance.onerror = this.error; 
        this.myVoice.onStart = speechStarted; 
        this.myVoice.onEnd = speechEnded;
    }

    utter(text) {
        this.myVoice.speak(text);
    }

    stop() {
        this.myVoice.stop();
    }

    error(e) {
        print(e);
    }
}