class Cakechat {
    constructor(callback) {
        this.endpoint = "babble-cakechat.xyz";
        this.uri = "https://" + this.endpoint + "/cakechat_api/v1/actions/get_response";
        this.callback = callback; 
    }

    getResponse(context, emotion, speak) {
        var request = new XMLHttpRequest(); 
        request.onreadystatechange = this.onReadyStateChange.bind(this, request, speak); 
        request.ontimeout = this.onTimeout.bind(this, speak); 
        request.timeout = 5000; 
        request.open('POST', this.uri, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Accept","application/json");
        var body = {'context': [context], 'emotion': emotion}; 
        request.send(JSON.stringify(body));
    }

    onReadyStateChange(request, speak) {
        if (request.readyState == 4) { // DONE
            if (request.status == 200) { // SUCCESS
                var response = JSON.parse(request.response)['response'];
                this.callback(response, speak); 
            } else if (request.status == 0) { // TIMEOUT
                // TIMEOUT : We already catch that by registering for that callback. 
            } else { // ANY OTHER ERROR
                console.error("Cakechat request failed with error " + request.status);
                console.log(request);
                this.callback("ERROR", speak);
            }
        }
    }

    onTimeout(speak) {
        console.error("Cakechat request timed out after 10 seconds. It may be down."); 
        this.callback("ERROR", speak); 
    }
}