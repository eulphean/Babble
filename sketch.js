// Fullscreen on firefox
//document.getElementsByTagName('html')[0].mozRequestFullScreen();void(0)

// Display.
var canvas; 
var numCols = numRows = 8; // # gifs/row and # of rows.  
var parentDiv; 
var gifWidth, gifHeight;  
var gifElements = []; 
var minGifsToUpdate = 15; 
var maxGifsToUpdate = 25; // Maximum gifs a search query can update on the wall. 
var timeToWaitBeforeSpeaking = 5000; // 10 seconds.  
var bgColors = [];
var searchIcons = ['magnify1.svg', 'magnify2.svg', 'magnify3.svg', 'magnify4.svg', 'magnify5.svg'];
var button;

// APIs controllers. 
var giphy; var searchGifLimit = maxGifsToUpdate;
var speech;
var voice; 

// Sounds. 
var whistle;
var notifications;
var voiceTimer = null;
var isSpeaking = false;
var hasResponded = false;
var State = {
  Babble: 1,
  Responding: 2
};

var speakingState = State.Babble;

// Personality sentences. 
var babble = ["Look at me, please?", "Babble into me.", "Babble.", "Babble it away.", "Let us Babble with each other.", "Babble gabble.", "Come gabble with me.", "Please, check out this wall. It's only for you, love."];
var seduce = ["Please, talk to me?", "I, miss, you.", "I am here for you.", "Can I show you something? Ask me, please.", "What would you like to see?", "Can I make you happy? Just Babble the words.", "I am yours, and you are mine. Let us Babble.", "I am sad. Are you there?", "Can I get you something?"];
var acknowledge = ["I heard you.", "Right on.", "Got that.", "Well said.", "Beautiful"];
var looking = ["Let me see what I have.", "I might have something for you.", "Now, see this."];
var notfound = ["Nada! Nothing found.", "I apologize. Nothing with that here.", "Sorry, not your day today."];

// Property to save indexes for future. 
var newIdxUrls = [];
var randomPosition;

// Center title 
var centerTitle; 

function preload() {
  
  whistle = loadSound('assets/psst.m4a');
  notification = loadSound('assets/notification2.wav');
  notification.setVolume(0.5);
}

function setup() {
  noStroke(); 
  noSmooth();

  // Canvas setup. 
  canvas = createCanvas(screen.width, screen.height);
  canvas.position(0, 0);
  canvas.style('display', 'block');
  canvas.style('z-index', -1);

  // Gif dimensions
  gifWidth = screen.width/numCols; 
  gifHeight = screen.height/numRows; 

  //Setup parent gif. 
  parentDiv = createDiv();
  
  // Initialize the gif wall elements. 
  initGifWall();

  // Create the controller instance. 
  giphy = new Giphy();
  giphy.trending(numRows*numCols, trending);

  // Create background colors
  initBgColors();

  // Initialize the center title 
  centerTitle = new CenterTitle(); 

  // Initialize voice engine. 
  voice = new VoiceSpeech(voiceStarted, voiceEnded);

  // Initialize speech engine. 
  speech = new Speech(speechResult); 
}

// Babble speaks. 
function speak(isResponding) {
  // Turn off speech recognition deliberately before speaking. 
  if (speech.isRunning) {
    speech.stopDeliberately = true;
    speech.stop();
  }

  // Speak something.
  var text; 
  if (isResponding) {
    text = acknowledge[floor(random(acknowledge.length))];
  } else {
    // 40 percent chance it'll babble.
    if (random(1) < 0.4) {
      text = babble[floor(random(babble.length))];
    } else {
      // 60 percent chance it'll seduce.
      text = seduce[floor(random(seduce.length))];
    }
  }

  // A sound buzz.
  notification.play();
  voice.utter(text);
}

function voiceStarted() {
  centerTitle.hide = true;
  isSpeaking = true;
}

function voiceEnded() {
  // Show center title since the voice is done.
  centerTitle.listening = true; // So, it starts showing listening text. 
  centerTitle.hide = false;

  // Only reset timer if I'm still Babbling
  if (speakingState == State.Babble || speakingState == State.Responding) {
    print('Resetting timer');
    clearTimeout(voiceTimer);
    voiceTimer = setTimeout(speak, timeToWaitBeforeSpeaking);
  }

  if (!speech.isRunning) {
    // Turn on speech recognition.
    print('Is Running: ' + speech.isRunning);
    speech.start();
  }

  isSpeaking = false;
}

