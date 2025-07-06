class NavHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                /* Add specific styles for nav-header here, copying from style.css if necessary */
                /* For example: */
                .header {
                    background-color: var(--dark-bg);
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    box-shadow:
                        5px 5px 10px var(--neu-shadow-dark),
                        -5px -5px 10px var(--neu-shadow-light);
                    position: fixed; /* Or adjust if managed by parent */
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                }
                .menu-button {
                    background-color: transparent;
                    color: var(--primary-interactive);
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 8px 12px;
                    margin-right: 20px;
                    border-radius: 8px;
                    box-shadow:
                        3px 3px 6px var(--neu-shadow-dark),
                        -3px -3px 6px var(--neu-shadow-light);
                    transition: box-shadow 0.2s ease-in-out, color 0.2s ease-in-out;
                }
                .menu-button:hover {
                    color: var(--light-text);
                }
                .menu-button:active {
                    box-shadow:
                        inset 3px 3px 6px var(--neu-shadow-dark),
                        inset -3px -3px 6px var(--neu-shadow-light);
                    color: var(--accent-color);
                }
                .dashboard-title {
                    margin: 0;
                    font-size: 24px;
                    color: var(--light-text);
                }
                /* Link to global styles */
                :host { /* Required to make global CSS variables work in shadow DOM */
                    display: contents;
                }
            </style>
            <header class="header">
                <button class="menu-button" id="menuButton">&#9776;</button>
                <h1 class="dashboard-title">${this.getAttribute('title') || 'Dashboard'}</h1>
            </header>
        `;
    }

    connectedCallback() {
        const menuButton = this.shadowRoot.getElementById('menuButton');
        menuButton.addEventListener('click', () => {
            const drawerMenu = document.querySelector('drawer-menu'); // Or pass via event/attribute
            if (drawerMenu) {
                drawerMenu.toggle();
            }
        });
    }
}
customElements.define('nav-header', NavHeader);
