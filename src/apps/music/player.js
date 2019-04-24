import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import styles from './player.less';

export const startApp = (playlist, track, appPublicNode, appTargetNode) => {
  const sendEvent = (evName, detail) => appPublicNode.dispatchEvent(new CustomEvent(
    evName,
    {
      detail,
      bubbles: true,
      cancelable: true
    }
  ));

  class MusicPlayerApp extends React.Component {
    constructor(props) {
      super(props);
      this.state = { playlist: props.playlist, currentTrack: props.track, running: false };
      this._handlePlay = this.handleOutsidePlay.bind(this);
      this._handlePause = this.handleOutsidePause.bind(this);
    }

    handleOutsidePlay(e){
      const {
        playlist,
        track
      } = e.detail;
      this.playSong(playlist, track);
      this.setState({ playlist, currentTrack: track, running: true });
    }

    playSong(playlistNew, track){
      const {
        playlist,
        currentTrack
      } = this.state;
      if(this._player) {
        clearInterval(this.currentTimeInterval);
        this._player.pause();
      }
      if(!this._player || playlistNew.songs[track].id != playlist.songs[currentTrack].id || playlistNew.id != playlist.id) {
        this.slider.value = 0;
        this._player = new Audio(`/api/stream/${playlistNew.songs[track].id}`);
        this._player.songId = playlistNew.songs[track].id
        this._player.track = track;
      }
      this._player.play();
      sendEvent("songStartPlaying", { 
        playlistId: playlistNew.id,
        songId: playlistNew.songs[track].id,
        track
       });
      this.setControls();
    }

    handleOutsidePause(e){
      this._player.pause();
      this.setState({running: false });
    }

    checkNextInPlaylist(){
      let {
        currentTrack,
      } = this.state;
      currentTrack++;
      if (!this.state.playlist.songs[currentTrack]) return;
      this.playSong(this.state.playlist, currentTrack);
      this.setState({currentTrack, running: true});
    }

    componentDidMount(){
      document.addEventListener("playSong", this._handlePlay);
      document.addEventListener("pauseSong", this._handlePause);
      document.addEventListener("startPlaylist", this._handleStartPlaylist);
      document.addEventListener("stopPlaylist", this._handlePausePlaylist);
      this.playSong(this.state.playlist, this.state.currentTrack);
      this.setState({running: true});
    }

    componentWillUnmount(){
      document.removeEventListener("playSong", this._handlePlay);
      document.removeEventListener("pauseSong", this._handlePause);
      document.removeEventListener("startPlaylist", this._handleStartPlaylist);
      document.removeEventListener("stopPlaylist", this._handlePausePlaylist);
    }

    setControls(){
      this.currentTimeInterval = null;

      const startInterval = () => {
        this.currentTimeInterval = setInterval( () => {
          this.slider.value = this._player.currentTime;
        }, 500);
      }
      
      // Get duration of the song and set it as max slider value
      this._player.onloadedmetadata = function() {
        this.setState({duration: this._player.duration});
      }.bind(this);
      
      // Sync slider position with song current time
      this._player.onplay = () => {
        startInterval();
      };
      
      this._player.onpause = ((_player, playlistId) => () => {
        clearInterval(this.currentTimeInterval);
        sendEvent("songStopPlaying", { 
          playlistId: playlistId,
          songId: _player.songId,
          track: _player.track
         });
        if (_player.currentTime == _player.duration) {
          this.checkNextInPlaylist();
        }
      })(this._player, this.state.playlist.id);
      
      // Seek functionality
      this.slider.onchange = (e) => {
        this._player.currentTime = e.target.value;
        startInterval();
      };

      this.slider.oninput = () => {
        clearInterval(this.currentTimeInterval);
      }
    }

    clickActionBtn(){
      const {
        running,
        playlist,
        currentTrack
      } = this.state;
      if(running) {
        this.handleOutsidePause();
      } else {
        this.playSong(playlist, currentTrack)
        this.setState({running: true})
      }
    }

    render() {
      const {
        playlist,
        currentTrack,
        running
      } = this.state;
      const song = playlist.songs[currentTrack];
      return (<div className="player-container">
        <div className="song-data">
          <span className="song-name">{song.name}</span>
          <span className="song-desc">{song.album.name}, by {song.artist.name}</span>
        </div>
        <div className="main-controls">
          <a onClick={() => this.clickActionBtn()}><span className={`icon-${running? 'pause':'play'}`}></span></a>
        </div>
        <input ref={(slider) => { this.slider = slider }} type="range" min="0" max={this.state.duration}/>
      </div>)
    }
  }

  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.appendChild(document.createTextNode(styles));
  appTargetNode.parentNode.appendChild(styleNode);

  ReactDOM.render(<MusicPlayerApp playlist={playlist} track={track}/> , appTargetNode);
  retargetEvents(appTargetNode.parentNode);
}