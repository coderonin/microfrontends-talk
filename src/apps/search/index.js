import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import styles from './styles.less';

export const startApp = (appPublicNode, appTargetNode, query) => {

  class SearchApp extends React.Component {

    constructor(props) {
      super(props);
      this.playlistId = `PLAYLIST_SEARCH_${query}`;
      this.state = { results: [], loading: true };
      this._handleStop = this.handleStop.bind(this);
      this._handleStart = this.handleStart.bind(this);
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
      document.addEventListener("songStopPlaying", this._handleStop);
      document.addEventListener("songStartPlaying", this._handleStart);
    }

    componentWillUnmount(){
        document.removeEventListener("songStopPlaying", this._handleStop);
        document.removeEventListener("songStartPlaying", this._handleStart);
    }

    handleStop(e){
      const {
        songId,
        track
      } = e.detail;
      this.state.results.forEach((val, i) => {
        if(val.id == songId && track == i) val.active = false;
      });
      this.setState({ results: this.state.results });
    }

    handleStart(e){
      const {
        playlistId,
        songId,
        track
      } = e.detail;
      if (playlistId != this.playlistId) return;
      this.state.results.forEach((val, i) => val.active = val.id == songId && track == i);
      this.setState({ results: this.state.results });
    }

    toogleSong(i){
      const {
        results
      } = this.state;
      const song = results[i];
      if(!song.active) {
        appPublicNode.dispatchEvent(new CustomEvent(
          "playSong",
          {
            detail: { 
              playlist: {
                id: this.playlistId,
                songs: results,
              },
              track: i
            },
            bubbles: true,
            cancelable: true
          }
        ));
      } else {
        song.active = false;
        appPublicNode.dispatchEvent(new CustomEvent(
          "pauseSong",
          {
            bubbles: true,
            cancelable: true
          }
        ));
        this.setState({ results });
      }
    }

    loadData(){
      fetch(`/api/search?${query}`)
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          this.setState({results: data, loading: false });
        })
        .catch((e) => {
          console.log(e);
          console.log(`No data for search ${query}`);
        });
    }

    render(){
      return this.state.loading?
        this.renderEmpty() :
        this.renderData();
    }

    renderEmpty(){
      return <div>
        <h1 className="placeholder bold-holder"></h1>
        <ul>
          {[0,1,2,3,4,5,6,7,8,9].forEach( () => (<li>
            <span className="placeholder bold-holder"></span>
            <span className="placeholder"></span>
            <span className="placeholder"></span>
            <span className="placeholder song-time"></span>
          </li>))}
        </ul>
      </div>;
    }

    renderData(){
      return <div>
        <h1 className="title">Search for "{decodeURIComponent(query).substr(2)}"</h1>
        <p className="description">This are the results for your search (song title, album name or artist name)</p>
        <ul>
          {this.state.results.map((song, i) => (<li className="song">
            <a className={`action-btn${song.active? ' active': ''}`} onClick={() => this.toogleSong(i)}>
              <span className={song.active? 'icon-pause': 'icon-play'}></span>
            </a>
            <span className="song-name">{song.name}</span>
            <span className="song-desc"><a onClick={() => this.goTo(`/artist/${song.artist.id}`)}>{song.artist.name}</a> - <a onClick={() => this.goTo(`/playlist/${song.album.id}`)}>{song.album.name}</a></span>
            <span className="song-time">{song.duration}</span>
          </li>))}
        </ul>
      </div>
    }
  }

  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.appendChild(document.createTextNode(styles));
  appTargetNode.parentNode.appendChild(styleNode);

  ReactDOM.render(<SearchApp /> , appTargetNode);
  retargetEvents(appTargetNode.parentNode);
}