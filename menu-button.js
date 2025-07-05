class MenuButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' }); // Use Shadow DOM

        // Get the label from the attribute, default to "Button"
        const label = this.getAttribute('label') || 'Button';

        // Create the button element
        const button = document.createElement('button');
        button.textContent = label;

        // Basic styling for the button (can be expanded in CSS)
        const style = document.createElement('style');
        style.textContent = `
            button {
                padding: 8px 16px;
                margin: 4px;
                border: 1px solid #ccc;
                background-color: #f0f0f0;
                cursor: pointer;
                border-radius: 4px;
            }
            button:hover {
                background-color: #e0e0e0;
            }
        `;

        // Append the style and button to the shadow root
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(button);

        // Add event listener if needed, e.g., for click events
        button.addEventListener('click', () => {
            // Dispatch a custom event if you want the parent to know about clicks
            this.dispatchEvent(new CustomEvent('menu-button-click', {
                bubbles: true, // Allows the event to bubble up through the DOM
                composed: true, // Allows the event to cross shadow DOM boundaries
                detail: { label: this.getAttribute('label') }
            }));
        });
    }

    // Observe attributes for changes if needed
    static get observedAttributes() {
        return ['label'];
    }

    // React to attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'label' && this.shadowRoot) {
            const button = this.shadowRoot.querySelector('button');
            if (button) {
                button.textContent = newValue || 'Button';
            }
        }
    }

    // Lifecycle callback when the element is added to the DOM
    connectedCallback() {
        // console.log('MenuButton added to page.');
    }

    // Lifecycle callback when the element is removed from the DOM
    disconnectedCallback() {
        // console.log('MenuButton removed from page.');
    }
}

// Define the new custom element
customElements.define('menu-button', MenuButton);
