import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import styles from './styles.less';

export const startApp = (artistId, appPublicNode, appTargetNode) => {
  class ArtistApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { artist: {}, loading: true };
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
    }

    componentDidMount(){
      this.loadData();
    }

    loadData(){
      fetch(`/api/artist/${artistId}`)
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          this.setState({artist: data, loading: false});
        })
        .catch((e) => {
          console.log(e);
          console.log(`No data for artist ${artistId}`);
        });
    }

    render(){
      return this.state.loading?
        this.renderEmpty() :
        this.renderData();
    }

    renderEmpty() {
      return (<div>
        <div className="artist-pic"></div>
        <div className="artist-description">
          <h1 className="placeholder bold-holder"></h1>
          <div className="placeholder"></div>
          <div className="placeholder"></div>
          <div className="placeholder"></div>
        </div>
      </div>);
    }

    renderData() {
      const {
        img,
        name,
        description,
      } = this.state.artist;
      return (<div>
        <div className="artist-pic">
          <img src={img} name="artist_img"/>
        </div>
        <div className="artist-description">
          <h1 className="artist-name">{name}</h1>
          <p>{description}</p>
        </div>
        {this.getAlbums()}
      </div>);
    }

    getAlbums(){
      return !this.state.artist.albums.length ? '' :
        (<div className="artist-albums">
          <h1>Albums</h1>
          {this.state.artist.albums.map((album, i) => (
            <a className="album" onClick={() => this.goTo(`/artist/${artistId}/playlist/${album.id}`)}>
              <span className="album-name">{album.name} - {album.date}</span>
              <span className="album-desc">{album.desc}</span>
              <span className="album-count">Songs: {album.count}</span>
          </a>))}
        </div>);
    }
  }

  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.appendChild(document.createTextNode(styles));
  appTargetNode.parentNode.appendChild(styleNode);

  ReactDOM.render(<ArtistApp /> , appTargetNode);
  retargetEvents(appTargetNode.parentNode);
}