class TextAnalytics {
  constructor () {
    this.request = new XMLHttpRequest();
    this.request.onload = this.onLoad.bind(this);
    this.request.onerror = this.onError.bind(this);
    this.api = 'https://eastasia.api.cognitive.microsoft.com/text/analytics/v2.0/';
    this.apiKey = '0455d2d0f6f7484d9c8068df41b15649';
    this.requestBody = {};
  }

  sentiment(inputText) {
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

    this.createRequest('sentiment');
  }

  keyPhrases(inputText) {
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

    // Create request. 
    this.createRequest('keyPhrases');
  }

  createRequest(endpoint) {
    var uri = this.api + endpoint; 
    this.request.open('POST', uri, true);
    this.request.setRequestHeader("Content-Type", "application/json");
    this.request.setRequestHeader("Ocp-Apim-Subscription-Key", this.apiKey); // Set API key.
    this.request.setRequestHeader("Accept","application/json");

    this.request.send(JSON.stringify(this.requestBody));
  }

  onLoad() {
    JSON.parse(this.request.responseText).documents.forEach(result => {
      print(result);
    });
  }
  
  onError() {
    alert(this.equest.responseText);
  }
}
  

// this.request.onload = () => {
//   // const resultList = document.getElementById('resultList');
//   // // Clear resultList field.
//   // resultList.innerHTML = '';
//   // // Set response data.

// };

// request.onerror = () => {
  
// };
  

  