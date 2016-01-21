App = React.createClass({
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
})

MeteorData = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData(){
		const sub = this.props.subscribe()
		const data = this.props.fetch()
		data.loading = !sub.ready()
		return data;
	},
	render(){
		return this.props.render(this.data)
	}
})