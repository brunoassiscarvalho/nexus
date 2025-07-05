document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const drawerMenu = document.getElementById('drawerMenu');
    const content = document.querySelector('.content'); // To adjust margin
    const body = document.body;

    if (menuButton && drawerMenu) {
        menuButton.addEventListener('click', () => {
            drawerMenu.classList.toggle('open');
            body.classList.toggle('drawer-open'); // Toggle class on body

            // Optional: Add ARIA attributes for accessibility
            const isExpanded = menuButton.getAttribute('aria-expanded') === 'true' || false;
            menuButton.setAttribute('aria-expanded', !isExpanded);
            drawerMenu.setAttribute('aria-hidden', isExpanded);
        });
    }

    // Optional: Close drawer when clicking outside of it or on a nav link
    document.addEventListener('click', (event) => {
        // Close if drawer is open, the click is outside the drawer, and not on the menu button
        if (drawerMenu.classList.contains('open') && !drawerMenu.contains(event.target) && event.target !== menuButton) {
            drawerMenu.classList.remove('open');
            body.classList.remove('drawer-open');
            menuButton.setAttribute('aria-expanded', 'false');
            drawerMenu.setAttribute('aria-hidden', 'true');
        }
    });

    // Close drawer when a navigation link is clicked (optional, good for SPA-like feel)
    const navLinks = drawerMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (drawerMenu.classList.contains('open')) {
                drawerMenu.classList.remove('open');
                body.classList.remove('drawer-open');
                menuButton.setAttribute('aria-expanded', 'false');
                drawerMenu.setAttribute('aria-hidden', 'true');
            }
        });
    });
});
