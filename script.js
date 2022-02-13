requestUserName ()

function requestUserName () {

    let userName = prompt ("Qual seu nome?");

    const responseUserName = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name: userName});

    responseUserName.then(successfulResponse);
    responseUserName.catch(invalidUserName);
}

function successfulResponse () {
    setInterval(receiveMessages, 5000);
}

function invalidUserName () {
    alert ("Nome de usuário indisponível. Por favor, escolha outro.");
    requestUserName();
}

function receiveMessages () {
    const receivedMessages = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    receivedMessages.then(exhibitMessagesOnScreen);
    receivedMessages.catch();
}

function exhibitMessagesOnScreen (receivedMessages) {
    const addMessage = document.querySelector(".chat-container");
    addMessage.innerHTML = "";

    for(let i = 0; i < receivedMessages.data.length; i++){

        if(receivedMessages.data[i].type === "status") {
            addMessage.innerHTML +=
            `<span class="single-message status">
                <p class="sent-time">(${receivedMessages.data[i].time})</p> <strong>${receivedMessages.data[i].from}</strong> para <strong>${receivedMessages.data[i].to}</strong>: ${receivedMessages.data[i].text}
            </span>`
        } else if (receivedMessages.data[i].type === "message") {
            addMessage.innerHTML += 
            `<span class="single-message message">
                <p class="sent-time"> (${receivedMessages.data[i].time})</p> <strong>${receivedMessages.data[i].from}</strong> para <strong>${receivedMessages.data[i].to}</strong>: ${receivedMessages.data[i].text}
            </span>`
        } else {
            addMessage.innerHTML +=
            `<span class="single-message private-message">
                <p class="sent-time"> (${receivedMessages.data[i].time})</p> <strong>${receivedMessages.data[i].from}</strong> para <strong>${receivedMessages.data[i].to}</strong>: ${receivedMessages.data[i].text}
            </span>`
        }
    }
}