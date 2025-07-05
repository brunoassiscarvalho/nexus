const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Read the script file content
// Assuming script.js is in the same directory as script.test.js for simplicity here.
// If script.js is in a different location, adjust the path.
const scriptContent = fs.readFileSync(path.resolve(__dirname, 'script.js'), 'utf8');

describe('Dashboard Drawer Functionality', () => {
    let dom;
    let window;
    let document;
    let menuButton;
    let drawerMenu;
    let body;
    let navLink;

    beforeEach(() => {
        // Set up a new JSDOM instance for each test
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Test Document</title>
            </head>
            <body>
                <header class="header">
                    <button class="menu-button" id="menuButton" aria-expanded="false">&#9776;</button>
                    <h1 class="dashboard-title">Dashboard</h1>
                </header>
                <nav class="drawer-menu" id="drawerMenu" aria-hidden="true">
                    <ul>
                        <li><a href="#" id="testNavLink">Home</a></li>
                        <li><a href="#">Analytics</a></li>
                    </ul>
                </nav>
                <main class="content"></main>
                <div id="outsideElement">Click outside here</div>
            </body>
            </html>
        `;
        dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
        window = dom.window;
        document = window.document;
        body = document.body;

        // Execute the script in the JSDOM context
        const scriptEl = document.createElement('script');
        scriptEl.textContent = scriptContent;
        document.body.appendChild(scriptEl);
        
        // Re-query elements after script execution, as script.js adds listeners
        menuButton = document.getElementById('menuButton');
        drawerMenu = document.getElementById('drawerMenu');
        navLink = document.getElementById('testNavLink'); // Example nav link
    });

    test('should toggle "open" class on drawerMenu when menuButton is clicked', () => {
        expect(drawerMenu.classList.contains('open')).toBe(false);
        menuButton.click();
        expect(drawerMenu.classList.contains('open')).toBe(true);
        menuButton.click();
        expect(drawerMenu.classList.contains('open')).toBe(false);
    });

    test('should toggle "drawer-open" class on body when menuButton is clicked', () => {
        expect(body.classList.contains('drawer-open')).toBe(false);
        menuButton.click();
        expect(body.classList.contains('drawer-open')).toBe(true);
        menuButton.click();
        expect(body.classList.contains('drawer-open')).toBe(false);
    });

    test('should update ARIA attributes when menuButton is clicked', () => {
        expect(menuButton.getAttribute('aria-expanded')).toBe('false');
        expect(drawerMenu.getAttribute('aria-hidden')).toBe('true');
        
        menuButton.click();
        expect(menuButton.getAttribute('aria-expanded')).toBe('true');
        expect(drawerMenu.getAttribute('aria-hidden')).toBe('false');

        menuButton.click();
        expect(menuButton.getAttribute('aria-expanded')).toBe('false');
        expect(drawerMenu.getAttribute('aria-hidden')).toBe('true');
    });

    test('should close drawer when a navigation link is clicked', () => {
        // Open the drawer first
        menuButton.click();
        expect(drawerMenu.classList.contains('open')).toBe(true);
        expect(body.classList.contains('drawer-open')).toBe(true);

        // Click a nav link
        navLink.click();
        expect(drawerMenu.classList.contains('open')).toBe(false);
        expect(body.classList.contains('drawer-open')).toBe(false);
        expect(menuButton.getAttribute('aria-expanded')).toBe('false');
        expect(drawerMenu.getAttribute('aria-hidden')).toBe('true');
    });

    test('should close drawer when clicking outside the drawer', () => {
        // Open the drawer first
        menuButton.click();
        expect(drawerMenu.classList.contains('open')).toBe(true);

        // Simulate a click on an element outside the drawer
        const outsideElement = document.getElementById('outsideElement');
        const clickEvent = new window.MouseEvent('click', { bubbles: true });
        outsideElement.dispatchEvent(clickEvent);
        
        expect(drawerMenu.classList.contains('open')).toBe(false);
        expect(body.classList.contains('drawer-open')).toBe(false);
        expect(menuButton.getAttribute('aria-expanded')).toBe('false');
        expect(drawerMenu.getAttribute('aria-hidden')).toBe('true');
    });

    test('should not close drawer when clicking inside the drawer', () => {
        // Open the drawer first
        menuButton.click();
        expect(drawerMenu.classList.contains('open')).toBe(true);

        // Simulate a click on an element inside the drawer (e.g., the nav link itself)
        const clickEvent = new window.MouseEvent('click', { bubbles: true });
        navLink.dispatchEvent(clickEvent); // navLink click also closes, so this tests the "outside" logic specifically
                                         // To be more precise, we could add a non-interactive element inside the drawer for this test.
                                         // However, since navLink click *does* close it, this also confirms the outside click listener
                                         // is not misfiring for internal clicks if the internal click itself didn't close it.
                                         // Let's refine this:

        // Re-open for a click on the drawer itself (not a link)
        drawerMenu.classList.remove('open'); // close it from navLink click
        body.classList.remove('drawer-open');
        menuButton.setAttribute('aria-expanded', 'false');
        drawerMenu.setAttribute('aria-hidden', 'true');
        
        menuButton.click(); // Re-open
        expect(drawerMenu.classList.contains('open')).toBe(true);

        const drawerClickEvent = new window.MouseEvent('click', { bubbles: true });
        drawerMenu.dispatchEvent(drawerClickEvent); // Click directly on the drawer background

        expect(drawerMenu.classList.contains('open')).toBe(true); // Should remain open
    });

    test('should not close drawer when clicking the menu button itself again', () => {
        // Open the drawer
        menuButton.click();
        expect(drawerMenu.classList.contains('open')).toBe(true);

        // Click the menu button again (which should toggle it closed, not trigger the "click outside" logic)
        menuButton.click();
        expect(drawerMenu.classList.contains('open')).toBe(false); // Closed by its own toggle, not by "click outside"
    });
});
