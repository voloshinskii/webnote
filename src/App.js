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
    if(!data){
      data = {
          blocks : [
              {
                  type : "header",
                  data : {
                      text : "Hello world!",
                      level : 1
                  }
              },
              {
                  type : "paragraph",
                  data : {
                      text : "Your data available <b>only</b> for you. Enjoy!",
                  }
              },
          ],
          "version" : "2.12.4"
        }
    }
    this.setState({data: data})
  }

  componentDidUpdate(){
    localStorage.setItem('document1', JSON.stringify(this.state.data));
  }

  render(){
    return (
        <div>
          <Editor
                  autofocus
                  holderId="editorjs-container"
                  onChange={(data) => this.setState({data: data})}
                  data={this.state.data}
                />
        </div>
    );
  }
}

export default App;
