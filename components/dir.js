class DirView extends HTMLElement {
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    let items = [];
    try {
      items = JSON.parse(this.getAttribute('items') || '[]');
    } catch (e) {
      console.error('Invalid JSON provided to items attribute:', e);
    }

    // Extract non-empty path segments from URL
    // e.g., "/files/comunica/" -> ["files", "comunica"]
    const segments = window.location.pathname
      .split('/')
      .filter(Boolean);

    let headerHTML = '';

    if (segments.length <= 1) {
      // We are at the repo root
      const rootName = segments.length === 1 ? segments[0] : 'root';
      headerHTML = `<span class="current-dir">${rootName}</span>`;
    } else {
      const currentDir = segments[segments.length - 1];
      const parentSegments = segments.slice(0, -1);

      // Dynamically build relative links
      const parentBreadcrumbs = parentSegments.map((name, index) => {
        const depth = segments.length - (index + 1);
        return `<a href="${'../'.repeat(depth)}">${name}</a><span class="separator">/</span>`;
      }).join('');

      headerHTML = `${parentBreadcrumbs}<span class="current-dir">${currentDir}</span>`;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: #24292e;
          display: block;
          max-width: 600px;
          margin: 2rem auto;
          padding: 0 1rem;
        }
        h1 {
          font-size: 1.25rem;
          font-weight: 600;
          border-bottom: 1px solid #e1e4e8;
          padding-bottom: 0.5rem;
          margin-bottom: 0.75rem;
          word-break: break-all;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        li {
          padding: 0.4rem 0;
          border-bottom: 1px solid #f6f8fa;
          display: flex;
          align-items: center;
        }
        a {
          color: #0366d6;
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        .is-dir {
          font-weight: 600;
        }
        .separator {
          color: #6a737d;
          font-weight: 400;
          margin: 0 0.15rem;
        }
        .current-dir {
          color: #24292e;
        }
        .icon {
          margin-right: 0.5rem;
          display: inline-flex;
          align-items: center;
        }
        svg {
          width: 16px;
          height: 16px;
          fill: #586069;
        }
      </style>

      <h1>
        <span class="separator">/</span>${headerHTML}
      </h1>

      <ul>
        ${items.map(item => `
          <li>
            <span class="icon">
              ${item.isDir 
                ? `<svg viewBox="0 0 16 16"><path d="M1.75 1A1.75 1.75 0 000 2.75v10.5C0 14.22.78 15 1.75 15h12.5A1.75 1.75 0 0016 13.25v-8.5A1.75 1.75 0 0014.25 3H7.5L5.61 1.11A1.75 1.75 0 004.37 1H1.75z"></path></svg>`
                : `<svg viewBox="0 0 16 16"><path d="M2 1.75C2 .784 2.784 0 3.75 0h5.586c.464 0 .909.184 1.237.513l3.414 3.414c.329.328.513.773.513 1.237v9.086A1.75 1.75 0 0112.75 16h-9A1.75 1.75 0 012 14.25V1.75z"></path></svg>`
              }
            </span>
            <a href="${item.path}" class="${item.isDir ? 'is-dir' : ''}">
              ${item.path}
            </a>
          </li>
        `).join('')}
      </ul>
    `;
  }
}

customElements.define('dir-view', DirView);