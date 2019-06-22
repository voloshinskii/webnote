import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Editor from '@todokek/react-editor.js'

class App extends Component {
  constructor(props){
      super(props);
      this.state = {
        data: {}
      }
  }

  componentWillMount(){
    var data = localStorage.getItem('document1');
    data = JSON.parse(data);
    this.setState({data: data})
  }

  componentDidUpdate(){
    localStorage.setItem('document1', JSON.stringify(this.state.data));

  }

  render(){
    return (
        <Editor
                autofocus
                holderId="editorjs-container"
                onChange={(data) => this.setState({data: data})}
                data={this.state.data}
              />
    );
  }
}

export default App;
