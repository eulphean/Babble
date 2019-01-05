// API controller for the Speech recognition web service. 
class Speech {
    constructor(speechResult) {
        this.speechRec = new p5.SpeechRec('en-In', this.gotSpeech.bind(this));
        this.speechRec.onEnd = this.endAudio.bind(this);
        this.speechRec.onStart = this.startAudio.bind(this);
        this.speechRec.continuous = true; 
        this.speechRec.interimResults = false;
        this.callback = speechResult; 
        this.speechRec.start();
    }

    endAudio() {
        print("Oops, audio ended abruptly. Restarting audio.");
        this.speechRec.start();
    }

    startAudio() {
        print("Opening the audio channel for speech recognition.");
    }

    gotSpeech() {
        var result = this.speechRec.resultString; 
        var confidence = this.speechRec.resultConfidence; 
        var isFinal = this.speechRec.isFinal;
        print(result + ", " + confidence + ", " + isFinal);
        speechResult(result);
    }

}
