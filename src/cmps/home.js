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
    overflow: hidden;
    background: linear-gradient(to left, #243B55, #141E30);
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

  #top-home-nav {
    border-bottom: 1px solid #303134;
    background: black;
  }

  #top-home-nav ul{
    padding-inline-start: 0;
    padding: 0;
    text-align: left;
    margin: 0 0 0 6px;
  }

  #top-home-nav ul li{
    display: inline-block;
    width: 100px;
    margin: auto 12px;
  }

  .sample-artists{
    display: flex;
    flex-wrap: wrap;
    align-content: space-around;
    padding: 0 18px;
  }

  .sample-artists .box{
    position: relative;
    width: 180px;
    height: 260px;
    margin-top: 24px;
    margin-right: 12px;
  }

  .placeholder.box:before {
    position: absolute;
    top: 0;
    bottom:0;
    height: auto;
    margin: 0;
  }

  h1.placeholder {
    margin: 24px 12px 6px 18px;
    width: 160px;
  }

  @keyframes RenderAnim { 
    0%{background-position:0% 0%}
    50%{background-position:100% 0%}
    100%{background-position:201% 0%}
  }
</style>
<div id="home-app">
    <nav id="top-home-nav">
      <ul>
        <li class="placeholder"></li>
        <li class="placeholder"></li>
        <li class="placeholder"></li>
        <li class="placeholder"></li>
      </ul>
    </nav>
    <h1 class="placeholder bold-holder"></h1>
    <section id="sample-artists">
      <div class="placeholder box"></div>
      <div class="placeholder box"></div>
      <div class="placeholder box"></div>
      <div class="placeholder box"></div>
      <div class="placeholder box"></div>
      <div class="placeholder box"></div>
    </section>
</div>
`;


class HomeCmp extends HTMLElement {

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.appNode = this._shadowRoot.getElementById('home-app');
  }

  connectedCallback() {
    if (!window.HomeApp) {
      import(/* webpackIgnore: true */'/src/dist/HomeApp.js').then(this.renderApp.bind(this));
    } else {
      this.renderApp();
    }
  }

  renderApp(){
    window.HomeApp.startApp(this, this.appNode);
  }
}

window.customElements.define('home-page', HomeCmp);
