const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    text-align: center;
  }
</style>
<link rel="stylesheet" href="/src/styles/icons.css" />
<div id="player-app"></div>
`;

class PlayerCmp extends HTMLElement {

  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ 'mode': 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
    this.appNode = this._shadowRoot.getElementById('player-app');
    this._handlePlay = this.handleFirstPlay.bind(this)
  }

  connectedCallback(){
    document.addEventListener("playSong", this._handlePlay);
  }

  handleFirstPlay(e) {
    document.removeEventListener("playSong", this._handlePlay);
    this._playlist = e.detail.playlist;
    this._track = e.detail.track;
    this.loadApp();
  }

  loadApp() {
    if (!window.MusicPlayerApp) {
      import('/src/dist/MusicPlayerApp.js').then(this.renderApp.bind(this));
    } else {
      this.renderApp();
    }
  }

  renderApp(){
    window.MusicPlayerApp.startApp(this._playlist, this._track, this, this.appNode);
  }
}

window.customElements.define('music-player', PlayerCmp);