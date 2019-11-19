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
        this.stopD = false; 
    }

    start() {
        this.isRunning = true;
        this.speechRec.start();
    }

    stop() {
        this.speechRec.rec.stop();
    }

    endAudio() {
        if (this.stopD == true) {
            print("Stopped speech recognition deliberately.");
            this.isRunning = false;
            this.stopD = false;
        } else {
            print("Error: Restart speech recognition."); 
            this.speechRec.start();
            this.isRunning = true;
        }
    }
    
    errorAudio() {
       // print("Ooops, some error.");
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
