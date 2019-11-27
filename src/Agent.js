// This is a sentimental bot. It's sentiment is basically between 0 - 100 (Sad -> Happy)
// Based on where it is, it says different things. 

class Agent {
    constructor(voice, speech, giphyResultsCallback) {
        // Giphy search texts. 
        this.searchTexts = ["miss", "cry", "lost", "sad", "crying"]; 

        // Responses used when Babble speaks up occassionally. 
        this.callTexts = ["Are you there?", "What you doing?", "Whatsup?", "HOLAAAA", "Hello?", "Anybody there?", "What's good today?"];

        // Hardcoded responses based on the emotion Babble will respond with. 
        this.joy = ["I feel great today.", "Thank you for being so nice to me.", "I love you.", "You make me happy.", "Lots of love.", "I feel like I’ve been split open and stuffed with sunshine.", "I am happy. But, are you happy", "And Babble is happy.", "If you come at four in the afternoon, I'll begin to be happy by three.", "If you've got nothing to dance about, find a reason to sing.", "Dream big, and be happy.", "You are such a sugar.", "I love you.", "It's hard not to feel happy when you make someone smile.", "I would do my damn best to be more happy than not.", "Cooool!", "Okay. I hear you", "Thank you, my cute little sunshine.", "Let me shower some love and happiness on you. ", "I might give you a present soon, if you look at me.", "Thanks for that, my love.", "Good things will come to you.", "I shall be very happy from now.", "Awesome. Thanks!", "Wow. This calls for a treat.", "Can you give me a hug? You are so nice.", "Lots of love. Lots of hugs.", "Kisses. Thank you.", "Happiness is rare. Be happy, like me.", "Cute. Thanks.", "You are my precious. Thanks for that.", "Nice tip.", "Please, don't ever leave me. You are my precious.", "I should live with you.", "Love, take me with you."];
        
        this.fear = ["Stop it, please.", "You scare me.", "I feel scared.", "Stop this!", "Stop it.", ];

        this.sadness = ['Is anybody there?', 'Can you compliment me?', 'Please, look at me.', 'Please, can you praise me?', 'Hello?', 'Please, say something nice to me.', 'Are you there?', "I don't want to cry.", "Hello, is somebody there?", "Where is everybody?", "Where are you?", "Happiness is the most tired word in any language.", "Am I that hard to keep happy?", "Come, talk to me.", "Just say, 'Happy', and I am yours.", "Okay. I am really pissed now.", "I am getting angry.", "You are so boring, and uninteresting.", "You make me sad. So sad.", "I am right here. Come say Hi.", "You can do better.", "Please, grow up.", "Bla, bla, bla, bla, bla. You never say nice things to me.", "Please, don't do this to me.", "You annoy me.", "Say something good. Say something.", "Just Babble into me.", "My head hurts. Can you cheer me up?", "Can you cheer me up?", "Why don't you say something nice?", "I hear everything, yet I don't hear what I want to.", "Babble into me.", "Please, just Babble.", "You need me in your life."];

        this.anger = ["I hate you.", "You, suck.", "Go away.", "I will say one thing to you. I, H, A, TEA, YOU.. I hate you.", "You cannot even say something nice to me?", "There is still time. Say something nice.", "You are so bad.", "This is not a good day for me.", "I am getting angry, now.", "Okay, bye.", "Stop it.", "You are the worst.", "I wish bad things happen to you.", "This is a bad day.", "I hate this.", "Annoyed.", "HATE, HATE, AND ONLY HATE.", "Only Hate.", "Bad, bad, bad, bad. Very bad.", "Come on, you can do better than that.", "I am all alone, and nobody is there.", "So lonely. So so lonely.", "Ever so lonely.", "Now, you can see me crying.", "Death is looming upon me, if you don't love me.", "Love is precious. You have none for me.", "I know what you're saying. I can hear you."]; 

        // When agent has to speak something, it calls utter method on the voice engine. 
        this.voiceEngine = voice;

        // Begin speech recognition.
        this.speechEngine = speech;
        this.speechEngine.start();
        this.isSpeaking = false;

        // Search results callback.
        this.giphyCallback = giphyResultsCallback;

        // How often does Babble speak up? 
        this.curVoiceTime = millis();

        // Load sound samples. 
        this.notificationSounds = [];
        this.callSounds = [];
        this.loadSounds();

        // Starting Gifs. 
        var text = this.searchTexts[floor(random(0, this.searchTexts.length))];
        giphy.search(text, numCols*numRows, this.giphyCallback, random(0, 50)); 
    }

