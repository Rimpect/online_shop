document.addEventListener('DOMContentLoaded', function() {
    let productsPerPage = 6; // Количество товаров на странице
    let currentPage = 1; // Текущая страница
    let columns = 3; // Количество товаров в строке

    const products = document.querySelectorAll('.product-item');
    let totalPages = Math.ceil(products.length / productsPerPage);

    function showPage(page) {
        const start = (page - 1) * productsPerPage;
        const end = start + productsPerPage;

        products.forEach((product, index) => {
            if (index >= start && index < end) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });

        document.getElementById('page-number').textContent = page;
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

        // Обновляем количество товаров на странице в зависимости от количества колонок
        productsPerPage = columns === 3 ? 6 : 8;
        totalPages = Math.ceil(products.length / productsPerPage);
        redistributeProducts();
    }

    function redistributeProducts() {
        const container = document.querySelector('.row');
        container.innerHTML = ''; // Очищаем контейнер

        const start = (currentPage - 1) * productsPerPage;
        const end = start + productsPerPage;

        let productCount = 0;
        let productsToShow = [];

        // Собираем товары для текущей страницы
        for (let i = start; i < end; i++) {
            if (i < products.length) {
                productsToShow.push(products[i]);
                productCount++;
            }
        }

        // Если товаров недостаточно, добавляем товары со следующих страниц
        let nextPageStart = end;
        while (productCount < productsPerPage && nextPageStart < products.length) {
            productsToShow.push(products[nextPageStart]);
            productCount++;
            nextPageStart++;
        }

        // Отображаем товары
        productsToShow.forEach(product => {
            const col = document.createElement('div');
            col.className = `col ${columns === 3 ? 's12 m6 l4' : 's12 m6 l3'}`;
            col.appendChild(product.cloneNode(true));
            container.appendChild(col);
        });

        // Дополняем пустыми элементами до нужного количества
        while (productCount < productsPerPage) {
            const col = document.createElement('div');
            col.className = `col ${columns === 3 ? 's12 m6 l4' : 's12 m6 l3'}`;
            col.innerHTML = '<div class="empty-product"></div>'; // Пустой элемент
            container.appendChild(col);
            productCount++;
        }
    }

    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            updatePaginationButtons();
            redistributeProducts();
        }
    });

    document.getElementById('next-page').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            updatePaginationButtons();
            redistributeProducts();
        }
    });

    document.getElementById('toggleColumnsBtn').addEventListener('click', function() {
        columns = columns === 3 ? 4 : 3;
        updateColumns();
        showPage(1); // При смене колонок переключаемся на первую страницу
        updatePaginationButtons();
        redistributeProducts();
    });

    // Инициализация отображения первой страницы
    showPage(currentPage);
    updatePaginationButtons();
    updateColumns();
    redistributeProducts();
});