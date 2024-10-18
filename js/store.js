document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category') || 'women'; 
    const productId = urlParams.get('productId'); 
    let productsPerPage = 6; 
    let currentPage = 1; 
    let columns = 3; 
    let products = [];
    let totalPages = 0;

    function loadProducts(category) {
        const jsonFile = category === 'men' ? 'men_products.json' : 'women_products.json';
        $.ajax({
            url: `src/${jsonFile}`, 
            method: 'GET',
            success: function(data) {
                products = data;
                totalPages = Math.ceil(products.length / productsPerPage);
                showPage(currentPage);
                updatePaginationButtons();
                updateBreadcrumbs(category, productId); 
            },
            error: function(error) {
                console.error('Ошибка загрузки данных:', error);
            }
        });
    }

    function showPage(page) {
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;

        const productsContainer = document.getElementById('products-container');
        productsContainer.innerHTML = '';

        for (let i = start; i < end; i++) {
            if (i < products.length) {
                const product = products[i];
                const col = document.createElement('div');
                col.className = `col ${columns === 3 ? 's12 m6 l4' : 's12 m6 l3'}`;
                col.innerHTML = `
                    <div class="product-item" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-color="${product.color}" data-size="${product.size}">
                        <a href="/product.html?id=${product.id}&category=${category}">
                            <img src="img/index/${product.image}" alt="${product.name}">
                        </a>
                        <div class="preview">
                            <h5>${product.name}</h5>
                            <p>Цена: $${product.price}</p>
                            <p>Цвет: ${product.color}</p>
                            <p>Размер: ${product.size}</p>
                            <button class="btn add-to-cart" data-id="${product.id}">Добавить</button>
                        </div>
                        <div class="product-price">$${product.price}</div>
                    </div>
                `;
                productsContainer.appendChild(col);
            }
        }

        document.getElementById('page-number').textContent = page;

      
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id == productId);
                if (product) {
                    addToCart(product, this);
                }
            });
        });
    }

    function updatePaginationButtons() {
        const prevButton = document.getElementById('prev-page');
        const nextButton = document.getElementById('next-page');

        if (currentPage === 1) {
            prevButton.disabled = true;
        } else {
            prevButton.disabled = false;
        }

        if (currentPage === totalPages) {
            nextButton.disabled = true;
        } else {
            nextButton.disabled = false;
        }
    }

    function updateColumns() {
        const colClass = columns === 3 ? 's12 m6 l4' : 's12 m6 l3';
        document.querySelectorAll('.col').forEach(col => {
            col.className = `col ${colClass}`;
        });

      
        productsPerPage = columns === 3 ? 6 : 8;
        totalPages = Math.ceil(products.length / productsPerPage);
        redistributeProducts();
    }

    function redistributeProducts() {
        const container = document.querySelector('.row');
        container.innerHTML = ''; 

        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;

        let productCount = 0;
        let productsToShow = [];


        for (let i = start; i < end; i++) {
            if (i < products.length) {
                productsToShow.push(products[i]);
                productCount++;
            }
        }

       
        productsToShow.forEach(product => {
            const col = document.createElement('div');
            col.className = `col ${columns === 3 ? 's12 m6 l4' : 's12 m6 l3'}`;
            col.innerHTML = `
                <div class="product-item" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-color="${product.color}" data-size="${product.size}">
                    <a href="/product.html?id=${product.id}&category=${category}">
                        <img src="img/index/${product.image}" alt="${product.name}">
                    </a>
                    <div class="preview">
                        <h5>${product.name}</h5>
                        <p>Цена: $${product.price}</p>
                        <p>Цвет: ${product.color}</p>
                        <p>Размер: ${product.size}</p>
                        <button class="btn add-to-cart" data-id="${product.id}">Добавить</button>
                    </div>
                    <div class="product-price">$${product.price}</div>
                </div>
            `;
            container.appendChild(col);
        });

       
        while (productCount < productsPerPage) {
            const col = document.createElement('div');
            col.className = `col ${columns === 3 ? 's12 m6 l4' : 's12 m6 l3'}`;
            col.innerHTML = '<div class="empty-product"></div>'; // Пустой элемент
            container.appendChild(col);
            productCount++;
        }

        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id == productId);
                if (product) {
                    addToCart(product, this);
                }
            });
        });
    }

    function updateBreadcrumbs(category, productId) {
        const breadcrumbsList = document.getElementById('breadcrumbs-list');
        breadcrumbsList.innerHTML = ''; 

     
        const homeLi = document.createElement('li');
        homeLi.innerHTML = '<a href="/">Home</a>';
        breadcrumbsList.appendChild(homeLi);

        
        const categoryLi = document.createElement('li');
        categoryLi.innerHTML = `<a href="/store.html?category=${category}">${category === 'men' ? 'Мужская одежда' : 'Женская одежда'}</a>`;
        breadcrumbsList.appendChild(categoryLi);

        
        if (productId) {
            const product = products.find(p => p.id === productId);
            if (product) {
                const productLi = document.createElement('li');
                productLi.setAttribute('aria-current', 'page');
                productLi.textContent = product.name;
                breadcrumbsList.appendChild(productLi);
            }
        }
    }

    function addToCart(product, button) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));

 
        button.textContent = 'Добавлен';
    }

    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const toggleColumnsBtn = document.getElementById('toggleColumnsBtn');

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
                updatePaginationButtons();
                redistributeProducts();
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
                updatePaginationButtons();
                redistributeProducts();
            }
        });
    }

    if (toggleColumnsBtn) {
        toggleColumnsBtn.addEventListener('click', function() {
            columns = columns === 3 ? 4 : 3;
            updateColumns();
            showPage(1); // При смене колонок переключается на первую страницу
            updatePaginationButtons();
            redistributeProducts();
        });
    }

    // Инициализация отображения первой страницы
    loadProducts(category);
});