// # gifs/row and # of rows.  
var numCols = 6;
var numRows = 8; 

// Display.
var canvas; 
var parentDiv; 
var gifWidth, gifHeight;  
var gifElements = []; 
var minGifsToUpdate = 15; 
var bgColors = [];
var ringSvg = 'assets/ring.svg'; 
var autoResponseInterval = 30000; // Every 30 seconds, Babble wakes up.

// API controllers. 
var giphy, speech, voice, textAnalytics, cakechat; 

// Cakechat 
var isCakechatEnabled = false; 
var Emotion = {
  joy: 'joy',
  sadness: 'sadness',
  fear: 'fear',
  anger: 'anger',
  neutral: 'neutral' 
}; 

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

  // Cakechat
  cakechat = new Cakechat(); 
  // Fake test to check if cakechat is actually working or not. 
  cakechat.getResponse("Hi", Emotion.neutral, this.cakechatCallback); 
  setInterval(this.pollCakechat, 180000); // Poll cakechat every 3 minutes to know if it's up. 

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

function pollCakechat() {
  console.log("Main: Polling cakechat to check if it's up");
  cakechat.getResponse("Hi", Emotion.neutral, this.cakechatCallback);
}

function cakechatCallback(result, emotion) {
  if (result == "ERROR") {
    console.log("Main: Cakechat is unavailable."); 
    isCakechatEnabled = false; 
  } else {
    isCakechatEnabled = true;
    console.log("Main: Cakechat is available."); 
  }
}

function giphyResultCallback(gData) {
  let numGifsReturned = gData.data.length;
  let maxGifsToUpdate = numRows*numCols; 

  if (numGifsReturned < maxGifsToUpdate) {
    // Didn't find enough gifs with search query. Only update a few on the screen. 
    for (let i = 0; i < numGifsReturned; i++) {
      let idx; 
      do {
        idx = floor(random(gifElements.length));
      } while (newIdxUrls.hasOwnProperty(idx));
      // Clear the div at that index. 
      gifElements[idx].attribute('src', ringSvg);
      //Create an object {index: url} to update in setNewGifs method. 
      newIdxUrls[i] = gData.data[i].images.fixed_width_downsampled.url;
    }
  } else {
    // Found enough gifs with new search query. Update all of them. 
    for (var i = 0; i < maxGifsToUpdate; i++) {
      gifElements[i].attribute('src', ringSvg);
      newIdxUrls[i] = gData.data[i].images.fixed_width_downsampled.url;
    }
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

      // Reset agent's auto response time. 
      // Set the speech result into the window. 
      agent.curVoiceTime = millis();
      centerTitle.setFullScreen();
      centerTitle.setTitle(result);
    } else {
      // Don't send a very long message to Text Analytics. This is probably junk.
      if (result.length < 200) {
        print('Main: Sending final speech result to Text Analytics - ' + result);
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
        print('Main: Ignoring audience, input too long. Maybe say something here?');
      }

      // Don't reevaluate if it's capturing only junk. Just show that. 
      // This will automatically get reset when the agent auto responds next time. 
      // If this result is sent to Text Analytics, then it is reset in that code path (look below)
      centerTitle.setTitle(result);
    }
  }
}

function textAnalyticsResults(sentiment, keyPhrases, originalText) {
  print('Main: Sentiment: ' + sentiment + ' Key Phrases: ' + keyPhrases);

  // Create a response from the agent. 
  agent.interactiveResponse(sentiment, originalText); 

  if (keyPhrases.length > 0) {
    print('Main: KeyPhrases found');
    var text = getGiphyTextToSearch(keyPhrases); 
    giphy.search(text, numCols*numRows, this.giphyResultCallback, random(0, 200));
  } else {
    print('Main: No KeyPhrases found. Use the original text to extract key phrases.');
    keyPhrases = originalText.split(' '); 
    var text = getGiphyTextToSearch(keyPhrases);
    giphy.search(text, numCols*numRows, this.giphyResultCallback, random(0, 200));
  }
}

function getGiphyTextToSearch(keyPhrases) {
  var text = '';
  keyPhrases.forEach(function(item) {
    text += item + ' '; 
  });
  text = text.trim();
  return text; 
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