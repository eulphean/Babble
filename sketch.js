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
var timeToWaitBeforeSpeaking = 5000; // 5 seconds. 
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
  voice = new VoiceSpeech(voiceLoaded, voiceStarted, voiceEnded);

  // Initialize speech engine. 
  speech = new Speech(speechResult); 
}

function initVoice() {
  notification.play();
  // Turn off speech recognition deliberately if it's recognizing. 
  if (speech != null) {
    speech.stopDeliberately = true;
    speech.speechRec.rec.stop();
  }

  // Utter the words. 
  voice.utter('Hey! I am Babble.');
}

function voiceStarted() {
  print('Voice started');
  centerTitle.hide = true;
}

function voiceEnded() {
  // Schedule for next speaking. 
  setTimeout(initVoice, timeToWaitBeforeSpeaking);

  // Show center title since the voice is done.
  centerTitle.listening = true; // So, it starts showing listening text. 
  centerTitle.hide = false;

  // Turn on speech recognition.
  speech.start();
}

function voiceLoaded() {
  print('Voice loaded.');
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

  centerTitle.run(initVoice);
}

// Callback functions for trending gifs. 
function trending(gData) {
  numResults = gData.data.length; 
  for (let i = 0; i < numResults; i++) {
    var gifUrl = gData.data[i].images.fixed_width_downsampled.url; 
    gifElements[i].attribute('src', gifUrl);
  }
}

// Results from the Speech recognition algorithm. 
function speechResult(result) {
  // Don't set the text right. 
  //centerTitle.setVoiceText(result);
  giphy.search(result, searchGifLimit, searchResults);
}

function searchResults(gData) {
  let numGifsReturned = gData.data.length; 
  print("Total gifs returned: " + numGifsReturned);
  let maxGifs = numGifsReturned > maxGifsToUpdate ? maxGifsToUpdate : numGifsReturned; 
  let numGifsToUpdate = numGifsReturned <= minGifsToUpdate ? numGifsReturned : floor(random(minGifsToUpdate, maxGifs + 1)); 

  print("Totals gifs updating: " + numGifsToUpdate);
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

  print("Done with search results");

  // Wait for some time, then load new gifs.  
  setTimeout(setNewGifs, 5000);
}

function setNewGifs() {
  print("Setting new gif");

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
