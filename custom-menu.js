class CustomMenu extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Use Shadow DOM

        // Create a slot for menu items
        const slot = document.createElement('slot');

        // Basic styling for the menu container
        const style = document.createElement('style');
        style.textContent = `
            :host { /* Style the host element itself */
                display: block; /* Or 'inline-block', 'flex', etc. depending on desired layout */
                border: 1px solid #ddd;
                padding: 8px;
                border-radius: 4px;
                background-color: #f9f9f9;
            }
            ::slotted(menu-button) { /* Style slotted menu-button elements */
                /* You can add specific styles for slotted buttons if needed */
                /* For example, to remove their individual margins if the container handles spacing */
                margin: 2px;
            }
        `;

        // Append the style and slot to the shadow root
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(slot);

        // Example of handling events from slotted items (e.g., menu-button clicks)
        this.shadowRoot.addEventListener('menu-button-click', (event) => {
            console.log('Menu received click from:', event.detail.label, event.target);
            // You could add logic here to, for example, close other submenus,
            // navigate, or perform an action based on the button clicked.
        });
    }

    // Observe attributes for changes if needed
    static get observedAttributes() {
        return ['id']; // Example: if you need to react to id changes
    }

    // React to attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'id') {
            // console.log(`CustomMenu id changed from ${oldValue} to ${newValue}`);
        }
    }

    // Lifecycle callback when the element is added to the DOM
    connectedCallback() {
        // console.log('CustomMenu added to page.');
        // You might want to check slotted items here or set up initial state
    }

    // Lifecycle callback when the element is removed from the DOM
    disconnectedCallback() {
        // console.log('CustomMenu removed from page.');
    }
}

// Define the new custom element
customElements.define('custom-menu', CustomMenu);
