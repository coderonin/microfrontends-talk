const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
      display: block;
      padding: 0;
      margin: 0;
      font-family: sans-serif;
      background: black;
      width: 200px;
      color: white;
      font-size: 14px;
    }
    
    .nav-logo{
      margin: 18px auto;
      text-align: left;
      padding: 0px 12px 12px;
      box-sizing: border-box;
    }

    .nav-logo h1 {
      display: inline-block;
      margin: auto 12px;
      font-size: 1.3em;
    }

    .nav-logo .icon-headphones{
      font-size: 1.3em;
    }

    .nav-item, .nav-logo {
      width: 85%;
      margin-left:6px;
    }

    .nav-placeholder:before {
      content: '';
      display: block;
      border-radius: 5px;
      width :100%;
      height: 8px;
      background: white;
      opacity: .3;
      margin: 18px auto;
      background: linear-gradient(270deg, #ffffff, #9a9a9a, #ffffff);
      background-size: 200% 200%;
      animation: RenderAnim 1s linear infinite;
    }

    .nav-placeholder.nav-bold:before {
      opacity:.6;
      height:14px;
      margin: 24px auto;
    }

    .nav-underline {
      border-bottom: 1px solid white;
    }

    @keyframes RenderAnim { 
      0%{background-position:0% 0%}
      50%{background-position:100% 0%}
      100%{background-position:201% 0%}
    }
</style>
<link rel="stylesheet" href="/src/styles/icons.css" />
<nav id="nav-app">
    <div class="nav-logo nav-underline">
      <span class="icon-headphones"></span>
      <h1>ESpofity</h1>
    </div>
    <div class="nav-item nav-placeholder nav-bold nav-underline"></div>
    <div class="nav-item nav-placeholder nav-bold nav-underline"></div>
    <div class="nav-item nav-placeholder nav-bold"></div>
    <div class="nav-item nav-placeholder"></div>
    <div class="nav-item nav-placeholder"></div>
    <div class="nav-item nav-placeholder"></div>
    <div class="nav-item nav-placeholder"></div>
    <div class="nav-item nav-placeholder"></div>
</nav>
`;

class NavigationCmp extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.appNode = this._shadowRoot.getElementById('nav-app');
  }

  connectedCallback() {
    if (!window.NavApplication) {
      import(/* webpackIgnore: true */'/src/dist/NavApplication.js').then(this.renderApp.bind(this));
    } else {
      this.renderApp();
    }
  }

  renderApp(){
    window.NavApplication.startApp(this, this.appNode);
  }
}

window.customElements.define('navigation-bar', NavigationCmp);