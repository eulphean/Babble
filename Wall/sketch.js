// Hardcoded text for now. 
var search = ["lalaland", "sexy", "kiss", "pyar", "whatsup", "whatsapp", "internet", "machines", "you"];

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
  for (let x = 0; x < numCols; x++) {
    for (let y = 0; y < numRows; y++) {
      // <img> element with empty content. 
      var img = createImg(); 
      img.size(gifWidth, gifHeight);
      img.position(x*gifWidth, y*gifHeight);
      img.parent(parentDiv); // Parent div is the root container. 
      
      var idx = x + numCols * y; 
      gifElements[idx] = img; 
    }
  }

  // Create the controller instance. 
  giphy = new Giphy(numCols*numRows);
  queryGifs();

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
  queryGifs();
}

function queryGifs() {
  // Query gifs.
  let randIdx = floor(random(search.length));
  giphy.query(search[randIdx], giphyData);
}

// Callback function called when the service returns the result. 
function giphyData(gData) {
  print("Data received.");
  print(gData); 
  numResults = gData.data.length; 
  print("Results: " + numResults)

  // Populate first 5 inces
  for (let i = 0; i < 100; i++) {
    var gifUrl = gData.data[i].images.fixed_width_small_still.url; 
    gifElements[i].attribute('src', gifUrl);
  }
}