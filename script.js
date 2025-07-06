document.addEventListener('DOMContentLoaded', () => {
    const drawerMenuComponent = document.querySelector('drawer-menu');
    const navHeaderComponent = document.querySelector('nav-header');

    // Close drawer when clicking outside of it
    document.addEventListener('click', (event) => {
        if (!drawerMenuComponent || !navHeaderComponent) return;

        const isClickInsideDrawer = drawerMenuComponent.contains(event.target) ||
                                   (drawerMenuComponent.shadowRoot && drawerMenuComponent.shadowRoot.contains(event.target));
        const isClickInsideHeader = navHeaderComponent.contains(event.target) ||
                                   (navHeaderComponent.shadowRoot && navHeaderComponent.shadowRoot.contains(event.target));


        if (drawerMenuComponent.isOpen && !isClickInsideDrawer && !isClickInsideHeader) {
            // Check if the click was on the menu button itself (which is inside navHeaderComponent's shadow DOM)
            // The menu button's own click handler in nav-header.js will toggle the menu.
            // So, if the click is on the menu button, we don't want to immediately close it here.
            // The `navHeaderComponent.shadowRoot.contains(event.target)` check above handles clicks within the header.
            // If the click was specifically on the menu button, its handler would have already run.
            // This logic is tricky because the menu button *toggles*. If it was *opening* the menu,
            // this listener might immediately close it.
            // A robust way is to check if the event path for the click includes the menu button.
            const path = event.composedPath();
            const menuButtonInHeader = navHeaderComponent.shadowRoot.getElementById('menuButton');

            if (path.includes(menuButtonInHeader)) {
                // Click was on the menu button, its own handler in nav-header.js manages the toggle.
                return;
            }
            drawerMenuComponent.close();
        }
    });
});
