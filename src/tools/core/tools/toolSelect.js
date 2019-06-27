import React, { Component } from 'react';
import BlockComponent from './customTool';

class ToolSelect extends BlockComponent {
  constructor(props){
      super(props);
      this.state = {
      }
  }
	render(){
		var conf = Object.values(this.props.config);
		return(
			<div>
			{
				conf.map(item => {
					return(
						<div>
							{ item.config.name !== 'Block' &&
							<button onClick={(e)=> {this.props.addTool(item.config.name, this.props.index); this.props.destroy()}} key={item.config.toolbox.title}>
								{item.config.toolbox.title}
								{console.log(item)}
							</button>
							}
						</div>
					)
				})
			}
			</div>
		)
	}
}

export default ToolSelect;
