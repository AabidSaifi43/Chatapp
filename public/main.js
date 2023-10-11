const socket = io()

const clientsTotal = document.getElementById('client-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')
const messageTone = new Audio('/message-tone.mp3')

messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    sendMessage()
})

socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
})

function sendMessage() {
    if (messageInput.value === '') return
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        dateTime: new Date(),
    }
    socket.emit('message', data)
    addMessageToUI(true, data)
    messageInput.value = ''
}

socket.on('chat-message', (data) => {
    // console.log(data)
    messageTone.play()
    addMessageToUI(false, data)
})

function addMessageToUI(isOwnMessage, data) {
    clearFeedback();
    const timestamp = moment(data.dateTime).format('LT'); // Format the timestamp
    const element = `
  <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
      <p class="message">${data.message}<span class="timestamp">${timestamp}</span></p>
    </li>
    `;


    messageContainer.innerHTML += element;
    scrollToBottom();
}



function scrollToBottom() {
    messageContainer.scrollTo(0, messageContainer.scrollHeight)
}

messageInput.addEventListener('focus', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing a message`,
    })
})

messageInput.addEventListener('keypress', (e) => {
    socket.emit('feedback', {
        feedback: `✍️ ${nameInput.value} is typing a message`,
    })
})
messageInput.addEventListener('blur', (e) => {
    socket.emit('feedback', {
        feedback: '',
    })
})

socket.on('feedback', (data) => {
    clearFeedback()
    const element = `
        <li class="message-feedback">
          <p class="feedback" id="feedback">${data.feedback}</p>
        </li>
  `
    messageContainer.innerHTML += element
})

function clearFeedback() {
    document.querySelectorAll('li.message-feedback').forEach((element) => {
        element.parentNode.removeChild(element)
    })
}

let inputImg = document.querySelector('#myfile');
let borderSpan = document.querySelector('#border');

inputImg.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;

            img.onload = function () {
                borderSpan.innerHTML = '';
                borderSpan.appendChild(img);
            };
        };

        reader.readAsDataURL(file);
    }
});
