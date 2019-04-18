const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    text-align: center;
    background: linear-gradient(to left,#1F1C2C, #59546b, #1F1C2C);
    flex: 1;
  }

  #play-list ul{
    padding-inline-start: 0;
    padding: 0;
    text-align: left;
    margin: 12px 6px;
  }

  #play-list ul li{
    overflow: auto;
    padding: 12px 18px 0px;
    background: #0000005e;
    margin-bottom: 6px;
    border-radius: 5px;
  }
  
  #play-list ul li span{
    float: left;
    height: 20px;
    clear: left;
    margin-bottom:6px;
  }

  #play-list ul li span.song-time{
    float:right;
    clear:right;
    margin-top:-12px;
  }

  #play-list ul li span.placeholder{
    width: 200px;
  }

  .placeholder:before {
    content: '';
    display: block;
    border-radius: 5px;
    width :100%;
    height: 8px;
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

  @keyframes RenderAnim { 
    0%{background-position:0% 0%}
    50%{background-position:100% 0%}
    100%{background-position:201% 0%}
  }
</style>
<link rel="stylesheet" href="/src/styles/icons.css" />
<div id="play-list">
  <h1 class="placeholder bold-holder"></h1>
  <ul>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
    <li>
      <span class="placeholder bold-holder"></span>
      <span class="placeholder"></span>
      <span class="placeholder song-time"></span>
    </li>
  </ul>
</div>
`;

class Playlist extends HTMLElement {

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.appNode = this._shadowRoot.getElementById('play-list');
  }
  
  static get observedAttributes() {
    return ['playlist'];
  }

  connectedCallback() {
    if (!window.PlaylistApplication) {
      import('/src/dist/PlaylistApplication.js').then(this.renderApp.bind(this));
    } else {
      this.renderApp();
    }
  }

  renderApp(){
    window.PlaylistApplication.startApp(this._playlist, this, this.appNode);
  }

  attributeChangedCallback(name, oldVal, newVal) {
    this[`_${name}`] = newVal;
  }
}

window.customElements.define('play-list', Playlist);


