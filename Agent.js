// This is a sentimental bot. It's sentiment is basically between 0 - 100 (Sad -> Happy)
// Based on where it is, it says different things. 

class Agent {
    constructor(voice, speech, giphyResultsCallback) {
        // When agent has to speak something, it calls utter method on the voice engine. 
        this.voiceEngine = voice;
        this.curHealth = 100; 
        this.maxHealth = 100;  // 100 means happy - 0 means super sad. 
        this.isDead = false;
        this.hasQueried = false;

        // How often does the bot's health decrease. 
        this.curHealthTime = millis();
        this.maxHealthTime = 1000; // Wait this time before evaluating health.
        this.subtractHealth = 0.5;

        // Corpus of health texts that the agent uses at specific intervals of its health.
        this.happy = ['happy', 'joy', 'wonderful', 'lovely', 'elated', 'amazing', 'awesome', 'rainbows', 'unicorns', 'happiness'];
        this.worried = ['worried', 'tensed', 'nervous', 'feels like shit', 'anybody there'];
        this.unhappy = ['unhappy', 'sad', 'crying', 'heartbroken', 'grief', 'please', 'depression', 'lonely', 'by myself'];
        this.hate = ['hate', 'angry', 'anger', 'red', 'awful', 'annoyed', 'irritated'];

        // Voice (how often does the bot speak or create sounds to express itself?)
        this.curVoiceTime = millis();
        this.maxVoiceTime = 10000;

        // Voice sample
        this.sadSamples = ['Is anybody there?', 'Can you compliment me?', 'Please, look at me.', 'Please, talk to me.', 'Please, say something.', 'Hello?', 'Please, say something nice to me.', 'Are you there?', "I don't want to cry.", "Hello, is somebody there?", "Please talk to me."];
        this.hateSamples = ["I hate you.", "You could not even say something nice to me?", "There is still time. Say something nice."];
        this.happySamples = ["I feel great today.", "Thank you for being so nice to me.", "I love you.", "You make me happy."];

        // Load sound samples.
        this.happySounds = [];
        this.loadHappySounds();

        // Whistle, sssh, psst.
        this.callSounds = [];
        this.loadCallSounds();

        // Crying sounds. 
        this.sadSounds = [];
        this.loadSadSounds();

        // Search results callback.
        this.giphyCallback = giphyResultsCallback;

        // Begin speech recognition.
        this.speechEngine = speech;
        this.speechEngine.start();
        this.isSpeaking = false;

        print(this.speechEngine);
        
        // Search for happy text. 
        var text = this.happy[floor(random(0, this.happy.length))];
        giphy.search(text, numCols*numRows, this.giphyCallback, random(0, 50));
    }

    run() {   
        // Should I update bot's health?
        this.evaluateHealth();

        // Should the bot speak?
        this.evaluateVoice();
    }

    evaluateHealth() {
        if (millis() - this.curHealthTime > this.maxHealthTime) {
            if (this.curHealth >= 0) {
                this.curHealth -= this.subtractHealth;
                print('Cur Health' + this.curHealth);
                this.curHealthTime = millis();
                this.isDead = false;
                this.hasQueried = false;
            } else {
                this.isDead = true;
            }
        }
    }

    evaluateVoice() {
        if (millis() - this.curVoiceTime > this.maxVoiceTime) {
            var say, sound;
            var offset = random(0, 50);

            if (this.curHealth > 70) {
                // Happy, joy, elated search 
                var text = this.happy[floor(random(0, this.happy.length))];
                giphy.search(text, numCols*numRows, this.giphyCallback, offset);

                // Call sounds/happy sounds, happy samples.
                if (random(1) < 0.3) {
                    sound = this.callSounds[floor(random(this.callSounds.length))];
                    sound.setVolume(0.7);
                    say = null;
                } else {
                    sound = this.happySounds[floor(random(this.happySounds.length))];
                    sound.setVolume(0.7);
                    say = this.happySamples[floor(random(this.happySamples.length))];
                }
            } else if (this.curHealth < 70 && this.curHealth > 60) {
                // Worried search.
                var text = this.worried[floor(random(this.worried.length))];  
                giphy.search(text, numCols*numRows, this.giphyCallback, offset);

                // Call sounds or sad samples. 
                if (random(1) < 0.3) {
                    sound = this.callSounds[floor(random(this.callSounds.length))];
                    sound.setVolume(0.7);
                    say = null;
                } else {
                    say = this.sadSamples[floor(random(this.sadSamples.length))];
                }
            } else if (this.curHealth > 5 && this.curHealth < 60){
                // Unhappy samples. 
                var text = this.unhappy[floor(random(0, this.unhappy.length))];
                giphy.search(text, numCols*numRows, this.giphyCallback, offset);

                // Low probability for a call sound
                if (random(1) < 0.1) {
                    sound = this.callSounds[floor(random(this.callSounds.length))];
                    sound.setVolume(0.7);
                    say = null;
                }  else {
                    // sound = this.sadSounds[floor(random(this.sadSounds.length))];
                    // sound.setVolume(1.0);
                    say = this.sadSamples[floor(random(this.sadSamples.length))];
                }
            } else {
                var text; 
                if (random(1) < 0.5) {
                    text = this.hate[floor(random(this.hate.length))];
                } else {
                    text = this.unhappy[floor(random(this.unhappy.length))];
                }

                giphy.search(text, numCols*numRows, this.giphyCallback, offset);

                // Crying sounds and hate samples. 
                if (random(1) < 0.2) {
                    sound = this.callSounds[floor(random(this.callSounds.length))];
                    sound.setVolume(0.7);
                    say = null;
                } else {
                    // sound = this.sadSounds[floor(random(this.sadSounds.length))];
                    // sound.setVolume(1.0); 
                    say = this.hateSamples[floor(random(this.hateSamples.length))];
                }
            }
            
            if (sound != null) {
                sound.play();
            }

            this.speak(say);

            this.curVoiceTime = millis();
        }
    }

    speak(say) {
        if (say != null) {
            // Stop speech recognition as soon as it starts speaking. 
            if (this.speechEngine.isRunning) {
                this.speechEngine.stopD = true;
                this.speechEngine.stop();
            }
            
            if (text != null) {
                this.voiceEngine.utter(say);
            }
            
            this.isSpeaking = true;
        }
    }

    loadHappySounds() {
        var sound;
        sound = loadSound('assets/notification1.wav');
        this.happySounds.push(sound);
        sound = loadSound('assets/notification2.wav');
        this.happySounds.push(sound);
    }

    loadCallSounds() {
        var sound; 
        sound = loadSound('assets/psst.m4a');
        this.callSounds.push(sound);
        // sound = loadSound('assets/whistle1.wav'); // Don't like this sound.
        // this.callSounds.push(sound);
        sound = loadSound('assets/whistle2.wav');
        this.callSounds.push(sound);
        sound = loadSound('assets/shh.wav');
        this.callSounds.push(sound);
    }

    loadSadSounds() {
        var sound; 
        sound = loadSound('assets/crying1.wav');
        this.sadSounds.push(sound);
        sound = loadSound('assets/crying2.wav');
        this.sadSounds.push(sound);
    }
}