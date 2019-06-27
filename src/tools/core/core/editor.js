import React, { Component } from 'react';
import Block from '../tools/block';
import Header from '../tools/header';
import keys from './keys';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import BlockDraggable from '../tools/blockDraggable';
import ReactDOM from 'react-dom';
import '../styles/editor.css'

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

      this.keys = {};
			this.state.tools = Object.assign(tools, this.state.tools);
      this.toolFocus = this.toolFocus.bind(this);
      this.toolUnFocus = this.toolUnFocus.bind(this);
			this.registerTool = this.registerTool.bind(this);
			this.renderTool = this.renderTool.bind(this);
			this.renderTools = this.renderTools.bind(this);
			this.save = this.save.bind(this);
      this.move = this.move.bind(this);
      this.keyDown = this.keyDown.bind(this);
      this.keyUp = this.keyUp.bind(this);
      this.nextSelect = this.nextSelect.bind(this);
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

  initFocus(ref){
    ref.current.focus();
  }

	registerTool(tool){
		let data = {};
		data.config = tool.config || tool.tool.provide;
		data.tool = tool.tool;
		return data;
	}

  toolFocus(id){
    var data = this.state.data;
    var index = data.findIndex(item =>{
      return item._id === id;
    });
    if(index !== -1){
      this.setState({focusedElement: {id: id, index: index}})
    }
    else this.setState({focusedElement: undefined});
  }

  toolUnFocus(e){
    this.setState({focusedElement: undefined})
  }

	renderTool(tool, index){
		var ToolComponent = tool.tool;
    var focused = false;
    if(this.state.focusedElement && this.state.focusedElement.index === index) focused = true;
		return (
      <div
        key={ tool._id }
        onBlur={this.toolUnFocus}
        onFocus={(e) => this.toolFocus(tool._id)}
      >
        <BlockDraggable
          Block={ToolComponent}
          key={ tool._id }
          _id={ tool._id }
          save={ this.save }
          move={ this.move }
          index={ index }
          { ...tool.config }
          focused={ focused }
          initFocus={ this.initFocus }
        />
      </div>
    );
	}

  nextSelect(){
    var data = this.state.data;
    var focusedElement = this.state.focusedElement;
    if(!focusedElement) return;
    if(focusedElement.index >= data.length-1) return;
    this.toolFocus(data[focusedElement.index+1]._id);
  }

	renderTools(){
		return this.state.data.map((tool, index) => {
			return this.renderTool(tool, index);
		});
	}

	addTool(name, index){
		var list = this.state.data;

		var toolToPush = {
			tool: this.state.tools[name].tool,
			block: name,
			data: {},
			_id: (Date.now().toString(36) + Math.random().toString(36).substr(2, 11)).toLowerCase(),
      tabindex: list.length
		};

    if(index === undefined || index === -1) list.push(toolToPush);
    else list.splice(index+1, 0, toolToPush);

		this.setState({data: list});
    return toolToPush._id;
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

  keyUp(e){
    this.keys[e.keyCode] = false;
  }

  keyDown(e){
    this.keys[e.keyCode] = true;

    if(e.keyCode === keys['DELETE']) {
      if(!this.state.focusedElement) return;
      var data = this.state.data;
      var index = data.findIndex(item =>{
        return item._id === this.state.focusedElement.id;
      });
      data.splice(index, 1);
      var elemBefore = data[index-1];
      if(elemBefore) this.toolFocus(elemBefore._id);
      this.setState({data: data});
    }

    if(e.keyCode === keys['ENTER']) {
      e.preventDefault();
      var index;
      if(this.state.focusedElement) index = this.state.focusedElement.index;
      else index = -1;
      var id = this.addTool('Block', index);
      this.nextSelect();
    }
  }

  move(result){
    const { destination, source, draggableId } = result;
    if(!destination) return;
    if(
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ){
        return;
    }
    var workspace = this.state.data;
    var sourceData = workspace[source.index];
    workspace.splice(source.index, 1);
    workspace.splice(destination.index, 0, sourceData);
    this.setState({data: workspace});
    this.toolFocus(draggableId);
  }

  render(){
    return (
        <div className="__reacteditor core mini" onKeyDown={this.keyDown} onKeyUp={this.keyUp}>
          <DragDropContext onDragEnd={this.move}>
            <Droppable droppableId="workspace">
              {provided=> (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{marginBottom: '200px'}}
                >
                {this.renderTools()}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button onClick={()=> this.addTool('Block')} >Add block</button>
          <button onClick={()=> this.addTool('Header')} >Add header</button>
        </div>
    );
  }
}

export default ReactEditor;
