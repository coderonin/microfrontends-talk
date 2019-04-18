import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import styles from './styles.less';

export const startApp = (appPublicNode, appTargetNode) => {
  class NavApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { playlists: [] , query:''};
    }
    goTo(path){
      appPublicNode.dispatchEvent(new CustomEvent(
        "navChangeRoute",
        {
          detail: {
            path: path
          },
          bubbles: true,
          cancelable: true
        }
      ));
      this.setState({query: ''});
    }
    handleKeyPress(e) {
      if (e.key === 'Enter' && this.state.query != '') {
        this.goTo(`/search?q=${encodeURIComponent(this.state.query.trim())}`);
      }
    }
    componentDidMount(){
      this.loadData();
    }
    loadData(){
      fetch("/api/userplaylists")
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          this.setState({playlists: data});
        })
        .catch(() => {
          console.log("No data for userplaylist");
        });
    }
    render() {
      return <div>
        <div className="nav-logo nav-underline">
          <span className="icon-headphones"></span>
          <h1>ESpofity</h1>
        </div>
        <div className="nav-item nav-underline">
          <input
            type="text"
            value={this.state.query}
            placeholder="Search"
            onKeyPress={this.handleKeyPress.bind(this)}
            onChange={event => {this.setState({query: event.target.value})}}
          />
          <span className="icon-search"></span>
        </div>
        <div className="nav-item nav-underline">
          <a className="title" onClick={() => {
            this.goTo("/")
          }}>Home</a>
        </div>
        <div className="nav-item">
          <h2  className="title">Favorite Playlists</h2>
        </div>
        {this.state.playlists.map((item, i) => (<div className="nav-item">
          <a onClick={() => this.goTo(`/playlist/${item.id}`)}>{item.name}</a>
        </div>))}
      </div>;
    }
  }

  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.appendChild(document.createTextNode(styles));
  appTargetNode.parentNode.appendChild(styleNode);

  ReactDOM.render(<NavApp /> , appTargetNode);
  retargetEvents(appTargetNode.parentNode);
}