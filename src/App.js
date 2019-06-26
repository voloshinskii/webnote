import React, { Component } from 'react';
import './App.css';
import ReactEditor from './tools/core/core/editor'

class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        data: {}
      }
  }

  render(){
    return (
        <div>
          <ReactEditor/>
        </div>
    );
  }
}

export default App;