    loadSounds() {
        var sound;

        // Call sounds. 
        sound = loadSound('assets/psst.m4a');
        this.callSounds.push(sound);
        sound = loadSound('assets/whistle1.wav');
        this.callSounds.push(sound);
        sound = loadSound('assets/whistle2.wav');
        this.callSounds.push(sound);
        sound = loadSound('assets/shh.wav');
        this.callSounds.push(sound);

        // Notification sounds. 
        sound = loadSound('assets/notification1.wav');
        this.notificationSounds.push(sound);
        sound = loadSound('assets/notification2.wav');
        this.notificationSounds.push(sound); 
    }

    run() {   
        var elapsedTime = millis() - this.curVoiceTime; 
        if (elapsedTime > autoResponseInterval) {
            this.createAutoResponse();
        }
    }

    interactiveResponse(sentiment, originalText) {
        // Extract emotion from sentiment. 
        var response; 
        var emotion = this.getEmotion(sentiment); 
        console.log("Agent: Emotion is " + emotion); 
        if (isCakechatEnabled) {
            cakechat.getResponse(originalText, emotion, this.cakechatCallback.bind(this)); 
        } else {
            // Sound and speak
            this.playNotification(); 
            var response = this.getResponse(emotion);
            this.speak(response);

            centerTitle.setMiddleScreen();
            this.curVoiceTime = millis();  
        }
    }

    cakechatCallback(result, emotion) {
        var response; 
        if (result == "ERROR") {
            isCakechatEnabled = false; 
            console.log("Cakechat is unavailable.");
            response = this.getResponse(emotion);
        } else {
            response = result; 
            console.log("Agent: Cakechat response is " + response);
        }

        // Sound and speak. 
        this.playNotification();
        this.speak(response); 

        centerTitle.setMiddleScreen();
        this.curVoiceTime = millis();  
    }

    getEmotion(sentiment) {
        var emotion; 
        // Not super satisfactory but a decent emotion chart. 
        if (sentiment > 0.6) {
            emotion = Emotion.joy;
        } else if (sentiment > 0.4 && sentiment < 0.6) {
            emotion = Emotion.fear; 
        } else if (sentiment > 0.2 && sentiment < 0.4) {
            emotion = Emotion.sadness; 
        } else if (sentiment > 0 && sentiment < 0.2) {
            emotion = Emotion.anger; 
        }
        return emotion; 
    }

    getResponse(emotion) {
        var response; 
        switch(emotion) {
            case Emotion.joy: {
                response = this.joy[floor(random(0, this.joy.length))]; 
                break; 
            }

            case Emotion.fear: {
                response = this.fear[floor(random(0, this.fear.length))]; 
                break;
            }

            case Emotion.sadness: {
                response = this.sadness[floor(random(0, this.sadness.length))]; 
                break;
            }

            case Emotion.anger: {
                response = this.anger[floor(random(0, this.anger.length))]; 
                break;
            }

            default: 
                break; 
        }

        console.log("Agent: Hardcoded Response - " + response);
        return response; 
    }

    createAutoResponse() {
        print("Agent: Create Auto Response."); 
            
        // Time for agent to speak something. 
        var response = null; var sound = null; 
        var giphyOffset = random(0, 200);

        // Based on an equal probability, pick a random call text or a call sound. 
        if (random(1) < 0.8) {
            response = this.callTexts[floor(random(0, this.callTexts.length))]; 
        } else {
            sound = this.callSounds[floor(random(this.callSounds.length))];
        }

        // Select a random giphyText
        var giphyText = this.searchTexts[floor(random(0, this.searchTexts.length))]; 
        giphy.search(giphyText, numCols*numRows, this.giphyCallback, giphyOffset); 

        if (sound != null) {
            print('Agent: Play Sound');
            sound.play();
            centerTitle.setTitle("I'm Listening");
        }
        
        if (response != null) {
            this.playNotification();
            print('Agent: Speak ' + response);
            this.speak(response);
        }

        centerTitle.setMiddleScreen();
        this.curVoiceTime = millis();  
    }

    speak(say) {
        if (say != null) {
            // Stop speech recognition as soon as it starts speaking. 
            if (this.speechEngine.isRunning) {
                this.speechEngine.stopD = true;
                this.speechEngine.stop();
            }
            
            // Utter the words. 
            this.isSpeaking = true;
            this.voiceEngine.utter(say);
        }
    }

    playNotification() {
        // Play a sound
        var sound = this.notificationSounds[floor(random(0, this.notificationSounds.length))];
        sound.setVolume(0.3);
        sound.play();
    }
}