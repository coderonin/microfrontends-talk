const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    text-align: center;
    flex: 1;
    background: linear-gradient(to bottom, #89253e, #3a6186);
  }

  .artist-pic{
    width: 350px;
    height: 350px;
    box-shadow: 2px 2px 9px #0000008f;
    margin: 36px auto 24px;
  }

  .artist-description{
    width: 600px;
    margin: auto;
  }
  
  .placeholder:before {
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
  
  .placeholder.bold-holder:before {
    opacity:.6;
    height:14px;
    margin: 0;
  }

  h1.placeholder {
    margin: 30px auto 36px;
    width: 160px;
  }

  @keyframes RenderAnim { 
    0%{background-position:0% 0%}
    50%{background-position:100% 0%}
    100%{background-position:201% 0%}
  }
</style>
<div id="artist-app">
  <div class="artist-pic"></div>
  <div class="artist-description">
    <h1 class="placeholder bold-holder"></h1>
    <div class="placeholder"></div>
    <div class="placeholder"></div>
    <div class="placeholder"></div>
  </div>
</div>
`;

class ArtistCmp extends HTMLElement {

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.appNode = this._shadowRoot.getElementById('artist-app');
  }
  
  static get observedAttributes() {
    return ['artist'];
  }

  connectedCallback() {
    if (!window.ArtistApp) {
      import(/* webpackIgnore: true */'/src/dist/ArtistApp.js').then(this.renderApp.bind(this));
    } else {
      this.renderApp();
    }
  }

  renderApp(){
    window.ArtistApp.startApp(this._artist, this, this.appNode);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this[`_${name}`] = newVal;
  }
}

window.customElements.define('artist-page', ArtistCmp);
