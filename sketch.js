// Hardcoded text for now. 
var search = ["freak", "words", "how+i+want", "love", "anger", "i+am+a+phrase", "lets+go", "machines", "us"];

// Display.
var numCols = numRows = 10; // # gifs/row and # of rows.  
var parentDiv; 
var gifWidth, gifHeight;  
var gifElements = []; 

// Parent div
// All gifs are absolutely positioned in this parent. 

var numResults;

// API Controller. 
var giphy; 

// Canvas control. 
var canvas; 
var indicesToUpdate = [];
var newUrls = [];

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
  parentDiv.mousePressed(onClick);
  
  // Initialize the gif wall elements. 
  initGifWall();

  // Create the controller instance. 
  giphy = new Giphy(numCols*numRows);
  queryGifs(giphyData);

  // Center div
  initCenterDiv();
}

function draw() {
  background(0);
  
  // All updates here. 
  if (numResults == 0) {
    centerText.html("Sorry no results found");
  }
}

function initGifWall() {
  for (let x = 0; x < numCols; x++) {
    for (let y = 0; y < numRows; y++) {
      // <img> element with empty content. 
      var img = createElement('img', ""); 
      img.size(gifWidth, gifHeight);
      img.position(x*gifWidth, y*gifHeight);
      img.parent(parentDiv); // Parent div is the root container. 
      
      var idx = x + numCols * y; 
      gifElements[idx] = img; 
    }
  }
}

function initCenterDiv() {
  centerText = createElement('h2', 'GIF WALL');
  centerText.position(0, screen.height/2 - 40);
  centerText.style("font-family", "Serif");
  centerText.style("background-color", "#FFFFFF");
  centerText.style("color", "#000000");
  centerText.style("padding", "10px");
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}

function windowResized() {
  centerCanvas();
}

function onClick() {
  queryGifs(selective);
}

function selective(gData) {
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
    newUrls.push(gData.data[i].images.fixed_width_downsampled.url);

    var idx = indicesToUpdate[i]; 
    gifElements[idx].attribute('src', '../assets/bars.gif');
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
}

function queryGifs(callback) {
  // Query gifs.
  let randIdx = floor(random(search.length));
  giphy.query(search[randIdx], callback);
}

// Callback function called when the service returns the result. 
function giphyData(gData) {
  numResults = gData.data.length; 

  for (let i = 0; i < numResults; i++) {
    var gifUrl = gData.data[i].images.fixed_width_downsampled.url; 
    gifElements[i].attribute('src', gifUrl);
  }
}