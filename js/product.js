document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const category = urlParams.get('category');

    if (!productId || !category) {
        console.error('Product ID or category is missing');
        return;
    }

    function resetMainImage() {
        var overlay = document.getElementById('overlayImage');
        overlay.style.display = 'none';
    }

    function changeMainImage(img) {
        var mainImage = document.getElementById('mainImage');
        mainImage.src = img.src;
        mainImage.alt = img.alt;
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
        setAddToCartButtonText(true); 
    }

    function setAddToCartButtonText(added) {
        let addToCartButton = document.getElementById('addToCart');
        if (addToCartButton) {
            addToCartButton.textContent = added ? 'Добавлено в корзину' : 'Добавить в корзину';
        } else {
            console.error('Кнопка "Добавить в корзину" не найдена');
        }
    }

    function loadProductData(productId, category) {
        const jsonFile = category === 'men' ? 'men_products.json' : 'women_products.json';
        fetch(`/src/${jsonFile}`)
            .then(response => response.json())
            .then(products => {
                let product = products.find(p => p.id == productId);
                if (product) {
                    document.getElementById('productName').textContent = product.name;
                    document.getElementById('productPrice').textContent = `$${product.price}`;
                    document.getElementById('productMaterial').textContent = product.material;
                    document.getElementById('productColor').textContent = product.color;
                    document.getElementById('productSize').textContent = product.size;
                    document.getElementById('mainImage').src = product.image_top; 

                    let thumbnails = document.getElementById('thumbnails');
                    if (thumbnails) {
                        thumbnails.innerHTML = '';
                        product.images.forEach(image => {
                            let img = document.createElement('img');
                            img.src = image;
                            img.alt = `Изображение ${product.images.indexOf(image) + 1}`;
                            img.onmouseover = () => changeMainImage(img);
                            img.onmouseout = resetMainImage;
                            thumbnails.appendChild(img);
                        });
                    } else {
                        console.error('Элемент для миниатюр не найден');
                    }

                    let relatedProducts = document.getElementById('relatedProducts');
                    if (relatedProducts) {
                        relatedProducts.innerHTML = '';
                        product.relatedProducts.forEach(relatedProduct => {
                            let div = document.createElement('div');
                            div.className = 'related-product';
                            let img = document.createElement('img');
                            img.src = relatedProduct.image;
                            img.alt = `Товар ${relatedProduct.id}`;
                            div.appendChild(img);
                            let p = document.createElement('p');
                            p.textContent = relatedProduct.name;
                            div.appendChild(p);
                            relatedProducts.appendChild(div);
                        });
                    } else {
                        console.error('Элемент для связанных товаров не найден');
                    }

                    let addToCartButton = document.getElementById('addToCart');
                    if (addToCartButton) {
                        addToCartButton.onclick = () => addToCart(product);
                        setAddToCartButtonText(false); 
                    } else {
                        console.error('Кнопка "Добавить в корзину" не найдена');
                    }

                    updateBreadcrumbs(product, category);
                } else {
                    alert('Товар не найден');
                }
            })
            .catch(error => console.error('Ошибка загрузки данных:', error));
    }

    function updateBreadcrumbs(product, category) {
        const breadcrumbsList = document.getElementById('breadcrumbs-list');
        if (breadcrumbsList) {
            breadcrumbsList.innerHTML = ''; 

            const homeLi = document.createElement('li');
            homeLi.innerHTML = '<a href="/">Home</a>';
            breadcrumbsList.appendChild(homeLi);

           
            const categoryLi = document.createElement('li');
            categoryLi.innerHTML = `<a href="/store.html?category=${category}">${category === 'men' ? 'Мужская одежда' : 'Женская одежда'}</a>`;
            breadcrumbsList.appendChild(categoryLi);

            const productLi = document.createElement('li');
            productLi.setAttribute('aria-current', 'page');
            productLi.textContent = product.name;
            breadcrumbsList.appendChild(productLi);
        } else {
            console.error('Элемент для хлебных крошек не найден');
        }
    }

    loadProductData(productId, category);
});