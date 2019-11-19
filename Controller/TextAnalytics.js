// Sentiment analysis using Microsoft's text analytics API.
// Sentiment and analysis. 

class TextAnalytics {
  constructor (sentimentCbk, keyPhrasesCbk) {
    this.api = 'https://eastasia.api.cognitive.microsoft.com/text/analytics/v2.0/';
    this.apiKey = '0455d2d0f6f7484d9c8068df41b15649';
    this.requestBody = {};
    this.sentiCallback = sentimentCbk;
    this.phrasesCallback = keyPhrasesCbk; 
  }

  sentiment(inputText, resolve) {
    // Create request body. 
    this.requestBody = {
        "documents": [
          {
            "language": "en",
            "id": "1",
            "text": inputText
          }
        ]
      };

    // Create and send request.
    var request = new XMLHttpRequest(); 
    request.onerror = this.onError.bind(this);
    request.onload = this.onLoadSentiment.bind(this, request, resolve);
    var uri = this.api + 'sentiment'; 
    request.open('POST', uri, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Ocp-Apim-Subscription-Key", this.apiKey); // Set API key.
    request.setRequestHeader("Accept","application/json");
    request.send(JSON.stringify(this.requestBody));
  }

  keyPhrases(inputText, resolve) {
    // Create request body. 
    this.requestBody = {
      "documents": [
        {
          "language": "en",
          "id": "1",
          "text": inputText
        }
      ]
    };

    // Create and send request. 
    var request = new XMLHttpRequest(); 
    request.onerror = this.onError.bind(this);
    request.onload = this.onLoadKeyPhrases.bind(this, request, resolve);
    var uri = this.api + 'keyPhrases'; 
    request.open('POST', uri, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("Ocp-Apim-Subscription-Key", this.apiKey); // Set API key.
    request.setRequestHeader("Accept","application/json");
    request.send(JSON.stringify(this.requestBody));
  }

  onLoadSentiment(request, resolve) {
    JSON.parse(request.responseText).documents.forEach(result => {
     // resolve(this.sentiCallback(result.score));
     resolve(result.score);
    });
  }

  onLoadKeyPhrases(request, resolve) {
    var phrases = [];
    JSON.parse(request.responseText).documents.forEach(result => {
      result.keyPhrases.forEach(phrase => {
         phrases.push(phrase);
      });

      var originalText = this.requestBody.documents[0].text;
      var obj = {originalText, phrases};
      resolve(obj);
    });
  }
  
  onError() {
    alert(this.request.responseText);
  }
}