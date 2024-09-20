function changeMainImage(thumbnail) {
    var overlay = document.getElementById('overlayImage');
    overlay.innerHTML = '<img src="' + thumbnail.src + '" alt="Overlay Image">';
    overlay.style.display = 'block';
}

function resetMainImage() {
    var overlay = document.getElementById('overlayImage');
    overlay.style.display = 'none';
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    // Убрано модальное окно
}

function loadProductData(productId) {
    fetch('/src/products.json')
        .then(response => response.json())
        .then(products => {
            let product = products.find(p => p.id == productId);
            if (product) {
                document.getElementById('productName').textContent = product.name;
                document.getElementById('productPrice').textContent = `$${product.price}`;
                document.getElementById('productMaterial').textContent = product.material;
                document.getElementById('productColor').textContent = product.color;
                document.getElementById('productSize').textContent = product.size;
                document.getElementById('mainImage').src = product.mainImage;

                let thumbnails = document.getElementById('thumbnails');
                thumbnails.innerHTML = '';
                product.images.forEach(image => {
                    let img = document.createElement('img');
                    img.src = image;
                    img.alt = `Изображение ${product.images.indexOf(image) + 1}`;
                    img.onmouseover = () => changeMainImage(img);
                    img.onmouseout = resetMainImage;
                    thumbnails.appendChild(img);
                });

                let relatedProducts = document.getElementById('relatedProducts');
                relatedProducts.innerHTML = '';
                product.relatedProducts.forEach(relatedProduct => {
                    let div = document.createElement('div');
                    div.className = 'related-product';
                    let img = document.createElement('img');
                    img.src = relatedProduct.image;
                    img.alt = `Товар ${relatedProduct.id}`;
                    div.appendChild(img);
                    relatedProducts.appendChild(div);
                });

                document.getElementById('addToCart').onclick = () => addToCart(product);
            } else {
                alert('Товар не найден');
            }
        })
        .catch(error => console.error('Ошибка загрузки данных:', error));
}

let urlParams = new URLSearchParams(window.location.search);
let productId = urlParams.get('id');
if (productId) {
    loadProductData(productId);
} else {
    alert('Товар не выбран');
}