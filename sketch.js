// Hardcoded text for now. 
var search = ["freak", "words", "how+i+want", "love", "anger", "i+am+a+phrase", "lets+go", "machines", "us"];

// Display.
var numCols = numRows = 10; // # gifs/row and # of rows.  
var parentDiv; 
var gifWidth, gifHeight;  
var gifElements = []; 

// API Controller. 
var giphy; 
var speech;

// Canvas control. 
var canvas; 
var indicesToUpdate = [];
var newUrls = [];
var randomPosition;

var floatingText; 
var velocity; 
var position; 

function setup() {
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
  giphy = new Giphy(numCols*numRows);

  // TODO: Call the trending api for the initial population of GIFs. 
  var idx = floor(random(search.length));
  queryGifs(search[idx], trending);

  // Initialize speech recognizer
  speech = new Speech(speechResult);

  position = createVector(screen.width/2, screen/height/2);
  velocity = createVector(random(-1, 1), random(-1, 1));
  randomPosition = createVector(random(screen.width), random(screen.height));

    // Center div
    initCenterDiv();
}

function draw() {
  background(0);

  // Calculate the new position
  position.add(velocity);
  //floatingText.position(position.x, position.y);
}

// Results from the Speech recognition algorithms. 
function speechResult(result) {
  floatingText.html(result);
  // Clean this data and send it to query gifs. 
  queryGifs(result, selectiveUpdate)
}

function initGifWall() {
  for (let x = 0; x < numCols; x++) {
    for (let y = 0; y < numRows; y++) {
      // <img> element with empty content. 
      var img = createImg('assets/bars.gif'); 
      img.size(gifWidth, gifHeight);
      img.position(x*gifWidth, y*gifHeight);
      img.parent(parentDiv); // Parent div is the root container. 
      
      var idx = x + numCols * y; 
      gifElements[idx] = img; 
    }
  }
}

function initCenterDiv() {
  floatingText = createElement('h2', 'GIF INVASION');
  floatingText.position(100, screen.height/2);
  floatingText.style("font-family", "Serif");
  floatingText.style("background-color", "red");
  floatingText.style("color", "white");
  floatingText.style("padding", "10px");
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function selectiveUpdate(gData) {
  for (let i = 0; i < 5; i++) {
    var idx; 
    do {
      idx = floor(random(gifElements.length));
    } while (indicesToUpdate.includes(idx));
    indicesToUpdate.push(idx);
  }

  print(indicesToUpdate);
  
  for (var i = 0; i < indicesToUpdate.length; i++) { 
    // Store new URLs.
    var newUrl = gData.data[i].images.fixed_width_downsampled.url; 
    newUrls.push(newUrl);

    var idx = indicesToUpdate[i]; 
    gifElements[idx].attribute('src', 'assets/bars.gif');
  }

  // Timeout for a function. 
  setTimeout(setNewGifs, 2000);
}

function setNewGifs() {
  for (var i = 0; i < indicesToUpdate.length; i++) { 
    var idx = indicesToUpdate[i]; 
    var newUrl = newUrls[i];
    gifElements[idx].attribute('src', newUrl);
  }

  // Clear old indices. 
  indicesToUpdate = [];
  newUrls = [];
}

function queryGifs(searchText, callback) {
  giphy.query(searchText, callback);
}

// Callback functions for the initial set of gifs. 
function trending(gData) {
  numResults = gData.data.length; 

  for (let i = 0; i < numResults; i++) {
    var gifUrl = gData.data[i].images.fixed_width_downsampled.url; 
    gifElements[i].attribute('src', gifUrl);
  }
}