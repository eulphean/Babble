// API controller for the Giphhy web service. 
class Giphy {
    // NOTE: Nothing above the constructor here. 
    constructor(limit) {
        // Declare all the local variables for the Giphhy controller in 
        this.api = "https://api.giphy.com/v1/gifs/search?"; 
        this.apiKey = "&api_key=6HvwgH0NUx4sWULd71ICf2VHbZU3D0R9";
        this.q = "&q=";
        this.limit = "&limit=" + limit; // Hardcoding limit. TODO: Add the logic for pagination. 
    }

    query(text, giphyData) {
        // Clear all the divs. 
        let url = this.api + this.apiKey + this.q + text + this.limit; 
        loadJSON(url, giphyData);
        print("Initiate query for: " + text);
    }
}; 