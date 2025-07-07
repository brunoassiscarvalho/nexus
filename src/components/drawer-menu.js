import { LitElement, html, css } from 'lit';

class DrawerMenu extends LitElement {
  static properties = {
    open: { type: Boolean, reflect: true },
  };

  static styles = css`
    :host {
      display: block;
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
      border-right: 1px solid var(--accent-color); /* Subtle border */
    }

    :host([open]) {
      left: 0;
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    li a {
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

    li a:hover {
      background-color: var(--accent-color);
      color: var(--dark-bg);
    }

    li a:active {
      box-shadow:
        inset 3px 3px 6px var(--neu-shadow-dark),
        inset -3px -3px 6px var(--neu-shadow-light);
      background-color: var(--primary-interactive);
      color: var(--dark-bg);
    }
  `;

  constructor() {
    super();
    this.open = false;
  }

  render() {
    return html`
      <ul>
        <li><a href="#" @click=${this._closeMenu}>Home</a></li>
        <li><a href="#" @click=${this._closeMenu}>Analytics</a></li>
        <li><a href="#" @click=${this._closeMenu}>Reports</a></li>
        <li><a href="#" @click=${this._closeMenu}>Settings</a></li>
        <li><a href="#" @click=${this._closeMenu}>Profile</a></li>
      </ul>
    `;
  }

  _closeMenu() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('menu-closed', { bubbles: true, composed: true }));
  }
}

customElements.define('drawer-menu', DrawerMenu);
