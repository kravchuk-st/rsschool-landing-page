class ThemeSwitcher {
  constructor() {
    this.root = document.documentElement;
    this.toggleBtn = document.getElementById('theme-toggle');
    this.init();
  }

  init() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');

    this.setTheme(theme);
    this.toggleBtn?.addEventListener('click', () => this.toggle());

    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
  }

  setTheme(theme) {
    this.root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.updateIcon(theme);
  }

  toggle() {
    const current = this.root.getAttribute('data-theme');
    this.setTheme(current === 'dark' ? 'light' : 'dark');
  }

  updateIcon(theme) {
    if (this.toggleBtn) {
      this.toggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new ThemeSwitcher());
