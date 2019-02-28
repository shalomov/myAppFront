import React, { Component } from 'react';
import './css/homestyle.css';

import {Router, Route, Link, Switch} from "react-router-dom";
import {createStore, combineReducers} from 'redux';
import {Provider, connect}   from 'react-redux';
import { GraphQLClient } from 'graphql-request'
import createHistory from "history/createBrowserHistory";


import './css/style.css';

const gql = new GraphQLClient("http://localhost:4000/graphql", { headers: {} })
const server = "http://localhost";



function getAlbums() {
    store.dispatch({type: 'EMPTY'})
    gql.request(`query getAlbums {
      albums {
        title
        desc
        id
        fileName
      }
    }`).then(data => store.dispatch({type: "DATA ALBUMS", data}))
}

function getAlbum(id) {   
    gql.request(`query getAlbum ($albumId: Int! ) {
        album (id: $albumId) {
          id
          title
          fileName,
          imgs {
            title
            desc
            id
            fileName
          }
        }
      }`, 
  {albumId: +id}).then(data => store.dispatch({type: "DATA ALBUM", data}))
  }

  function getImgs() {
    store.dispatch({type: 'EMPTY'})
    gql.request(`query getImgs {
      imgs {
        title
        desc
        id
        fileName
      }
    }`).then(data => store.dispatch({type: "DATA IMGS", data}))
}
//getAlbum(1)

function albumsReducer(state, action)
{
    if (state === undefined || action.type == 'EMPTY ALBUMS TYPE'){
        return {data: [], status: 'EMPTY ALBUMS STATUS'}
    }
    if (action.type === 'DATA ALBUMS'){
        return {data: action.data.albums, status: 'DATA ALBUMS'}
    }
    return state
}

function imgsReducer(state, action)
{
    if (state === undefined || action.type == 'EMPTY IMGS TYPE'){
        return {data: [], status: 'EMPTY IMGS STATUS'}
    }
    if (action.type === 'DATA IMGS'){
        return {data: action.data.imgs, status: 'DATA IMGS'}
    }
    return state
}

function albumReducer(state, action)
{
    if (state === undefined || action.type == 'EMPTY ALBUM TYPE'){
        return {data: [], status: 'EMPTY ALBUM STATUS'}
    }
    if (action.type === 'DATA ALBUM'){
        console.log(action)
        return {data: action.data.album, status: 'DATA ALBUM'}
    }
    return state
}

const mapStateToProps = function(store) {
    return {
      albums: store.albums,
      album: store.album,
      imgs: store.imgs
    };
  }

const reducers = combineReducers({
    albums: albumsReducer,
    album: albumReducer,
    imgs: imgsReducer
})

var store = createStore(reducers);



class Img extends Component{
    render(){
        return (
            <img src={server + this.props.src} />
        )
    }
}


class AlbumsItem extends Component {
    render() {
       console.log(this.props)
       if (this.props.albums.status == 'EMPTY ALBUMS' ){
           return (<div> empty </div>)
       }
        return (
            <div className="container">
                <div className="items-wrapp">
                    {this.props.albums.data.map(album =>
                        <figure className="folder-item" key={album.id}>
                            <Link to={`/album/${album.id}`} className="folder-link"></Link>
                            <h3 className="folder-title">{album.title}</h3>
                            <div className="foler-img">
                                <img src="/img/rocks.jpg" alt="album img"/>
                            </div>
                            <figcaption className="folder-desc">{album.desc}</figcaption>
                        </figure>
                    )}
                </div>
                
                <div className="add-album clearfix">
                    <a href="#" className="add-album_btn">Add album +</a>
                </div>

            </div>
    );
  }
}

AlbumsItem = connect(mapStateToProps)(AlbumsItem)


  

  let imgPath = "/img/";

    class Gallery extends Component {
        render() {
            console.log(this.props)
            if (this.props.imgs.status == 'EMPTY IMGS' ){
                return (<div> empty </div>)
            }

          return (
            <div className="thumb-img">
                {this.props.imgs.data.map(img =>
                    <div className="thumb-img_item">
                        <img src={imgPath + this.props.album.data.fileName} alt="rocks" />
                    </div>
                    // <div className="thumb-img_item">
                    //     <img src={imgPath + this.props.album.data.fileName} alt="valley" />
                    // </div>
                    // <div className="thumb-img_item">
                    //     <img src={imgPath + this.props.album.data.fileName} alt="rocks" />
                    // </div>
                    // <div className="thumb-img_item">
                    //     <img src={imgPath + this.props.album.data.fileName} alt="valley" />
                    // </div>
                )}
           </div>
          );
        }
      }

      Gallery = connect(mapStateToProps)(Gallery)
  
  class SingleAlbum extends Component {
  
    componentWillMount(){
      getAlbum(this.props.match.params.id);
    }
    render() {
     
      if(this.props.album)
    //   console.log(this.props)
      return (
        <div className="App wrapp-gallery">
         {this.props.album.data.title}
          <div className="container">
            <div className="main-img">
              <div className="main-img_item">
                <img src={imgPath + this.props.album.data.fileName} alt="valley" />
              </div>
              <div className="nav-btn">
                <div className="nav-item_left">&#60;</div>
                <div className="nav-item_right">&#62;</div>
              </div>
            </div>
            <Gallery />
          </div>
        </div>
      );
    }
  }
let AlbumPage = connect(mapStateToProps)(SingleAlbum)


class HomePage extends Component {
    render() {
      return (
        <Provider store={store}>
            <Router history={createHistory()} >
                <Switch>
                    <Route path='/' component={ props => <h1> hello world </h1> } exact = {true }/>
                    <Route path='/albums' component={ AlbumsItem } />
                    {/* <Route path='/' component={ AlbumsItem }  exact = {true }/> */}
                    <Route path='/album/:id' component={ AlbumPage } />
                </Switch>
            </Router>
        </Provider>
    );
  }
}



//HomePage = connect(mapStateToProps)(HomePage)
// getAlbums();
// getAlbum(); // to do

export default HomePage;