function updateCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartItems = document.getElementById('cart-items');
    let totalPrice = 0;

    cartItems.innerHTML = '';

    cart.forEach(item => {
        let li = document.createElement('li');
        li.className = 'collection-item';
        li.innerHTML = `
            <span class="title">${item.name}</span>
            <p>Цена: $${item.price} x <span class="quantity">${item.quantity}</span></p>
            <button class="btn btn-small decrease-quantity" data-id="${item.id}">-</button>
            <button class="btn btn-small increase-quantity" data-id="${item.id}">+</button>
            <button class="btn remove-from-cart" data-id="${item.id}">Удалить</button>
        `;
        cartItems.appendChild(li);
        totalPrice += item.price * item.quantity;
    });

    document.getElementById('total-price').textContent = `$${totalPrice}`;
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCart();
}

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-from-cart')) {
        let productId = event.target.dataset.id;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let updatedCart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        updateCart();
    } else if (event.target.classList.contains('increase-quantity')) {
        let productId = event.target.dataset.id;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let item = cart.find(item => item.id === productId);
        if (item) {
            item.quantity += 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    } else if (event.target.classList.contains('decrease-quantity')) {
        let productId = event.target.dataset.id;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let item = cart.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            item.quantity -= 1;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
        }
    }
});

document.getElementById('clear-cart').addEventListener('click', clearCart);

updateCart();