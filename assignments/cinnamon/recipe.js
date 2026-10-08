// Highlight the recipe section selected in the menu.
document.querySelectorAll('.assignment-nav a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
        document.querySelectorAll('.assignment-nav a').forEach(function (item) {
            item.removeAttribute('aria-current');
        });
        link.setAttribute('aria-current', 'location');
    });
});
