import React from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import styles from './styles.less';

export const startApp = (appPublicNode, appTargetNode) => {
  const CATEGORIES = {
    OVERVIEW: {
      label: 'Overview',
      active: true,
      ref: 'overview'
    },
    FEATURED: {
      label: 'Featured',
      active: false,
      ref: 'featured'
    },
    NEWRELEASES: {
      label: 'New Releases',
      active: false,
      ref: 'newrelease'
    },
    DISCOVER: {
      label: 'Discover',
      active: false,
      ref: 'discover'
    },
  }
  class HomeApp extends React.Component {
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
      fetch('/api/top/')
        .then((resp) => {
          return resp.json();
        })
        .then((data) => {
          this.setState({data, loading: false});
        })
        .catch((e) => {
          console.log(e);
          console.log('No data for home');
        });
    }

    render(){
      return this.state.loading?
        this.renderEmpty() :
        this.renderData();
    }

    renderEmpty() {
      return (<div>
        <nav id="top-home-nav">
          <ul>
            <li className="placeholder"></li>
            <li className="placeholder"></li>
            <li className="placeholder"></li>
            <li className="placeholder"></li>
          </ul>
        </nav>
        <h1 className="placeholder bold-holder"></h1>
        <section className="sample-artists">
          <div className="placeholder box"></div>
          <div className="placeholder box"></div>
          <div className="placeholder box"></div>
          <div className="placeholder box"></div>
          <div className="placeholder box"></div>
          <div className="placeholder box"></div>
        </section>
      </div>);
    }

    renderData() {
      return (<div>
        <nav id="top-home-nav">
          <ul>
            {this.getMenu()}
          </ul>
        </nav>
        {this.getSections()}
      </div>);
    }

    getMenu(){
      const {
        data
      } = this.state;
      return Object.keys(data).map(
        (key) => <li
          className={CATEGORIES[key].active? 'active': ''}
          onClick={() => this.scrollToRef(CATEGORIES[key].ref)}
        >{CATEGORIES[key].label}</li>);
    }

    getSections() {
      const {
        data
      } = this.state;
      return Object.keys(data).map(
        (key) => {
          return (<div>
            <h1 ref={CATEGORIES[key].ref} className="section-title bold-holder">{CATEGORIES[key].label}</h1>
            <section className="sample-artists">
              {data[key].map((artist) => (<div className="box" onClick={() => this.goTo(`/artist/${artist.id}`)}>
                <img src={artist.img} />
                <span>{artist.name}</span>
              </div>))}
            </section>
          </div>);
        });
    }

    scrollToRef(ref) {
      appPublicNode.scrollTo(60, this.refs[ref].offsetTop-40);
    }
  }

  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.appendChild(document.createTextNode(styles));
  appTargetNode.parentNode.appendChild(styleNode);

  ReactDOM.render(<HomeApp /> , appTargetNode);
  retargetEvents(appTargetNode.parentNode);
}