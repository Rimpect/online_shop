
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        let product = {
            id: this.closest('.product-item').dataset.id,
            name: this.closest('.product-item').dataset.name,
            price: parseFloat(this.closest('.product-item').dataset.price)
        };
        addToCart(product);
    });
});


const productsPerPage = 6;
let currentPage = 1;

function showProducts() {
    const products = document.querySelectorAll('.product-item');
    const start = (currentPage - 1) * productsPerPage;
    const end = start + productsPerPage;

    products.forEach((product, index) => {
        if (index >= start && index < end) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });

    document.getElementById('page-number').textContent = currentPage;
}

document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        showProducts();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const products = document.querySelectorAll('.product-item');
    if (currentPage < Math.ceil(products.length / productsPerPage)) {
        currentPage++;
        showProducts();
    }
});

showProducts();