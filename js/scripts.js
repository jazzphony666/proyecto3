console.log('Sitio cargado correctamente');

// Chat Widget Functionality
function toggleChat() {
    const chatBody = document.getElementById('chatBody');
    chatBody.style.display = chatBody.style.display === 'none' ? 'flex' : 'none';
}

// Initialize chat
document.addEventListener('DOMContentLoaded', function() {
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.querySelector('.chat-input input');
    const sendButton = document.querySelector('.chat-input button');
    const chatMessages = document.querySelector('.chat-messages');

    // Handle send message
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';

            // Simulate response (in a real application, this would be handled by a backend)
            setTimeout(() => {
                addMessage('Gracias por tu mensaje. Un agente te responderá pronto.', 'support');
            }, 1000);
        }
    }

    // Add message to chat
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});

// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;
            
            if (!nombre || !email || !mensaje) {
                alert('Por favor, complete todos los campos requeridos.');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Por favor, ingrese un correo electrónico válido.');
                return;
            }
            
            // If validation passes, show success message
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            contactForm.reset();
        });
    }
});