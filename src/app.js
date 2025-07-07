document.addEventListener('DOMContentLoaded', () => {
  const drawerMenu = document.querySelector('drawer-menu');
  const appHeader = document.querySelector('app-header');
  const body = document.body;
  const content = document.querySelector('.content');

  if (appHeader && drawerMenu) {
    appHeader.addEventListener('menu-toggle', () => {
      drawerMenu.open = !drawerMenu.open;
      body.classList.toggle('drawer-open', drawerMenu.open);
      // Optional: Add ARIA attributes for accessibility
      // const isExpanded = appHeader.getAttribute('aria-expanded') === 'true' || false;
      // appHeader.setAttribute('aria-expanded', !isExpanded);
      // drawerMenu.setAttribute('aria-hidden', isExpanded);
    });
  }

  // Optional: Close drawer when clicking outside of it
  document.addEventListener('click', (event) => {
    if (drawerMenu.open && !drawerMenu.contains(event.target) && !appHeader.contains(event.target)) {
      drawerMenu.open = false;
      body.classList.remove('drawer-open');
      // appHeader.setAttribute('aria-expanded', 'false');
      // drawerMenu.setAttribute('aria-hidden', 'true');
    }
  });

  // Close drawer when a navigation link is clicked (handled within drawer-menu component)
  drawerMenu.addEventListener('menu-closed', () => {
    body.classList.remove('drawer-open');
    // appHeader.setAttribute('aria-expanded', 'false');
    // drawerMenu.setAttribute('aria-hidden', 'true');
  });
});
