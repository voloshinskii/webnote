import React, { Component } from 'react';

class BlockComponent extends Component {
  constructor(props){
      super(props);
      this.state = {
        data: {},
      }
			this.save = this.save.bind(this);
			this.register = this.register.bind(this);
  }

	register(){
		if(this.props.data) this.setState({data: this.props.data});
	}

	static get provide(){
    return {
			name: 'Custom Tool',
			toolbox: {
				title: 'Custom Tool'
			}
    };
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

	componentDidUpdate(prevProps, prevState){
		if(prevState !== this.state){
			this.save();
		}
	}

  renderEditor(){
    return (
        <div onInput={this.saveData} style={{width: 400, minHeight: 200}} contentEditable />
    );
  }

  render() {

    return (
      <div ref={this.state.ref}>
        {this.renderEditor()}
      </div>
    );
  }

}

export default BlockComponent;
