// This is a sentimental bot. It's sentiment is basically between 0 - 100 (Sad -> Happy)
// Based on where it is, it says different things. 

class Agent {
    constructor(voice, speech, giphyResultsCallback) {
        // Giphy search texts. 
        this.searchTexts = ["miss", "cry", "lost", "sad", "crying"]; 

        // Responses used when Babble speaks up occassionally. 
        this.callTexts = ["Are you there?", "What you doing?", "Whatsup?", "HOLAAAA", "Hello?", "Anybody there?", "What's good today?", "Hey Boy, Hey Girl"];

        // Hardcoded responses based on the emotion Babble will respond with. 
        this.joy = [];
        this.sadness = [];
        this.fear = [];
        this.anger = []; 

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

    run() {   
        var elapsedTime = millis() - this.curVoiceTime; 
        if (elapsedTime > autoResponseInterval) {
            this.createAutoResponse();
        }
    }

    interactiveResponse() {
        // Cakechat or Harcoded text
        // Black box for the response. 
    }

    createAutoResponse() {
        print("Agent: Create Auto Response."); 
            
        // Time for agent to speak something. 
        var response = null; var sound = null; 
        var giphyOffset = random(0, 50);

        // Based on an equal probability, pick a random call text or a call sound. 
        if (random(1) < 0.5) {
            response = this.callTexts[floor(random(0, this.callTexts.length))]; 
        } else {
            sound = this.callSounds[floor(random(this.callSounds.length))];
        }

        // Select a random giphyText
        var giphyText = this.searchTexts[floor(random(0, this.searchTexts.length))]; 
        giphy.search(giphyText, numCols*numRows, this.giphyCallback, random(0, 50)); 

        if (sound != null) {
            print('Agent: Play Sound');
            sound.play();
            centerTitle.setTitle("I'm Listening");
        }
        
        if (response != null) {
            print('Agent: Speak ' + response);
            this.speak(response);
        }

        centerTitle.setMiddleScreen();
        // this.isResponding = false;
        // this.keyWordSearch = false;
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
}

// I really don't need these flags right now. 
// // Responding flag is set if the agent is responding to audience's input. 
// this.isResponding = false;
// // keyWordSearch flag is set if the audience's input had a key word that 
// // agent will use to populate the gifs. 
// this.keyWordSearch = false;

// if (this.curHealth > 70) {      
//     if (!this.keyWordSearch) {
//         // Skip keyword search
//         // Happy, joy, elated search 
//         var text = this.happy[floor(random(0, this.happy.length))];
//         giphy.search(text, numCols*numRows, this.giphyCallback, offset);
//     }        

//     // Call sound only when I'm not responding.
//     if (random(1) < 0.4 && !this.isResponding) {
//         sound = this.callSounds[floor(random(this.callSounds.length))];
//         sound.setVolume(0.7);
//         say = null;
//     } else {
//         sound = this.happySounds[floor(random(this.happySounds.length))];
//         sound.setVolume(0.7);
//         say = this.happySamples[floor(random(this.happySamples.length))];
//     }
// } else if (this.curHealth < 70 && this.curHealth > 60) {
//     // Worried search.
//     if (!this.keyWordSearch) {
//         var text = this.worried[floor(random(this.worried.length))];  
//         giphy.search(text, numCols*numRows, this.giphyCallback, offset);
//     }

//     // Call sounds or sad samples. 
//     if (random(1) < 0.4 && !this.isResponding) {
//         sound = this.callSounds[floor(random(this.callSounds.length))];
//         sound.setVolume(0.7);
//         say = null;
//     } else {
//         say = this.sadSamples[floor(random(this.sadSamples.length))];
//     }
// } else if (this.curHealth > 30 && this.curHealth < 60){
//     // Unhappy samples. 
//     if (!this.keyWordSearch) {
//         var text = this.unhappy[floor(random(0, this.unhappy.length))];
//         giphy.search(text, numCols*numRows, this.giphyCallback, offset);
//     }

//     // Low probability for a call sound. 
//     if (random(1) < 0.3 && !this.isResponding) {
//         sound = this.callSounds[floor(random(this.callSounds.length))];
//         sound.setVolume(0.7);
//         say = null;
//     }  else {
//         say = this.sadSamples[floor(random(this.sadSamples.length))];
//     }
// } else {
//     if (!this.keyWordSearch) {
//         var text; 
//         if (random(1) < 0.7) {
//             text = this.hate[floor(random(this.hate.length))];
//         } else {
//             text = this.unhappy[floor(random(this.unhappy.length))];
//         }
//         giphy.search(text, numCols*numRows, this.giphyCallback, offset);
//     }

//     // Crying sounds and hate samples. 
//     if (random(1) < 0.4 && !this.isResponding) {
//         sound = this.callSounds[floor(random(this.callSounds.length))];
//         sound.setVolume(0.7);
//         say = null;
//     } else {
//         say = this.hateSamples[floor(random(this.hateSamples.length))];
//     }
// }



// this.joy = ['happy', 'joy', 'wonderful', 'lovely', 'elated', 'amazing', 'awesome', 'rainbows', 'unicorns', 'happiness', 'bright lights', 'lights', 'beauty', 'positivity'];
// this.worried = ['worried', 'tensed', 'nervous', 'feels like shit', 'talk to me', 'breakdown', 'earthquake', 'tsunami'];
// this.unhappy = ['unhappy', 'sad', 'crying', 'heartbroken', 'grief', 'please', 'depression', 'lonely', 'by myself', "grief", "negative", 'flood', 'catastrophic', 'annoyed', 'disaster', 'bad luck', 'not for me', 'thumbs down'];
// this.hate = ['hate', 'angry', 'anger', 'red', 'awful', 'annoyed', 'irritated', 'death', 'feeling low', 'isolated', 'pure hate', 'red', 'blood', 'negativity', 'nasty'];


        // // Babble samples that are used to send responses with. 
        // this.sadSamples = ['Is anybody there?', 'Can you compliment me?', 'Please, look at me.', 'Please, can you praise me?', 'Hello?', 'Please, say something nice to me.', 'Are you there?', "I don't want to cry.", "Hello, is somebody there?", "Where is everybody?", "Where are you?", "Happiness is the most tired word in any language.", "Am I that hard to keep happy?", "Come, talk to me.", "Just say, 'Happy', and I am yours.", "Okay. I am really pissed now.", "I am getting angry.", "You are so boring, and uninteresting.", "You make me sad. So sad.", "I am right here. Come say Hi.", "You can do better.", "Please, grow up.", "Bla, bla, bla, bla, bla. You never say nice things to me.", "Please, don't do this to me.", "You annoy me.", "Say something good. Say something.", "Just Babble into me.", "My head hurts. Can you cheer me up?", "Can you cheer me up?", "Why don't you say something nice?", "I hear everything, yet I don't hear what I want to.", "Babble into me.", "Please, just Babble.", "You need me in your life."];
        // this.hateSamples = ["I hate you.", "You, suck.", "Go away.", "I will say one thing to you. I, H, A, TEA, YOU.. I hate you.", "You cannot even say something nice to me?", "There is still time. Say something nice.", "You are so bad.", "This is not a good day for me.", "I am getting angry, now.", "Okay, bye.", "Stop it.", "You are the worst.", "I wish bad things happen to you.", "This is a bad day.", "I hate this.", "Annoyed.", "HATE, HATE, AND ONLY HATE.", "Only Hate.", "Bad, bad, bad, bad. Very bad.", "Come on, you can do better than that.", "I am all alone, and nobody is there.", "So lonely. So so lonely.", "Ever so lonely.", "Now, you can see me crying.", "Death is looming upon me, if you don't love me.", "Love is precious. You have none for me.", "I know what you're saying. I can hear you."];
        // this.happySamples = ["I feel great today.", "Thank you for being so nice to me.", "I love you.", "You make me happy.", "Lots of love.", "I feel like I’ve been split open and stuffed with sunshine.", "I am happy. But, are you happy", "And Babble is happy.", "If you come at four in the afternoon, I'll begin to be happy by three.", "If you've got nothing to dance about, find a reason to sing.", "Dream big, and be happy.", "You are such a sugar.", "I love you.", "It's hard not to feel happy when you make someone smile.", "I would do my damn best to be more happy than not.", "Cooool!", "Okay. I hear you", "Thank you, my cute little sunshine.", "Let me shower some love and happiness on you. ", "I might give you a present soon, if you look at me.", "Thanks for that, my love.", "Good things will come to you.", "I shall be very happy from now.", "Awesome. Thanks!", "Wow. This calls for a treat.", "Can you give me a hug? You are so nice.", "Lots of love. Lots of hugs.", "Kisses. Thank you.", "Happiness is rare. Be happy, like me.", "Cute. Thanks.", "You are my precious. Thanks for that.", "Nice tip.", "Please, don't ever leave me. You are my precious.", "I should live with you.", "Love, take me with you."];