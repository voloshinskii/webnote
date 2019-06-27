import React, { Component } from 'react';
import BlockComponent from './customTool';
import keys from '../core/keys';

class Header extends BlockComponent {
  constructor(props){
      super(props);
      this.state = {
        data: {
          value: '',
          level: '1'
        }
      }
			this.saveData = this.saveData.bind(this);
      this.changeLevel = this.changeLevel.bind(this);
  }

  static get provide(){
    return {
      name: 'Header',
      toolbox: {
        title: 'Header'
      }
    };
  }

	saveData(e){
		if (!e.target.textContent.trim().length) {
      e.target.innerHTML = '';
    }
    var value = e.target.innerHTML;
    this.setState(prevState => ({
      data: {
        value: value,
        level: prevState.data.level
      }
    }));
	}

  onBackspace(e){
    if(this.state.data.value === ''){
      e.preventDefault();
      this.selfDestroy();
    }
  }

  changeLevel(e){
    var data = this.state.data;
    data.level = e.target.value;
    this.setState({data});
  }

  renderEditor(){
    return (
        <div>
        <select value={this.state.level} onChange={this.changeLevel}>
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
          <option value={5}>H5</option>
        </select>
        <div onKeyDown={this.keyDown} ref={this.mainInput} className={`__reacteditor input header level--${this.state.data.level}`} onInput={this.saveData} contentEditable html={this.state.data.value} />
        </div>
    );
  }

}

export default Header;
