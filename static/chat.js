const messagesDiv = document.getElementById('messages');
const inputBox = document.getElementById('inputBox');

// Create a new WebSocket connection to the server
const socket = new WebSocket('ws://localhost:8000/ws'); // Replace with your WebSocket server address and port

// Display incoming Markdown message inline in the chat box
function displayMessage(message) {
    // Parse the message as Markdown
    let parsedMarkdown = marked.parse(message);

    // Remove any outer block elements to avoid line breaks
    parsedMarkdown = parsedMarkdown.replace(/<\/?(p|div|h[1-6])[^>]*>/g, '');

    // Append the message as inline HTML within messagesDiv
    messagesDiv.insertAdjacentHTML('beforeend', `<span>${parsedMarkdown}</span> `);

    // Scroll to the bottom of the messages container
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Handle messages from the WebSocket server
socket.addEventListener('message', function(event) {
    const message = event.data;

    // Directly display the message with Markdown rendering
    displayMessage(message);
});

// Send message function
function sendMessage() {
    const message = inputBox.value.trim();
    if (message) {
        socket.send(message);
        inputBox.value = ''; // Clear input box after sending
    }
}

// Send the message when pressing the "Enter" key
inputBox.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
