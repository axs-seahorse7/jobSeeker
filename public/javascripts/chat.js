jQuery(document).ready(function() {

    $(".chat-list a").click(function() {
        alert("test");
        $(".chatbox").addClass('showbox');
        return false;
    });

    $(".chat-icon").click(function() {
        $(".chatbox").removeClass('showbox');
    });

});

const socket = io();

const msgForm = document.getElementById('msgForm');
const msgInput = document.getElementById('send-form');
const sendBtn = document.getElementById('send-txt');
const msgContainer = document.getElementById('msgbox');


const append = (message, position) => {
    const div = document.createElement('div');
    const li = document.createElement('li');
    li.innerText = message;
    div.classList.add('msgbox');
    li.classList.add(position);
    msgContainer.appendChild(li);
}

msgForm.addEventListener('submit', function(e) {
    e.preventDefault();
    if (msgInput.value) {
        socket.emit('chat-msg', msgInput.value);
        msgInput.value = '';
    }
});

socket.on('message', (message) => {
    append(message, 'repaly');
});
