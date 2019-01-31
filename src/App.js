import React, { Component } from 'react';
import'./App.css';
import Tabledata from './tabledata/Tabledata';
import Mapdata from './mapdata/Mapdata';

class App extends Component {

  constructor()
  {
      super()
      this.state={jsonp:[]};
  }


  tableRowClick=(json)=>
    {
        this.setState({jsonp:json})
       //console.log(" app js                    " +json);
    }

  render() {

    
    return (
      <div className="App">
        <Mapdata polyline={this.state.jsonp}/>
        <Tabledata tableRowClickCallBack={this.tableRowClick}/>
      </div>
    );
  }
}

export default App;
