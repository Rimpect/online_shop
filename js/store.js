document.addEventListener('DOMContentLoaded', function() {
    const productsPerPage = 6; // Количество товаров на странице
    let currentPage = 1; // Текущая страница
    let columns = 3; // Количество товаров в строке

    const products = document.querySelectorAll('.product-item');
    const totalPages = Math.ceil(products.length / productsPerPage);

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
    }

    document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            updatePaginationButtons();
        }
    });

    document.getElementById('next-page').addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            updatePaginationButtons();
        }
    });

    document.getElementById('toggleColumnsBtn').addEventListener('click', function() {
        columns = columns === 3 ? 4 : 3;
        updateColumns();
    });

    // Инициализация отображения первой страницы
    showPage(currentPage);
    updatePaginationButtons();
    updateColumns();
});