import React, { Component } from 'react';

class BlockComponent extends Component {
  constructor(props){
      super(props);
			this.save = this.save.bind(this);
			this.register = this.register.bind(this);
      this.mainInput = React.createRef();
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

	componentWillMount(){
		this.register();
	}

  componentDidMount(){
    if(this.props.focused) this.props.initFocus(this.mainInput);
  }

	componentDidUpdate(prevProps, prevState){
		if(prevState.data !== this.state.data){
			this.save();
		}
    if(prevProps.focused !== this.props.focused) this.setState({focused: this.props.focused});
    if(this.props.focused) this.props.initFocus(this.mainInput);
	}

  renderEditor(){
    return (
        <div onInput={this.saveData} style={{width: 400, minHeight: 200}} contentEditable />
    );
  }

  render() {
    return (
      <div className={`__reacteditor block ${this.state.focused ? 'focused' : ''}`}>
        <div style={{padding: '10px 8%'}}>
        {this.renderEditor()}
        </div>
      </div>
    );
  }

}

export default BlockComponent;
