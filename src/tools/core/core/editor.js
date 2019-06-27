import React, { Component } from 'react';
import ToolSelect from '../tools/toolSelect';
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
						tool: Block,
            config: Block.provide
					},
					'Header': {
						tool: Header,
            config: Header.provide
					}
				},
        toolSelect: ToolSelect,
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
      this.deleteTool = this.deleteTool.bind(this);
			this.save = this.save.bind(this);
      this.move = this.move.bind(this);
      this.keyDown = this.keyDown.bind(this);
      this.keyUp = this.keyUp.bind(this);
      this.nextSelect = this.nextSelect.bind(this);
      this.prevSelect = this.prevSelect.bind(this);
      this.getIndexById = this.getIndexById.bind(this);
      this.addTool = this.addTool.bind(this);
  }

	componentWillMount(){
		var tools = this.state.tools;
		if(this.props.tools){
      var keys = Object.keys(this.props.tools);
      var arr = Object.values(this.props.tools);
			arr.forEach((tool, index) => {
				var r_tool = this.registerTool(tool, keys[index]);
				tools[r_tool.config.name] = r_tool;
			});
		}
    this.setState({tools: tools});
    if(this.state.data.length === 0) this.addTool('Block');
	}

  getIndexById(id){
    var data = this.state.data;
    return data.findIndex(item =>{
      return item._id === this.state.focusedElement.id;
    });
  }

  initFocus(ref){
    ref.current.focus();
  }

	registerTool(tool, name){
    let data = {};
    if(this.props.config && this.props.config[name]){
      data.config = Object.assign(this.props.config[name], tool.tool.provide);
    }
    else data.config = tool.config;
		data.tool = tool.tool;
		return data;
	}

  toolFocus(id, type){
    var data = this.state.data;
    var index = data.findIndex(item =>{
      return item._id === id;
    });
    var item = {
      id: id,
      index: index
    };
    if(type) item.type = type;
    if(index !== -1){
      this.setState({focusedElement: item})
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
          addTool={ this.addTool }
          { ...tool.config }
          focused={ focused }
          initFocus={ this.initFocus }
          selfDestroy={ this.deleteTool }
          focusNext={this.nextSelect}
          focusPrev={this.prevSelect}
          focusedElement={this.state.focusedElement}
          toolSelect={this.state.toolSelect}
          tools={this.state.tools}
          config={this.state.tools[tool.block].config}
        />
      </div>
    );
	}

  nextSelect(id, to){
    var data = this.state.data;
    var focusedElement = {};
    if(!id) focusedElement = this.state.focusedElement;
    else{
      focusedElement.index = this.getIndexById(id);
    }
    if(!focusedElement) return;
    if(focusedElement.index >= data.length-1) return;
    this.toolFocus(data[focusedElement.index+1]._id, 'next');
    this.setState({data});
  }

  prevSelect(id){
    var data = this.state.data;
    var focusedElement = {};
    if(!id) focusedElement = this.state.focusedElement;
    else{
      focusedElement.index = this.getIndexById(id);
    }
    if(!focusedElement) return;
    if(focusedElement.index === 0) return;
    this.toolFocus(data[focusedElement.index-1]._id, 'prev');
  }

	renderTools(){
		return this.state.data.map((tool, index) => {
			return this.renderTool(tool, index);
		});
	}

	async addTool(name, index, mode){
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
		await this.setState({data: list});
    if( mode !== 'silent') this.toolFocus(toolToPush._id);
    return toolToPush._id;
	}

  deleteTool(id, type){
    var data = this.state.data;
    var index = data.findIndex(item =>{
      return item._id === id;
    });
    data.splice(index, 1);
    var elemBefore = data[index-1];
    if(elemBefore) this.toolFocus(elemBefore._id, type);
    this.setState({data: data});
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
    if(this.state.data.length === 0) this.addTool('Block');
    var focusedElement = this.state.focusedElement;
    if(focusedElement && focusedElement.type){
      delete focusedElement.type;
      this.setState({focusedElement: focusedElement});
    }
	}

  keyUp(e){
    this.keys[e.keyCode] = false;
  }

  keyDown(e){
    this.keys[e.keyCode] = true;
    if(e.keyCode === keys['DELETE']) {
      e.preventDefault();
      if(!this.state.focusedElement) return;
      var data = this.state.data;
      var index = data.findIndex(item =>{
        return item._id === this.state.focusedElement.id;
      });
      data.splice(index, 1);
      this.prevSelect();
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
        </div>
    );
  }
}

export default ReactEditor;
