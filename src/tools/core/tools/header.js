import React, { Component } from 'react';
import BlockComponent from './customTool';

class Header extends BlockComponent {
  constructor(props){
      super(props);
      this.state = {
        data: {
          value: '',
          level: 1
        }
      }
			this.saveData = this.saveData.bind(this);
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
        <div>
        { this.state.data.level === 1 && <h1 ref={this.mainInput} className="__reacteditor input" onInput={this.saveData} contentEditable html={this.state.data.value} /> }
        { this.state.data.level === 2 && <h2 ref={this.mainInput} className="__reacteditor input" onInput={this.saveData} contentEditable html={this.state.data.value} /> }
        { this.state.data.level === 3 && <h3 ref={this.mainInput} className="__reacteditor input" onInput={this.saveData} contentEditable html={this.state.data.value} /> }
        { this.state.data.level === 4 && <h4 ref={this.mainInput} className="__reacteditor input" onInput={this.saveData} contentEditable html={this.state.data.value} /> }
        { this.state.data.level === 5 && <h5 ref={this.mainInput} className="__reacteditor input" onInput={this.saveData} contentEditable html={this.state.data.value} /> }
        </div>
    );
  }

}

export default Header;
