import { LitElement, html, css } from 'lit';

class AppWidget extends LitElement {
  static properties = {
    title: { type: String },
  };

  static styles = css`
    .widget {
      background-color: var(--dark-bg);
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 12px;
      box-shadow:
        8px 8px 15px var(--neu-shadow-dark),
        -8px -8px 15px var(--neu-shadow-light);
    }

    .widget h2 {
      color: var(--primary-interactive);
      margin-top: 0;
      border-bottom: 1px solid var(--accent-color);
      padding-bottom: 10px;
    }
  `;

  constructor() {
    super();
    this.title = 'Widget';
  }

  render() {
    return html`
      <div class="widget">
        <h2>${this.title}</h2>
        <slot></slot>
      </div>
    `;
  }
}

customElements.define('app-widget', AppWidget);
