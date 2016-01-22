Meteor.startup(function(){
  Mapbox.load({
    plugins: ["turf","markercluster","omnivore"]
  });
});

Tracker.autorun(function() {
  //let handle = Meteor.subscribe('geojson') THIS Breaks the icons
  if (Mapbox.loaded()){
    L.mapbox.accessToken = Meteor.settings.public.accessToken;
    map = L.mapbox.map("map", Meteor.settings.public.mapId);
  }
});

let createPrecinctLayer = function() {
  let allDataFeatures = VoterDataGeoJSON.find().fetch()[0].features;
  var stringOfCoords = new Set();
  let uniqueDataFeatures = _.filter(allDataFeatures, function(feature) {
    console.log(feature)
    if (!stringOfCoords.has(feature.geometry.coordinates.toString()) && feature.geometry.coordinates.toString() != "0,0") {
      stringOfCoords.add(feature.geometry.coordinates.toString())
      return feature
    }
  })
  let groupByPrecinct = _.groupBy(uniqueDataFeatures, (feature) => { return feature.properties.precinct_name; })
  let precinctKeys = _.keys(groupByPrecinct);
  let precinctFeatureCollections = [];
  _.each(precinctKeys, (key) => {
    precinctFeatureCollections.push(turf.featurecollection(groupByPrecinct[key]))
  })
  let precinctConcaveHulls = [];
  _.each(precinctFeatureCollections, (precinct) => {
    precinctConcaveHulls.push(turf.convex(precinct, 0.1, 'miles'))
  })
  // console.log(precinctFeatureCollections[4]);
  let precinctFeatureLayer = L.mapbox.featureLayer(precinctConcaveHulls);
  map.addLayer(precinctFeatureLayer);
}

MapChild = React.createClass({
  toggleDataLayer(layerName){
    if(!this.props.loading){
      let allDataLayer = function() {
        let clusterGroup = new L.MarkerClusterGroup();
        let datalayer = L.mapbox.featureLayer().setGeoJSON(this.props.data)
        clusterGroup.addLayer(datalayer)
        map.addLayer(clusterGroup)
      }
    } else {
      alert("Not ready. Retrying in 3 seconds.") //add loading spiner
      setTimeout(()=> {
        this.toggleDataLayer(layerName);
      }, 3000)
    }
   },
  render(){
     if (!this.props.loading) {
      // console.log(L.mapbox.featureLayer().addTo(map))
      var voterLayer = L.mapbox.featureLayer().addTo(map);
      
      voterLayer.on('layeradd', function(e) {
          var marker = e.layer,
              feature = marker.feature;
              console.log(L.icon(feature.properties.icon))
          marker.setIcon(L.icon(feature.properties.icon));
      });
      voterLayer.setGeoJSON(this.props.data);
      console.log(this.props.data)
    }
    return(
        <div>
          <Sidenav 
          toggleDataLayer={this.toggleDataLayer}
          showModal={this.props.showModal} />
          <div className="content-wrapper">
            <Modal 
                showModalState={this.props.showModalState}
                hideModal={this.props.hideModal} />
            <div id="map" className="mapbox"></div>
          </div>
        </div>
      )
  }
})

Map = React.createClass({
  getInitialState(){
    return {
      showModalState: false
    }
  },
  //Declare the type of Modal
  //Set in our Modal Component
  showModal(modalType){
    this.setState({
      showModalState: modalType
    })
  },
  hideModal(e){
    this.setState({
      showModalState: false
    })
  },
  render() {
    return (
      <MeteorData
        subscribe = { () => {
          return Meteor.subscribe('geojson') }}
        fetch = {() => {
          return {data: VoterDataGeoJSON.find().fetch() }}}
        render = { ({loading, data}) => {
          return <MapChild
            showModalState={this.state.showModalState}
            hideModal={this.hideModal}
            showModal={this.showModal}
            loading={loading}
            data={data}
            />  }
        }
        />
    )
  }
})