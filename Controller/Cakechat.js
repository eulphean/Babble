class Cakechat {
    constructor() {
        this.endpoint = "babble-cakechat.xyz";
        this.uri = "https://" + this.endpoint + "/cakechat_api/v1/actions/get_response";
    }

    getResponse(context, emotion, callback) {
        var request = new XMLHttpRequest(); 
        request.onreadystatechange = this.onReadyStateChange.bind(this, request, callback, emotion); 
        request.ontimeout = this.onTimeout.bind(this, callback, emotion); 
        request.timeout = 5000; 
        request.open('POST', this.uri, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.setRequestHeader("Accept","application/json");
        var body = {'context': [context], 'emotion': emotion}; 
        request.send(JSON.stringify(body));
    }

    onReadyStateChange(request, callback, emotion) {
        if (request.readyState == 4) { // DONE
            if (request.status == 200) { // SUCCESS
                var response = JSON.parse(request.response)['response'];
                callback(response); 
            } else if (request.status == 0) { // TIMEOUT
                // TIMEOUT : We already catch that by registering for that callback. 
            } else { // ANY OTHER ERROR
                console.error("Cakechat request failed with error " + request.status);
                console.log(request);
                callback("ERROR", emotion);
            }
        }
    }

    onTimeout(callback, emotion) {
        console.error("Cakechat request timed out after 10 seconds. It may be down."); 
        callback("ERROR", emotion); 
    }
}