// # gifs/row and # of rows.  
var numCols = 6;
var numRows = 8; 

// Display.
var canvas; 
var parentDiv; 
var gifWidth, gifHeight;  
var gifElements = []; 
var minGifsToUpdate = 15; 
var maxGifsToUpdate = 40; // Maximum gifs a search query can update on the wall. 
var bgColors = [];
var ringSvg = 'assets/ring.svg'; 

// API controllers. 
var searchGifLimit = maxGifsToUpdate;
var giphy, speech, voice, textAnalytics;

// Property to save indexes for future. 
var newIdxUrls = [];

// Center title 
var centerTitle; 
// Babble Wall agent that drives everything
var agent;

var initialDraw = true; 

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

  // Create background colors
  initBgColors(); 

  // Create the controller instance. 
  giphy = new Giphy();

  // Initialize voice engine. 
  voice = new VoiceSpeech(voiceStarted, voiceEnded);

  // Initialize speech recognition engine and begin listening. 
  speech = new Speech(speechResult); 

  // Initialize the center title. 
  centerTitle = new CenterTitle(agent);

  // Give agent a
  agent = new Agent(voice, speech, giphyResultCallback);
    
  // Initialize text analytics. 
  textAnalytics = new TextAnalytics(this.sentimentResults, this.keyPhrasesResults); // Pass the callbacks for sentiment and keyPhrases. 
}


function draw() {
  if (initialDraw) {
    // Draw background. 
    for (var x = 0; x < numCols; x++) {
      for (var y = 0; y < numRows; y++) {
        var idx = x + y*numCols;
        fill(bgColors[idx]);
        rect(x*gifWidth, y*gifHeight, gifWidth, gifHeight);
      }
    }
  }
 
  // Based on agent's health. 
  agent.run();

  // Keep updating center title. 
  centerTitle.run();

  initialDraw = false; 
}

function giphyResultCallback(gData) {
  let numGifsToUpdate = numRows*numCols;
  for (var i = 0; i < numGifsToUpdate; i++) {
    newIdxUrls[i] = gData.data[i].images.fixed_width_downsampled.url;
  }

  // NOTE: Keep this here, don't remove it. It needs to be here. 
  setTimeout(setNewGifs, 1000);
}

// VOICE Functions -----------------------> 

function voiceStarted() {
}

function voiceEnded() {
  // Turn on speech recognition.
  try {
    if (!speech.isRunning) {
      speech.start();
    }
  } catch(e) {
    console.warn("Tried to start speech recognition when it was already started. Ignore it for now.")
  }

  centerTitle.setTitle("I'm Listening");
  agent.isSpeaking = false;
}

// SPEECH Functions ---------------------->

// Handle Speech Inputs. 
function speechResult(result, isFinal) {
  if (!agent.isSpeaking) {
    if (!isFinal) {
      // Stop the voice. 
      if (agent.isSpeaking) {
        agent.voiceEngine.stop();
      }

      // Keep resetting the agent's time. 
      agent.curVoiceTime = millis();
      centerTitle.setFullScreen();
      centerTitle.setTitle(result);
    } else {
      // Only send the text to Text Analytics if the final text length is less than 200 characters.
      if (result.length < 200) {
        console.log('Sending this to Text Analytics.');
        var sentiPromise = new Promise(function(resolve, reject) {
          textAnalytics.sentiment(result, resolve);
        });
        var phrasePromise = new Promise(function(resolve, reject) {
          textAnalytics.keyPhrases(result, resolve);
        });
        Promise.all([sentiPromise, phrasePromise]).then(function(values){
          textAnalyticsResults(values[0], values[1].phrases, values[1].originalText);
        });
      } else {
        print('Ignoring audience, input too long. Maybe say something here?');
      }

      // Don't reevaluate if it's capturing only junk. Just show that. 
      centerTitle.setTitle(result);
    }
  }
}

function textAnalyticsResults(sentiment, keyPhrases, originalText) {
  print('Sentiment: ' + sentiment + ' Key Phrases: ' + keyPhrases);

  // Set current health with sentiment. 
  agent.curHealth = sentiment * 100; 

  if (keyPhrases.length > 0) {
    print('KeyPhrases found');
    var text = '';
    keyPhrases.forEach(function(item) {
      text += item + ' '; 
    });

    text = text.trim();
    // Start a selective search for these gifs
    giphy.search(text, this.maxGifsToUpdate, this.selectiveResults, 0);
  } else {
    agent.curVoiceTime = agent.maxVoiceTime + 1; // Force an evaluation
    agent.isResponding = true;
    centerTitle.setMiddleScreen();
    centerTitle.setTitle("I'm Listening");
  }
}

function setNewGifs() {
  for (var idx in newIdxUrls) {
    var newUrl = newIdxUrls[idx]; 
    gifElements[idx].attribute('src', newUrl);
  } 
  // Clear the old object. 
  newIdxUrls = [];
}

function selectiveResults(gData) {
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
    gifElements[idx].attribute('src', ringSvg);

    // Create an object {index: url} to update in setNewGifs method. 
    var gifUrl = gData.data[i].images.fixed_width_downsampled.url;
    newIdxUrls[idx] = gifUrl; 
  }

  centerTitle.setTitle("I'm Listening");
  centerTitle.setMiddleScreen();
  agent.isResponding = true;
  agent.keyWordSearch = true;
  agent.curVoiceTime = agent.maxVoiceTime + 1; // Force an evaluation

  // Wait for some time, then load new gifs.  
  setTimeout(setNewGifs, 1000);
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
      var img = createImg(ringSvg); 
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