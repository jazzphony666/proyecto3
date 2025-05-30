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

// Cart Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get current user ID (you should implement proper user authentication)
    const userId = 1; // Temporary hardcoded user ID
    
    // Update cart count
    async function updateCartCount() {
        try {
            const response = await fetch(`/api/cart/${userId}`);
            const data = await response.json();
            const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
            document.querySelector('.cart-count').textContent = totalItems;
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }
    
    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const productId = e.target.closest('.add-to-cart-btn').dataset.productId;
            
            try {
                const response = await fetch(`/api/cart/${userId}/items`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        product_id: productId,
                        quantity: 1
                    })
                });
                
                if (response.ok) {
                    // Show success message
                    const button = e.target.closest('.add-to-cart-btn');
                    const originalText = button.innerHTML;
                    button.innerHTML = '<i class="fas fa-check"></i> Agregado';
                    button.style.backgroundColor = '#28a745';
                    
                    // Update cart count
                    await updateCartCount();
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.style.backgroundColor = '';
                    }, 2000);
                } else {
                    throw new Error('Failed to add item to cart');
                }
            } catch (error) {
                console.error('Error adding to cart:', error);
                alert('Error al agregar el producto al carrito');
            }
        });
    });
    
    // Initial cart count update
    updateCartCount();
});

// Cart Page Functionality
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCartMessage = document.querySelector('.empty-cart-message');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const subtotalElement = document.querySelector('.subtotal');
    const shippingElement = document.querySelector('.shipping');
    const totalElement = document.querySelector('.total-amount');
    
    // Get current user ID (you should implement proper user authentication)
    const userId = 1; // Temporary hardcoded user ID
    
    // Load cart items
    async function loadCartItems() {
        try {
            const response = await fetch(`/api/cart/${userId}`);
            const data = await response.json();
            
            if (data.items.length === 0) {
                showEmptyCart();
            } else {
                renderCartItems(data.items);
                updateCartSummary();
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            showEmptyCart();
        }
    }
    
    // Render cart items
    function renderCartItems(items) {
        cartItemsContainer.innerHTML = items.map(item => `
            <div class="cart-item" data-product-id="${item.product_id}">
                <img src="${item.image_url}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                </div>
                <div class="item-price">$${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn decrease">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                    <button class="quantity-btn increase">+</button>
                </div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        // Add event listeners to quantity controls and remove buttons
        addCartItemEventListeners();
    }
    
    // Add event listeners to cart items
    function addCartItemEventListeners() {
        // Quantity decrease buttons
        document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });
        
        // Quantity increase buttons
        document.querySelectorAll('.quantity-btn.increase').forEach(button => {
            button.addEventListener('click', handleQuantityChange);
        });
        
        // Quantity input fields
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', handleQuantityChange);
        });
        
        // Remove buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', handleRemoveItem);
        });
    }
    
    // Handle quantity changes
    async function handleQuantityChange(e) {
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.dataset.productId;
        let quantity;
        
        if (e.target.classList.contains('decrease')) {
            quantity = parseInt(cartItem.querySelector('.quantity-input').value) - 1;
        } else if (e.target.classList.contains('increase')) {
            quantity = parseInt(cartItem.querySelector('.quantity-input').value) + 1;
        } else {
            quantity = parseInt(e.target.value);
        }
        
        if (quantity < 1) {
            quantity = 1;
        }
        
        try {
            const response = await fetch(`/api/cart/${userId}/items/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity })
            });
            
            if (response.ok) {
                cartItem.querySelector('.quantity-input').value = quantity;
                updateCartSummary();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Error al actualizar la cantidad');
        }
    }
    
    // Handle item removal
    async function handleRemoveItem(e) {
        const cartItem = e.target.closest('.cart-item');
        const productId = cartItem.dataset.productId;
        
        try {
            const response = await fetch(`/api/cart/${userId}/items/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                cartItem.remove();
                updateCartSummary();
                
                // Check if cart is empty
                if (document.querySelectorAll('.cart-item').length === 0) {
                    showEmptyCart();
                }
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Error al eliminar el producto');
        }
    }
    
    // Update cart summary
    function updateCartSummary() {
        const items = Array.from(document.querySelectorAll('.cart-item'));
        const subtotal = items.reduce((sum, item) => {
            const price = parseFloat(item.querySelector('.item-price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            return sum + (price * quantity);
        }, 0);
        
        const shipping = subtotal > 0 ? 100 : 0; // Example shipping cost
        const total = subtotal + shipping;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
        
        // Enable/disable checkout button
        checkoutBtn.disabled = subtotal === 0;
    }
    
    // Show empty cart message
    function showEmptyCart() {
        cartItemsContainer.innerHTML = '';
        emptyCartMessage.style.display = 'block';
        checkoutBtn.disabled = true;
        subtotalElement.textContent = '$0.00';
        shippingElement.textContent = '$0.00';
        totalElement.textContent = '$0.00';
    }
    
    // Load cart items on page load
    loadCartItems();
});