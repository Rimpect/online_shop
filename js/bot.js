document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotToggle = document.getElementById('chatbot-toggle');

   
    chatbotToggle.addEventListener('click', function() {
        chatbotContainer.style.display = chatbotContainer.style.display === 'flex' ? 'none' : 'flex';
    });

    chatbotClose.addEventListener('click', function() {
        chatbotContainer.style.display = 'none';
    });

  
    chatbotInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const userMessage = chatbotInput.value;
            if (userMessage.trim() !== '') {
                addMessage(userMessage, 'user');
                chatbotInput.value = '';
                processMessage(userMessage);
            }
        }
    });

    // Добавление сообщения в чат
    function addMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message', sender);
        messageElement.innerHTML = `<span>${message}</span>`;
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Обработка сообщения и ответ чат-бота
    function processMessage(message) {
        const response = getBotResponse(message);
        setTimeout(() => {
            addMessage(response, 'bot');
        }, 500);
    }

    // Простой ответ чат-бота
    function getBotResponse(message) {
        const lowerCaseMessage = message.toLowerCase();

        if (lowerCaseMessage.includes('привет')) {
            return 'Привет! Чем я могу помочь?';
        } else if (lowerCaseMessage.includes('как дела')) {
            return 'У меня все хорошо, спасибо! А у вас?';
        } else if (lowerCaseMessage.includes('до свидания')) {
            return 'До свидания! Если что, я всегда здесь.';
        } else {
            return 'Извините, я не понимаю. Можете перефразировать?';
        }
    }
});