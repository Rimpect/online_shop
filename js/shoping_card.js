document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        cart.forEach(item => {
            const itemTotalPrice = item.price * item.quantity;
            totalPrice += itemTotalPrice;

            const cartItem = document.createElement('li');
            cartItem.className = 'collection-item';
            cartItem.innerHTML = `
                <a href="/product.html?id=${item.id}&category=${item.category}" class="cart-item-link">
                    <img src="${item.image_top}" alt="${item.name}" class="cart-item-image">
                </a>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Цена: $${item.price}</p>
                    <p>Количество: <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}"></p>
                    <p>Сумма: $${itemTotalPrice}</p>
                    <button class="btn-small remove-item" data-id="${item.id}">Удалить</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`; 
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('input', function() {
                const productId = this.getAttribute('data-id');
                const quantity = parseInt(this.value);
                if (!isNaN(quantity) && quantity >= 1) {
                    updateItemQuantity(productId, quantity);
                } else {
                    this.value = 1; 
                }
            });
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                const productId = this.getAttribute('data-id');
                removeItemFromCart(productId);
            });
        });

       
        document.querySelectorAll('.cart-item-image').forEach(image => {
            image.addEventListener('click', function(event) {
                event.preventDefault(); 
                const link = this.parentElement; 
                window.location.href = link.href; 
            });
        });
    }

    function updateItemQuantity(productId, quantity) {
        const itemIndex = cart.findIndex(item => item.id == productId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }

    function removeItemFromCart(productId) {
        cart = cart.filter(item => item.id != productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    function clearCart() {
        cart = [];
        localStorage.removeItem('cart');
        updateCart();
    }

    clearCartButton.addEventListener('click', clearCart);

    // Инициализация корзины
    updateCart();
});