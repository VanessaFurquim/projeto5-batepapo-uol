let userName;
const initialScreen = document.querySelector(".initial-screen");
const mainScreen = document.querySelector(".chat-container");

requestUserName();
sendMessagesWithEnterKey();

function requestUserName() {

    mainScreen.classList.add("hidden");

    userName = document.querySelector(".enter-user-name").value;

    const responseUserName = axios.post('https://mock-api.driven.com.br/api/v4/uol/participants', {name: userName});

    responseUserName.then(successfulResponse);
    responseUserName.catch(invalidUserName);
}

function successfulResponse() {

    onlineStatus();
    receiveMessages();

    setInterval(receiveMessages, 3000);
    setInterval(onlineStatus, 5000);
}

function invalidUserName() {
    alert ("Nome de usuário indisponível. Por favor, escolha outro.");
    requestUserName();
}

function onlineStatus() {
    axios.post('https://mock-api.driven.com.br/api/v4/uol/status', {name: userName});
}

function receiveMessages() {

    initialScreen.classList.add("hidden");
    mainScreen.classList.remove("hidden");

    const receivedMessages = axios.get('https://mock-api.driven.com.br/api/v4/uol/messages');
    receivedMessages.then(exhibitMessagesOnScreen);
}

function exhibitMessagesOnScreen(receivedMessages) {

    const addMessage = document.querySelector(".chat-container");

    addMessage.innerHTML = "";

    for(let i = 0; i < receivedMessages.data.length; i++){

        if(receivedMessages.data[i].type === "status") {
            addMessage.innerHTML +=
            `<span class="single-message status" data-identifier="message">
                <p class="sent-time">(${receivedMessages.data[i].time})</p>&nbsp;<strong>${receivedMessages.data[i].from}</strong>&nbsp;para&nbsp;<strong>${receivedMessages.data[i].to}</strong>:&nbsp;<div class="message-text">${receivedMessages.data[i].text}</div>
            </span>`
        } else if(receivedMessages.data[i].type === "message") {
            addMessage.innerHTML += 
            `<span class="single-message message" data-identifier="message">
                <p class="sent-time"> (${receivedMessages.data[i].time})</p>&nbsp;<strong>${receivedMessages.data[i].from}</strong>&nbsp;para&nbsp;<strong>${receivedMessages.data[i].to}</strong>:&nbsp;${receivedMessages.data[i].text}
            </span>`
        } else if(receivedMessages.data[i].type === "private_message" && receivedMessages.data[i].to === userName) {
            addMessage.innerHTML +=
            `<span class="single-message private-message" data-identifier="message">
                <p class="sent-time"> (${receivedMessages.data[i].time})</p>&nbsp;<strong>${receivedMessages.data[i].from}</strong>&nbsp;para <strong>${receivedMessages.data[i].to}</strong>:&nbsp;${receivedMessages.data[i].text}
            </span>`
        }
    }

    const scrollToLastMessage = document.querySelector('.chat-container span:last-child');
    scrollToLastMessage.scrollIntoView();
}

function sendMessages() {


    let usersMessages = document.querySelector(".user-message").value;
    let usersSingleMessage = axios.post('https://mock-api.driven.com.br/api/v4/uol/messages',
    {from: userName,
     to: "Todos",
     text: usersMessages,
     type: "message"});

     usersSingleMessage.then(successfulResponse);
     usersSingleMessage.catch(window.location.reload);
}

function sendMessagesWithEnterKey() {

    const enterButtonActive = document.getElementById("activate-enter-key");

    enterButtonActive.addEventListener("keyup", function(event) {
        if(event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("send-message-with-enter-key").click();
        }
    });
}