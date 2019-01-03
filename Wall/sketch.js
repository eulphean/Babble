// Hardcoded text for now. 
var search = ["lalaland", "sexy", "kiss", "pyar", "humtum", "whatsup", "whatsapp", "internet", "machines", "you"];

// Display.
var numGifs = numRows = 10; // # gifs/row and # of rows.  
var divs = [];
var parentDiv; 
var gifWidth, gifHeight; 
var numResults; 

// API Controller. 
var giphy; 

// Canvas control. 
var canvas; 

function setup() {
  canvas = createCanvas(screen.width, screen.height);
  canvas.position(0, 0);
  canvas.style('z-index', -1);

  // Create the controller instance. 
  giphy = new Giphy();
  queryGifs();

  //Setup parent gif. 
  parentDiv = createDiv();
  parentDiv.mousePressed(onClick);

  // Gif dimensions
  gifWidth = screen.width/numGifs; 
  gifHeight = screen.height/numGifs; 


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
  centerText = createElement('h2', 'This is an HTML string with style!');
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
  print("Removing old divs.");
  for (var i = 0; i < divs.length; i++) {
    divs[i].remove();
  }
  queryGifs();
}

function createDivs() {
  print("Creating Divs. ");
  // Create all the divs. 
  for (var i = 0; i < numRows; i++) {
    var div = createDiv();
    div.position(0, i*gifHeight);
    divs[i] = div;
    parentDiv.child(divs[i]);
  }
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

  createDivs(); 
  showImages(gData);
}

function showImages(gData) {
  // Only show the number of search results not all the ones I need to show
  print("show images");
  var divNum = 0; var numImages = gData.data.length;
  for (var i = 0; i < numImages; i++) {
    var img = createImg(gData.data[i].images.fixed_width_small_still.url);
    img.size(gifWidth, gifHeight);

    // Add image in the div. 
    divs[divNum].child(img);

    var mod = i % 10; 
    if (mod == 9) {
      print(divNum + ": Next row"); 
      divNum++; 
    }
  }
}

/*
function populateGifs() {
  print("populating gifs");
  // Create a collection of giphys
  var divNum = 0; 

  for (var i = 0; i < numRows * numGif; i++) {
    img = createImg(g.data[i].images.fixed_width.url);
    img.size(gifWidth, gifHeight);
    divs[divNum].child(img);

    var mod = i % numRows; 
    if (mod == 9) {
      divNum++; 
    }
  }
}
*/