// Results from the Speech recognition algorithm. 
// Receiving interim results from the speech recognition 
// engine now. As soon as a result comes, 
// 1: turn off any Voice if it's going on. 
// 2: clear timer so next automatic voice is not scheduled. 
// 3: respond with a response immediately (before isFinal is true). Then respond when isFinal is true.
// 4: when isFinal is true, then print the result and also search Giphy. 
function speechResult(result, isFinal) {
    speakingState = State.Responding;
    print(result);

    if (!isFinal) {
      // Stop the voice if there is any. 
      if (isSpeaking) {
        print('Stop speaking');
        voice.stop();
      }

      // Clear timer if we haven't cleared it already. 
      if (voiceTimer) {
        clearTimeout(voiceTimer);
      }
    } else {
      // isFinal = true. Reset hasResponded flag.
      print(result);
      giphy.search(result, searchGifLimit, searchResults);
      speak(true);
    }
  // // Cancel the timer because somebody just spoke.
  // print('Clearing timer.');
  // if (voiceTimer != null) {
  //   clearTimeout(voiceTimer);
  //   voiceTimer = null;
  // }

  // // Respond with the response and let the timer initiate again.
  // speak(true);
  
  // // Don't set the text right. 
  // //centerTitle.setVoiceText(result);
  // giphy.search(result, searchGifLimit, searchResults);
}

function draw() {
  // Draw background. 
  for (var x = 0; x < numCols; x++) {
    for (var y = 0; y < numRows; y++) {
      var idx = x + y*numCols;
      fill(bgColors[idx]);
      rect(x*gifWidth, y*gifHeight, gifWidth, gifHeight);
    }
  }

  centerTitle.run(speak);
}

// Callback functions for trending gifs. 
function trending(gData) {
  numResults = gData.data.length; 
  for (let i = 0; i < numResults; i++) {
    var gifUrl = gData.data[i].images.fixed_width_downsampled.url; 
    gifElements[i].attribute('src', gifUrl);
  }
}

function searchResults(gData) {
  // Figure out what say here. 
  let numGifsReturned = gData.data.length; 
  let maxGifs = numGifsReturned > maxGifsToUpdate ? maxGifsToUpdate : numGifsReturned; 
  let numGifsToUpdate = numGifsReturned <= minGifsToUpdate ? numGifsReturned : floor(random(minGifsToUpdate, maxGifs + 1)); 

  for (let i = 0; i < numGifsToUpdate; i++) {
    let idx; 
    do {
      idx = floor(random(gifElements.length));
    } while (newIdxUrls.hasOwnProperty(idx));

    // Clear the div at that index. 
    let randIconIdx = floor(random(searchIcons.length));
    let iconString = 'assets/' + searchIcons[randIconIdx];
    gifElements[idx].attribute('src', iconString);

    // Create an object {index: url} to update in setNewGifs method. 
    var gifUrl = gData.data[i].images.fixed_width_downsampled.url;
    newIdxUrls[idx] = gifUrl; 
  }

  // Wait for some time, then load new gifs.  
  setTimeout(setNewGifs, 5000);
}

function setNewGifs() {
  for (var idx in newIdxUrls) {
    var newUrl = newIdxUrls[idx]; 
    gifElements[idx].attribute('src', newUrl);
  } 
  // Clear the old object. 
  newIdxUrls = [];
}

function initBgColors() {
  for (var x = 0; x < numCols; x++) {
    for (var y = 0; y < numRows; y++) {
      var idx = x + numCols*y; 
      var prob = random(1); 
      if (prob < 0.25) {
        bgColors[idx] = color('#972E2E');
      } else if (prob < 0.5) {
        bgColors[idx] = color('#FFD65C');
      } else if (prob < 0.75) {
        bgColors[idx] = color('#6FEDB7');
      } else {
        bgColors[idx] = color('#55596A');
      }
    }
  }
}

function initGifWall() {
  for (let x = 0; x < numCols; x++) {
    for (let y = 0; y < numRows; y++) {
      // <img> element with empty content. 
      var img = createImg('assets/ring.svg'); 
      img.size(gifWidth, gifHeight);
      img.position(x*gifWidth, y*gifHeight);
      img.parent(parentDiv); // Parent div is the root container. 
      
      var idx = x + numCols * y; 
      gifElements[idx] = img; 
    }
  }
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function windowResized() {
  centerCanvas();
}
