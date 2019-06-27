import React, { Component } from 'react';
import './App.css';
import ReactEditor from './tools/core/core/editor'

class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        data: {}
      }
      this.updateData = this.updateData.bind(this);
  }

  updateData(){

  }

  render(){
    return (
        <div style={{padding: '0 5%'}}>
          <ReactEditor
            onUpdate={this.updateData}
          />
        </div>
    );
  }
}

export default App;
