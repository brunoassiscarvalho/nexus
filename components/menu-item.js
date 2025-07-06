class MenuItem extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                /* Add specific styles for menu-item here */
                /* For example: */
                li {
                    list-style: none; /* If the ul is outside the component */
                }
                a {
                    display: block;
                    padding: 12px 15px;
                    text-decoration: none;
                    color: var(--light-text);
                    border-radius: 8px;
                    margin-bottom: 10px;
                    transition: background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease;
                    box-shadow:
                        3px 3px 6px var(--neu-shadow-dark),
                        -3px -3px 6px var(--neu-shadow-light);
                }
                a:hover {
                    background-color: var(--accent-color);
                    color: var(--dark-bg);
                }
                a:active {
                    box-shadow:
                        inset 3px 3px 6px var(--neu-shadow-dark),
                        inset -3px -3px 6px var(--neu-shadow-light);
                    background-color: var(--primary-interactive);
                    color: var(--dark-bg);
                }
                 /* Link to global styles */
                :host {
                    display: block; /* Or inline, depending on desired layout */
                }
            </style>
            <li>
                <a href="${this.getAttribute('href') || '#'}">
                    <slot></slot> <!-- For the text content of the link -->
                </a>
            </li>
        `;
    }

    // Attributes to observe
    static get observedAttributes() {
        return ['href'];
    }

    // React to attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'href' && this.shadowRoot.querySelector('a')) {
            this.shadowRoot.querySelector('a').setAttribute('href', newValue);
        }
    }
}
customElements.define('menu-item', MenuItem);
