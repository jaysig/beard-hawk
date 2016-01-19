Map = React.createClass({
  render() {
    return (
		  <div>
		    <h1>This is where the map goes</h1>
		    <Sidenav />
		  </div>
		)
  }
})

Sidenav = React.createClass({
  getInitialState(){
  	return {
  		showTooltip: false,
  		tooltipX: "50px",
  		tooltipY: "0px"
  	}
  },
  showTooltip(e){
  	this.setState({
  		showTooltip: true,
  		tooltipY: e.nativeEvent.target.offsetTop +
  			(e.nativeEvent.target.offsetHeight / 2) + "px"
  	})
  },
  hideTooltip(e){
  	this.setState({
  		showTooltip: false
  	})
  },
  render() {
    return (
      <nav className="sidenav">
      	<SidenavTooltip />
        <ul className="sidenav-list">
        	<SidenavIcons />
        </ul>
      </nav>
    )
  }
})

SidenavTooltip = React.createClass({
	render(){
		tooltipStyle = {

		}
		return (
			<div className="sidenav-tooltip" style={tooltipStyle}>
				<p>Data Layer</p>
				<div className="tail"></div>
			</div>
		)
	}
})

SidenavIcons = React.createClass({
	shouldComponentUpdate(nextProps, nextState) {
		return nextProps.id !== this.props.id
	},
	render() {
		let iconList = [
    "fa fa-database",
    "fa fa-user-plus",
    "fa fa-users",
    "fa fa-bicycle",
    "fa fa-list-ul",
    "fa fa-lightbulb-o",
    "fa fa-list-ol",
    "fa fa-line-chart",
    "fa fa-cog"
	  ]
	  let list = iconList.map((item) => {
		  return (
		    <li key={item} className="sidenav-list-item">
		      <i className={item}></i>
		    </li>
			  )
			})
	  return (
	  		<div>
	  			{list}
	  		</div>
	  	)
	}
})