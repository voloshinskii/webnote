import React, { Component } from 'react';
import Block from '../tools/block';
import Header from '../tools/header';
import keys from './keys';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BlockDraggable from '../tools/blockDraggable';
const update = require('immutability-helper');

class ReactEditor extends Component {
  constructor(props){
      super(props);
      this.state = {
        data: [],
				tools: {
					'Block': {
						tool: Block
					},
					'Header': {
						tool: Header
					}
				}
      }

			var tools = {};
			if(this.props.tools) tools = this.props.tools;

			this.state.tools = Object.assign(tools, this.state.tools);
			this.registerTool = this.registerTool.bind(this);
			this.renderTool = this.renderTool.bind(this);
			this.renderTools = this.renderTools.bind(this);
			this.save = this.save.bind(this);
      this.move = this.move.bind(this);
  }

	componentWillMount(){
		var tools = this.state.tools;
		if(this.props.tools){
			this.props.tools.forEach(tool => {
				var r_tool = this.registerTool(tool);
				tools[r_tool.config.name] = r_tool;
				this.setState({tools: tools});
			});
		}
	}

	registerTool(tool){
		let data = {};
		data.config = tool.config || tool.tool.provide;
		data.tool = tool.tool;
		return data;
	}

	renderTool(tool, index){
		var ToolComponent = tool.tool;
		return (
      <BlockDraggable
        Block={ToolComponent}
        key={ tool._id }
        _id={ tool._id }
        save={ this.save }
        move={ this.move }
        index={ index }
        { ...tool.config }
      />);
	}

	renderTools(){
		return this.state.data.map((tool, index) => {
			return this.renderTool(tool, index);
		});
	}

	addTool(name){
		var list = this.state.data;

		var toolToPush = {
			tool: this.state.tools[name].tool,
			block: name,
			data: {},
			_id: (Date.now().toString(36) + Math.random().toString(36).substr(2, 11)).toLowerCase()
		};
		list.push(toolToPush);
		this.setState({data: list});
	}

	save(data, id){
		var curData = this.state.data;
		curData.forEach((item, index) => {
			if (item._id === id) curData[index].data = data;
		});
		this.setState({data: curData});
	}

	componentDidUpdate(){
		console.log(this.state);
	}

  keyDown(e){
    if(e.keyCode === keys['DELETE']) {
      console.log(e.keyCode);
      console.log(window);
    }
  }

  move(dragIndex, hoverIndex){
   const { data } = this.state
   const drag = data[dragIndex]

   this.setState(
     update(this.state, {
       data: {
         $splice: [[dragIndex, 1], [hoverIndex, 0, drag]],
       },
     }),
   )
 }

  render(){
    return (
        <DndProvider backend={HTML5Backend}>
  				<div style={{margin: '0 10%'}} onKeyDown={this.keyDown}>
          	{this.renderTools()}
  					<button onClick={()=> this.addTool('Block')} >Add block</button>
  					<button onClick={()=> this.addTool('Header')} >Add header</button>
  				</div>
        </DndProvider>
    );
  }
}

export default ReactEditor;
