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
                <span>${item.name}</span>
                <span>Цена: $${item.price}</span>
                <span>Количество: <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}"></span>
                <span>Сумма: $${itemTotalPrice}</span>
                <button class="btn-small remove-item" data-id="${item.id}">Удалить</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        totalPriceElement.textContent = `$${totalPrice}`;

        // Добавляем обработчики событий для кнопок "+" и "-"
        document.querySelectorAll('.item-quantity').forEach(input => {
            input.addEventListener('change', function() {
                const productId = this.getAttribute('data-id');
                const quantity = parseInt(this.value);
                updateItemQuantity(productId, quantity);
            });
        });

       
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeItemFromCart(productId);
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