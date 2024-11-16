const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const messageInput = document.getElementById('message-input');
const socket = new WebSocket('ws://localhost:8000/ws');

let currentMessageContent = '';
let currentMessageElement = null;
let isMarkdown = false;
let isWaitingForResponse = false;

function createLoadingIndicator() {
    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('d-flex', 'mt-2');
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.classList.add('loading-dot', 'bg-primary', 'rounded-circle', 'animate-bounce-pulse', 'mx-1');
        dot.style.width = '8px';
        dot.style.height = '8px';
        loadingContainer.appendChild(dot);
    }
    
    return loadingContainer;
}

socket.onmessage = (event) => {
    const text = event.data;
    console.log(text)
    if (text.trim() === '<DONE>') {
        currentMessageContent = '';
        currentMessageElement = null;
        isMarkdown = false;
        isWaitingForResponse = false;
        return;
    }
    
    if (text.trim() === 'MARK' || text.trim() === 'DOWN' || text.trim().toLowerCase() === 'markdown') {
        isMarkdown = true;
        return;
    }

    if (isMarkdown) {
        isWaitingForResponse = true;
        if (event.data.trim() !== 'DONE') {
            currentMessageContent += text;
            isWaitingForResponse = true;
            return;
        } else {
            isWaitingForResponse = false;
        }
    }

    if (!currentMessageElement) {
        currentMessageElement = createMessageElement('ai');
        chatMessages.appendChild(currentMessageElement);
        
        // Remove loading indicator if it exists
        const loadingMessage = document.querySelector('.loading-message');
        if (loadingMessage) {
            loadingMessage.remove();
        }
    }

    const contentElement = currentMessageElement.querySelector('.message-content');
    if (isMarkdown) {
        contentElement.innerHTML = marked.parse(currentMessageContent);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return;
    } else {
        currentMessageContent += text;
    }
    
    contentElement.textContent = currentMessageContent;
    chatMessages.scrollTop = chatMessages.scrollHeight;
};

function createMessageElement(type) {
    console.log(type)
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type, 'd-flex', 'align-items-start', 'mb-4');
    messageElement.style.backgroundColor = type === 'user' ? '#e9ecef' : '#f8f9fa';

    const avatarElement = document.createElement('div');
    avatarElement.classList.add('avatar', 'flex-shrink-0', 'rounded-circle', 'd-flex', 'align-items-center', 'justify-content-center');
    avatarElement.style.width = '40px';
    avatarElement.style.height = '40px';
    
    const avatarSvg = type === 'user' 
        ? '<svg class="text-secondary" width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>'
        : '<svg class="text-primary" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>';
    
    avatarElement.innerHTML = avatarSvg;

    const contentElement = document.createElement('div');
    contentElement.classList.add('message-content', 'ms-3', 'text-dark');

    messageElement.appendChild(avatarElement);
    messageElement.appendChild(contentElement);
    return messageElement;
}

function showLoadingMessage() {
    const loadingMessage = createMessageElement('ai');
    loadingMessage.classList.add('loading-message');
    const contentElement = loadingMessage.querySelector('.message-content');
    contentElement.appendChild(createLoadingIndicator());
    chatMessages.appendChild(loadingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message && !isWaitingForResponse) {
        const messageElement = createMessageElement('user');
        messageElement.querySelector('.message-content').textContent = message;
        chatMessages.appendChild(messageElement);
        
        // Show loading indicator
        showLoadingMessage();
        
        isWaitingForResponse = true;
        socket.send(message);
        messageInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});

const homeScreen = document.getElementById('home-screen');
const chatboxScreen = document.getElementById('chatbox-screen');
const homeTab = document.getElementById('home-tab');
const chatTab = document.getElementById('chat-tab');

homeTab.addEventListener('click', () => {
    homeScreen.classList.remove('d-none');
    chatboxScreen.classList.add('d-none');
});

chatTab.addEventListener('click', () => {
    chatboxScreen.classList.remove('d-none');
    homeScreen.classList.add('d-none');
});