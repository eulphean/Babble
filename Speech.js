// API controller for the Speech recognition web service. 
class Speech {
    constructor(speechResult) {
        this.speechRec = new p5.SpeechRec('en-In', this.gotSpeech.bind(this));
        this.speechRec.onEnd = this.endAudio.bind(this);
        this.speechRec.onError = this.errorAudio.bind(this);
        this.speechRec.onStart = this.startAudio.bind(this);
        this.speechRec.continuous = true; 
        this.speechRec.interimResults = false;
        this.callback = speechResult; 

        // Should we stop the engine deliberately? 
        this.stopDeliberately = false; 
    }

    start() {
        this.speechRec.start();
    }

    endAudio() {
        if (this.stopDeliberately == true) {
            print("Stopped audio deliberately.");
            this.stopDeliberately = false;
        } else {
            print("Error: Restart audio."); 
            this.speechRec.start();
        }
    }
    
    errorAudio() {
        print("Ooops, some error.");
    }

    startAudio() {
        print("Begin speech recognition.");
    }

    gotSpeech() {
        var result = this.speechRec.resultString; 
        var confidence = this.speechRec.resultConfidence; 
        var isFinal = this.speechRec.isFinal;
        print(result + ", " + confidence + ", " + isFinal);
        speechResult(result);
    }

}
