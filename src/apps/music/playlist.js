import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import styles from './playlist.less';

export const startApp = (playlistid, appPublicNode, appTargetNode) => {
  class PlaylistApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { playlist: [] , loading: true, isRunning: false};
      this._handleStop = this.handleStop.bind(this);
      this._handleStart = this.handleStart.bind(this);
    }

    tooglePlaylist(){
      const {
        playlist,
        isRunning
      } = this.state;
      appPublicNode.dispatchEvent(new CustomEvent(
        `${isRunning?'pause':'play'}Song`,
        {
          detail: { 
            playlist,
            track: 0
          },
          bubbles: true,
          cancelable: true
        }
      ));
    }

    handleStop(e){
      const {
        songId,
        track
      } = e.detail;
      let isRunning = false;
      this.state.playlist.songs.forEach((val, i) => {
        if(val.id == songId && track == i) val.active = false;
        if(val.active) isRunning = true;
      });
      this.setState({ playlist: this.state.playlist, isRunning });
    }

    handleStart(e){
      const {
        playlistId,
        songId,
        track
      } = e.detail;
      if (playlistId != this.state.playlist.id) return;
      this.state.playlist.songs.forEach((val, i) => val.active = val.id == songId && track == i);
      this.setState({ playlist: this.state.playlist, isRunning: true });
    }

    toogleSong(i){
      const {
        playlist
      } = this.state;
      const song = playlist.songs[i];
      if(!song.active) {
        appPublicNode.dispatchEvent(new CustomEvent(
          "playSong",
          {
            detail: { 
              playlist,
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
        this.setState({ playlist });
      }
    }

    goToArtistPage(id) {
      appPublicNode.dispatchEvent(new CustomEvent(
        "navChangeRoute",
        {
          detail: {
            path: `/artist/${id}`
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

    loadData(){
      fetch(`/api/playlist/${playlistid}`)
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          this.setState({playlist: data, loading: false});
        })
        .catch((e) => {
          console.log(e);
          console.log(`No data for playlist ${playlistid}`);
        });
    }

    render() {
      return this.state.loading ?
        this.renderLoading() :
        this.renderData();
    }

    renderLoading(){
      return <div>
      <h1 className="placeholder bold-holder"></h1>
        <ul>
          <li>
            <span className="placeholder bold-holder"></span>
            <span className="placeholder"></span>
            <span className="placeholder song-time"></span>
          </li>
          <li>
            <span className="placeholder bold-holder"></span>
            <span className="placeholder"></span>
            <span className="placeholder song-time"></span>
          </li>
          <li>
            <span className="placeholder bold-holder"></span>
            <span className="placeholder"></span>
            <span className="placeholder song-time"></span>
          </li>
          <li>
            <span className="placeholder bold-holder"></span>
            <span className="placeholder"></span>
            <span className="placeholder song-time"></span>
          </li>
          <li>
            <span className="placeholder bold-holder"></span>
            <span className="placeholder"></span>
            <span className="placeholder song-time"></span>
          </li>
          <li>
            <span className="placeholder bold-holder"></span>
            <span className="placeholder"></span>
            <span className="placeholder song-time"></span>
          </li>
        </ul>
      </div>
    }

    renderData(){
      const {
        isRunning,
        playlist
      } = this.state;
      return (<div>
        <h1 className="title">{playlist.name}</h1>
        {!!playlist.artist && (<h2>by <a onClick={()=>this.goToArtistPage(playlist.artist.id)} className="artist-link">{playlist.artist.name}</a></h2>)}
        <p className="description">
          {playlist.desc}
        </p>
        <button className="playlist-btn" onClick={() => this.tooglePlaylist()}>
          <span className={`icon-${isRunning? 'volume-high':'play'}`}></span>
          {isRunning? 'pause':'play all'}
        </button>
        <ul>
        {playlist.songs.map((song, i) => (
          <li className={`song${song.active? ' active': ''}`}>
            <a className={`action-btn${song.active? ' active': ''}`} onClick={() => this.toogleSong(i)}>
              <span className={song.active? 'icon-pause': 'icon-play'}></span>
            </a>
            <span className="song-name">{song.name}</span>
            <span className="song-desc">{song.artist.name} - {song.album.name}</span>
            <span className="song-time">{song.duration}</span>
          </li>
        ))}
        </ul>
      </div>)
    }
  }

  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.appendChild(document.createTextNode(styles));
  appTargetNode.parentNode.appendChild(styleNode);

  ReactDOM.render(<PlaylistApp /> , appTargetNode);
  retargetEvents(appTargetNode.parentNode);
}