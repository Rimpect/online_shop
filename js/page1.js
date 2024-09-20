document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.carousel');
    var instances = M.Carousel.init(elems, {
        fullWidth: true,
        indicators: true,
        numVisible: 3
    });

    var carousel = instances[0];

    document.getElementById('prevBtn').addEventListener('click', function() {
        carousel.prev();
    });

    document.getElementById('nextBtn').addEventListener('click', function() {
        carousel.next();
    });
});