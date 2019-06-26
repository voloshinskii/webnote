import React, { Component } from 'react';
import BlockComponent from './customTool';

class Header extends BlockComponent {
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
			name: 'Header',
			toolbox: {
				title: 'Header'
			}
    };
  }

  renderEditor(){
    return (
        <h1 onInput={this.saveData} contentEditable />
    );
  }

}

export default Header;
