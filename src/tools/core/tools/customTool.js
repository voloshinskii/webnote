import React, { Component } from 'react';
import keys from '../core/keys';

class BlockComponent extends Component {
  constructor(props){
      super(props);
			this.save = this.save.bind(this);
			this.register = this.register.bind(this);
      this.selfDestroy = this.selfDestroy.bind(this);
      this.mainInput = React.createRef();
      this.__keyDown = this.__keyDown.bind(this);
      this.focusNextBlock = this.focusNextBlock.bind(this);
      this.focusPrevBlock = this.focusPrevBlock.bind(this);
      this.onArrowUpInput = this.onArrowUpInput.bind(this);
      this.onArrowDownInput = this.onArrowDownInput.bind(this);
      this.keyDown = this.keyDown.bind(this);
  }

  static get initData(){
    return {value: ''};
  }

  static get provide(){
    return {
      name: 'Custom Tool',
      toolbox: {
        title: 'Custom Tool'
      }
    };
  }

	async register(){
    var data;
    if(this.props.data) data = Object.assign(this.props.data, this.state.data);
    else data = this.state.data;
		this.setState({data: data});
	}

	save() {
		var data = this.state.data;
		setTimeout(() => {
			if (this.state.data === data){
				this.props.save(data, this.props._id);
			}
		}, 1000);
	}

  moveCursorToEnd(el) {
    var value;
    if(el.value) value = el.value.length;
    else value= el.innerHTML.length;
    console.log(value);
    if (typeof el.selectionStart == "number") {
        el.selectionStart = el.selectionEnd = value;
    }
    else {
      var range = document.createRange();
      var sel = window.getSelection();
      var lastChild = el.childNodes[el.childNodes.length-1];
      if(lastChild){
        range.setStart(lastChild, lastChild.length);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
}

  getCaretPosition(editableDiv) {
    var caretPos = 0,
      sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.parentNode === editableDiv) {
          caretPos = range.endOffset;
        }
      }
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      if (range.parentElement() === editableDiv) {
        var tempEl = document.createElement("span");
        editableDiv.insertBefore(tempEl, editableDiv.firstChild);
        var tempRange = range.duplicate();
        tempRange.moveToElementText(tempEl);
        tempRange.setEndPoint("EndToEnd", range);
        caretPos = tempRange.text.length;
      }
    }
    return caretPos;
  }

  onBackspace(e){
    return;
  }

  onArrowUp(e){
    return;
  }

  onArrowDown(e){
    return;
  }

  onArrowUpInput(e){
    var pos = this.getCaretPosition(e.target);
    if(pos === 0){
      this.focusPrevBlock();
      e.preventDefault();
    }
  }

  onArrowDownInput(e){
    var pos = this.getCaretPosition(e.target);
    if(pos === this.state.data.value.length){
      this.focusNextBlock('end');
      e.preventDefault();
    }
  }

  keyDown(e){
    if(e.keyCode === keys['ARR_UP']) {
      this.onArrowUpInput(e);
    }
    if(e.keyCode === keys['ARR_DOWN']) {
      this.onArrowDownInput(e);
    }
  }

  __keyDown(e){
    if(e.keyCode === keys['BACKSPACE']) {
      this.onBackspace(e);
    }
    else if(e.keyCode === keys['ARR_UP']) {
      this.onArrowUp(e);
    }
    else if(e.keyCode === keys['ARR_DOWN']) {
      this.onArrowDown(e);
    }
  }

  focusNextBlock(to){
    this.props.focusNext(this.props._id, to);
  }

  focusPrevBlock(){
    this.props.focusPrev(this.props._id);
  }

	componentWillMount(){
		this.register();
	}

  componentDidMount(){
    if(this.props.focused) this.props.initFocus(this.mainInput);
  }

  selfDestroy(){
    this.props.selfDestroy(this.props._id, 'prev');
  }

	componentDidUpdate(prevProps, prevState){
		if(prevState.data !== this.state.data){
			this.save();
		}
    if(prevProps.focused !== this.props.focused) this.setState({focused: this.props.focused});
    if(this.props.focused) this.props.initFocus(this.mainInput);
    if(
      this.props.focused &&
      this.props.focusedElement &&
      this.props.focusedElement.type === 'prev'
    ) this.moveCursorToEnd(this.mainInput.current);
	}

  renderEditor(){
    return (
        <div onInput={this.saveData} style={{width: 400, minHeight: 200}} contentEditable />
    );
  }

  render() {
    return (
      <div onKeyDown={this.__keyDown} className={`__reacteditor block ${this.state.focused ? 'focused' : ''}`}>
        <div>
        {this.renderEditor()}
        </div>
      </div>
    );
  }

}

export default BlockComponent;
