import React, { Component } from 'react';
import imgRocks from './img/rocks.jpg';
import imgValley from './img/valley.jpg';
import './css/style.css';

// 
function getAlbum(id) {   
    gql.request(`query getAlbum ($albumId: Int! ) {
        album (id: $albumId) {
          id
          title    
        }
      }`, 
{albumId: +id}).then(data => store.dispatch({type: "DATA ALBUM", data}))
}
// 

class SingleAlbum extends Component {



  componentWillMount(){
    getAlbum(this.props.match.params.id);
  }
  render() {
    console.log(this.props)
    return (
      <div className="App wrapp-gallery">
        <div className="container">
          <div className="main-img">
            <div className="main-img_item">
              <img src={imgValley} alt="rocks" />
            </div>
            <div className="nav-btn">
              <div className="nav-item_left">&#60;</div>
              <div className="nav-item_right">&#62;</div>
            </div>
          </div>
          <div className="thumb-img">
            <div className="thumb-img_item">
              <img src={imgValley} alt="valley" />
            </div>
            <div className="thumb-img_item">
              <img src={imgRocks} alt="rocks" />
            </div>
            <div className="thumb-img_item">
              <img src={imgValley} alt="valley" />
            </div>
            <div className="thumb-img_item">
              <img src={imgRocks} alt="rocks" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SingleAlbum;
