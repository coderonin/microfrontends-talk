const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    text-align: center;
    background: linear-gradient(to left, #243B55, #141E30);
    flex: 1;
  }

  #search-list ul{
    padding-inline-start: 0;
    padding: 0;
    text-align: left;
    margin: 12px 6px;
  }

  #search-list ul li{
    overflow: auto;
    padding: 18px 18px 12px;
    background: #0000005e;
    margin-bottom: 6px;
    border-radius: 5px;
  }
  
  #search-list ul li span{
    float: left;
    height: 20px;
    width: 120px;
    margin: 0 12px 0 0;
  }

  .placeholder:before {
    content: '';
    display: block;
    border-radius: 5px;
    width :100%;
    height: 8px;
    margin: 3px 0;
    background: white;
    opacity: .3;
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
    margin: 24px;
    width: 160px;
  }

  #search-list ul li span.placeholder.song-time{
    float:right;
  }

  @keyframes RenderAnim { 
    0%{background-position:0% 0%}
    50%{background-position:100% 0%}
    100%{background-position:201% 0%}
  }
</style>
<link rel="stylesheet" href="/src/styles/icons.css" />
<div id="search-list">
  <h1 class="placeholder bold-holder"></h1>
  <ul>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
  </ul>
</div>
`;


class SearchResultCmp extends HTMLElement {

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.appNode = this._shadowRoot.getElementById('search-list');
  }
  
  static get observedAttributes() {
    return ['query-string'];
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this[`_${name}`] = newVal;
  }

  connectedCallback() {
    if (!window.SearchApp) {
      import(/* webpackIgnore: true */'/src/dist/SearchApp.js').then(this.renderApp.bind(this));
    } else {
      this.renderApp();
    }
  }

  renderApp(){
    window.SearchApp.startApp(this, this.appNode, this['_query-string']);
  }
}

window.customElements.define('search-page', SearchResultCmp);
