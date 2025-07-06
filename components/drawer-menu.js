class DrawerMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                /* Add specific styles for drawer-menu here */
                /* For example: */
                .drawer-menu {
                    position: fixed;
                    top: 0;
                    left: -280px; /* Initially hidden */
                    width: 250px;
                    height: 100%;
                    background-color: var(--dark-bg);
                    padding: 70px 15px 20px 15px; /* Top padding to clear header */
                    box-shadow: 5px 0px 10px var(--neu-shadow-dark);
                    transition: left 0.3s ease-in-out;
                    z-index: 999;
                    border-right: 1px solid var(--accent-color);
                }
                .drawer-menu.open {
                    left: 0;
                }
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                /* Link to global styles */
                :host {
                    display: block; /* Ensure the component itself is a block-level element */
                    position: fixed;
                    top: 0;
                    left: -280px; /* Initially hidden */
                    width: 250px;
                    height: 100%;
                    background-color: var(--dark-bg);
                    padding: 70px 15px 20px 15px; /* Top padding to clear header */
                    box-shadow: 5px 0px 10px var(--neu-shadow-dark);
                    transition: left 0.3s ease-in-out;
                    z-index: 999; /* Below header (1000) but above content */
                    border-right: 1px solid var(--accent-color);
                    box-sizing: border-box; /* Ensure padding doesn't increase width */
                }
                :host(.open) {
                    left: 0;
                }
                ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
            </style>
            <nav> <!-- Removed class .drawer-menu as styles are on :host -->
                <ul>
                    <slot></slot> <!-- This will render the menu-item components -->
                </ul>
            </nav>
        `;
        this._isOpen = false;
        // No need for this._drawerElement if styles are on :host
    }

    toggle() {
        this._isOpen = !this._isOpen;
        this.classList.toggle('open', this._isOpen); // Toggle class on the host element
        document.body.classList.toggle('drawer-open', this._isOpen);

        const menuButton = document.querySelector('nav-header')?.shadowRoot.getElementById('menuButton');
        if (menuButton) {
            menuButton.setAttribute('aria-expanded', this._isOpen.toString());
        }
        this.setAttribute('aria-hidden', (!this._isOpen).toString());
    }

    open() {
        if (!this._isOpen) {
            this.toggle();
        }
    }

    close() {
        if (this._isOpen) {
            this.toggle();
        }
    }

    get isOpen() {
        return this._isOpen;
    }

    connectedCallback() {
        // Close drawer when clicking outside of it
        // This might need adjustment as the event listener is global
        // and needs to check if the click is outside this component's shadow DOM.
        // For simplicity, the main script.js might handle this better or
        // this component could dispatch an event that the main script listens for.

        // Close drawer when a navigation link (menu-item) is clicked
        this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => {
            this.shadowRoot.querySelector('slot').assignedNodes().forEach(node => {
                if (node.tagName === 'MENU-ITEM') {
                    node.addEventListener('click', () => {
                        if (this.isOpen) {
                            this.close();
                        }
                    });
                }
            });
        });
    }
}
customElements.define('drawer-menu', DrawerMenu);
