import React, { Component } from 'react';
import BlockComponent from './customTool';

class Block extends BlockComponent {
  constructor(props){
      super(props);
      this.state = {
        data: { },
      }
			this.saveData = this.saveData.bind(this);
  }

	saveData(e){
		if (!e.target.textContent.trim().length) {
      e.target.innerHTML = '';
    }
		this.setState({data: { value: e.target.innerHTML }});
	}

	static get provide(){
    return {
			name: 'Block',
			toolbox: {
				title: 'Block'
			}
    };
  }

  renderEditor(){
    return (
        <div onInput={this.saveData} style={{width: 400, minHeight: 200}} contentEditable />
    );
  }
}

export default Block;
