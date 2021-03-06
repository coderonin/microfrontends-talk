const getParams = () => window.location.pathname.substr(1).split("/")[1];
const cleanPath = (path) => "/" + (path.substr(1).split("/")[0]);

const getSubRoute = () => window.location.pathname.substr(1).split("/")[2];
const getSubRouteParams = () => window.location.pathname.substr(1).split("/")[3];

const routes = {
  '/' : () => '<home-page></home-page>',
  '/search' : () => {
    const query = window.location.search.substr(1);
    return `<search-page query-string="${query}"></search-page>`;
  },
  '/artist' : () => {
    const artistId = getParams();
    let html = `<artist-page artist="${artistId}"></artist-page>`;
    if (getSubRoute() == 'playlist') {
      html += `<play-list playlist="${getSubRouteParams()}"></play-list>`
    }
    return html;
  },
  '/playlist' : () => {
    const playlistId = getParams();
    return `<play-list playlist="${playlistId}"></play-list>`;
  }
};

const contentDiv = document.getElementById('content');
const loadRoute = () => {
  contentDiv.innerHTML = routes[cleanPath(window.location.pathname)]();
};
loadRoute();

document.addEventListener('navChangeRoute', (e) => {
  window.history.pushState(
    {}, 
    e.detail.path,
    window.location.origin + e.detail.path
  );
  loadRoute();
});

window.onpopstate = () => {
  loadRoute();
};