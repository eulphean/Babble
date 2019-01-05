// Display.
var canvas; 
var numCols = numRows = 10; // # gifs/row and # of rows.  
var parentDiv; 
var gifWidth, gifHeight;  
var gifElements = []; 
var minGifsToUpdate = 5; 
var maxGifsToUpdate = 15; // Maximum gifs a search query can update on the wall. 

// API Controllers. 
var giphy; var searchGifLimit = 20;
var speech;

// Property to save indexes for future. 
var newIdxUrls = [];
var randomPosition;

// Experimental. 
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
  giphy.trending(numRows*numCols, trending);

  // Initialize speech recognizer
  speech = new Speech(speechResult);

  // Center div
  initCenterDiv();
  position = createVector(screen.width/2, screen/height/2);
  velocity = createVector(random(-1, 1), random(-1, 1));
  randomPosition = createVector(random(screen.width), random(screen.height));
}

function draw() {
  background(0);

  // Calculate the new position
  position.add(velocity);
  //floatingText.position(position.x, position.y);
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
  floatingText.html(result);
  giphy.search(result, searchGifLimit, searchResults);
}

function searchResults(gData) {
  let numGifsReturned = gData.data.length; 
  print("Total gifs returned: " + numGifsReturned);
  let minGifs = 5; 
  let maxGifs = numGifsReturned > maxGifsToUpdate ? maxGifsToUpdate : numGifsReturned; 
  let numGifsToUpdate = numGifsReturned <= minGifs ? numGifsReturned : floor(random(minGifs, maxGifs + 1)); 

  print("Totals gifs updating: " + numGifsToUpdate);
  for (let i = 0; i < numGifsToUpdate; i++) {
    let idx; 
    do {
      idx = floor(random(gifElements.length));
    } while (newIdxUrls.hasOwnProperty(idx));

    // Clear the div at that index. 
    gifElements[idx].attribute('src', 'assets/bars.gif');

    // Create an object {index: url} to update in setNewGifs method. 
    var gifUrl = gData.data[i].images.fixed_width_downsampled.url;
    newIdxUrls[idx] = gifUrl; 
  }

  // Wait for some time, then load new gifs.  
  setTimeout(setNewGifs, 2000);
}

function setNewGifs() {
  for (var idx in newIdxUrls) {
    var newUrl = newIdxUrls[idx]; 
    gifElements[idx].attribute('src', newUrl);
  } 
  // Clear the old object. 
  newIdxUrls = [];
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
