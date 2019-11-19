// API controller for the Giphhy web service. 
class Giphy {
    // NOTE: Nothing above the constructor here. 
    constructor() {
        // Declare all the local variables for the Giphhy controller. 
        this.searchEndpoint = "https://api.giphy.com/v1/gifs/search?"; 
        this.trendingEndpoint = "https://api.giphy.com/v1/gifs/trending?";

        this.apiKey = "&api_key=6HvwgH0NUx4sWULd71ICf2VHbZU3D0R9";
        this.q = "&q=";
        this.limit = "&limit="; // Hardcoding limit. TODO: Add the logic for pagination. 
        this.offset ="&offset=";
    }

    search(text, limit, callback, offset=5) {
        // Create query string. 
        let url = this.searchEndpoint + this.apiKey + this.q + text + this.limit + limit + this.offset + offset;
        loadJSON(url, callback);
        print("Giphy: Initiate query for: " + text);
    }

    trending(limit, callback) {
        // Create query string. 
        let url = this.trendingEndpoint + this.apiKey + this.limit + limit; 
        loadJSON(url, callback);
        print("Giphy: Querying trending gifs");
    }
}; 