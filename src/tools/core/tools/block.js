import React, { Component } from 'react';
import BlockComponent from './customTool';
import keys from '../core/keys';

class Block extends BlockComponent {
  constructor(props){
      super(props);
      this.state = {
        data: {
          value: '',
        },
        prevPos: 15
      }
			this.saveData = this.saveData.bind(this);
  }

	saveData(e){
		if (!e.target.textContent.trim().length) {
      e.target.innerHTML = '';
    }
		this.setState({data: {value: e.target.innerHTML }});
	}

  onBackspace(e){
    if(this.state.data.value === ''){
      e.preventDefault();
      this.selfDestroy();
    }
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
    var ToolSelect = this.props.toolSelect;
    return (
        <div>
          {!this.state.data.value &&<ToolSelect index={this.props.index} addTool={this.props.addTool} destroy={this.selfDestroy} config={this.props.tools}/>}
          <div onKeyDown={this.keyDown} className="block_component" ref={this.mainInput} onInput={this.saveData} style={{width: '100%', minHeight: 25}} contentEditable />
        </div>
    );
  }
}

export default Block;
