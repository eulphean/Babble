// API controller for the Speech recognition web service. 
class Speech {
    constructor(speechResult) {
        this.speechRec = new p5.SpeechRec('en-In', this.gotSpeech.bind(this));
        this.speechRec.onEnd = this.endAudio.bind(this);
        this.speechRec.onError = this.errorAudio.bind(this);
        this.speechRec.onStart = this.startAudio.bind(this);
        this.speechRec.continuous = true; 
        this.speechRec.interimResults = true;
        this.callback = speechResult; 

        this.isRunning = false;

        // Should we stop the engine deliberately? 
        this.stopDeliberately = false; 
    }

    start() {
        this.isRunning = true;
        this.speechRec.start();
    }

    stop() {
        this.isRunning = false;
        this.speechRec.rec.stop();
    }

    endAudio() {
        if (this.stopDeliberately == true) {
            print("Stopped speech recognition deliberately.");
            this.stopDeliberately = false;
        } else {
            print("Error: Restart audio."); 
            this.speechRec.start();
            this.isRunning = true;
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
        speechResult(result, isFinal);
    }

}
