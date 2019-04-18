const express = require('express');
const fs = require('fs');
const db = require('./db.json');
const routes = express.Router();
const songsMap = {};
db.songs.forEach( song => songsMap[song.id] = song);

const getFullSong = (song) => {
  const newSong = Object.assign({}, song);
  newSong.artist = db.artists[song.artist];
  newSong.album = db.playlists[song.album];
  return newSong;
}

const filterBySearch = (query) => (song) => {
  return (new RegExp(query, 'gi')).test(song.name)
    || (new RegExp(query, 'gi')).test(db.artists[song.artist].name)
    || (new RegExp(query, 'gi')).test(db.playlists[song.album].name)
}

routes.get('/search', (req, res) => {
  const list = db.songs
    .filter(filterBySearch(req.query.q))
    .map(getFullSong);
  return res.status(200).send(list);
});

routes.get('/userplaylists', (req, res) => {
  const list = db.userplaylists.map((id)=> ({ id, name: db.playlists[id].name }));
  return res.status(200).send(list);
});

routes.get('/playlist/:id', (req, res) => {
  const status = !!db.playlists[req.params.id] ? 200 : 404;
  const playlist = Object.assign({}, db.playlists[req.params.id] || {songs:[]});
  if(playlist.artist) {
    playlist.artist = db.artists[playlist.artist];
  }
  playlist.songs = playlist.songs.map( songId => getFullSong(songsMap[songId]));
  return res.status(status).send(playlist);
});

routes.get('/artist/:id', (req, res) => {
  const status = !!db.artists[req.params.id] ? 200 : 404;
  const artist = Object.assign({}, db.artists[req.params.id] || {albums:[]});
  artist.albums = artist.albums.map((id)=> ({ id, name: db.playlists[id].name, desc: db.playlists[id].desc  }));
  return res.status(status).send(artist);
});

routes.get('/stream/:id', (req, res) => {
  const file = __dirname + '/music/'+req.params.id+".mp3";
  const stat = fs.statSync(file);
  const total = stat.size;
  fs.exists(file, (exists) => {
      if (exists) {
          const range = req.headers.range;
          const parts = range.replace(/bytes=/, '').split('-');
          const partialStart = parts[0];
          const partialEnd = parts[1];

          const start = parseInt(partialStart, 10);
          const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
          const chunksize = (end - start) + 1;
          const rstream = fs.createReadStream(file, {start: start, end: end});

          res.writeHead(206, {
              'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
              'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
              'Content-Type': 'application/audio/mpeg'
          });
          rstream.pipe(res);

      } else {
          res.send('Error - 404');
          res.end();
      }
  });
});


module.exports = routes;