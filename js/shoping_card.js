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
                <img src="${item.image_top}" alt="${item.name}" class="cart-item-image">
                <span>${item.name}</span>
                <span>Цена: $${item.price}</span>
                <span>Количество: <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-id="${item.id}"></span>
                <span>Сумма: $${itemTotalPrice}</span>
                <button class="btn-small remove-item" data-id="${item.id}">Удалить</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`; // Округляем общую стоимость до двух знаков после запятой

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

    // Функция для загрузки товаров
    function loadProducts(category) {
        const jsonFile = category === 'men' ? 'men_products.json' : 'women_products.json';
        fetch(`/src/${jsonFile}`)
            .then(response => response.json())
            .then(products => {
                const productsContainer = document.getElementById('products-container');
                productsContainer.innerHTML = '';

                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item';
                    productItem.innerHTML = `
                        <img src="${product.image_top}" alt="${product.name}" class="product-image">
                        <h3>${product.name}</h3>
                        <p>Цена: $${product.price}</p>
                        <button class="btn add-to-cart" data-id="${product.id}">Добавить в корзину</button>
                    `;
                    productsContainer.appendChild(productItem);

                    // Добавляем обработчик события для кнопки "Добавить в корзину"
                    productItem.querySelector('.add-to-cart').addEventListener('click', function() {
                        addToCart(product);
                    });
                });
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }

    function addToCart(product) {
        let existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    // Обработчик события для категорий
    document.querySelectorAll('.categories a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const category = this.getAttribute('data-category');
            loadProducts(category);
        });
    });

    // Инициализация корзины
    updateCart();

    // Загрузка товаров по умолчанию (например, для категории "women")
    loadProducts('women');
});