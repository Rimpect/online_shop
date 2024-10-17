document.addEventListener('DOMContentLoaded', function() {
    // Обновление кнопки "Добавить в корзину"
    function updateAddToCartButton(product) {
        let addToCartButton = document.getElementById('addToCart');
        if (addToCartButton) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let existingItem = cart.find(item => item.id === product.id);
            if (existingItem) {
                addToCartButton.textContent = `Добавлено в корзину (${existingItem.quantity})`;
            } else {
                addToCartButton.textContent = 'Добавить в корзину';
            }
        } else {
            console.error('Кнопка "Добавить в корзину" не найдена');
        }
    }

    // Обновление счетчика корзины (уникальные товары)
    function updateCartCount() {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let uniqueCount = new Set(cart.map(item => item.id)).size;
        let cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = uniqueCount;
        }
    }

    // Функционал кнопки "Scroll to Top"
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 100) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Изменение цвета кнопки "Scroll to Top" при клике
    document.querySelector('.scroll-to-top').addEventListener('click', function() {
        this.style.backgroundColor = '#000000'; 
    });

    // Пример продукта (замените на вашу логику)
    let product = { id: 1, name: 'Product 1' };

    // Обновление счетчика корзины и текста кнопки каждую секунду
    setInterval(function() {
        updateAddToCartButton(product);
        updateCartCount();
    }, 1000); // 1000 миллисекунд = 1 секунда
});