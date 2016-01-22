Meteor.startup(function() {
  if (VoterData.find().count() === 0) {
      var list = HTTP.get("https://www.dallasopendata.com/resource/ndxz-gccx.json", {
    
      }, function(err, res) {
      var keys = _.keys(res.data)

      _.each(res.data, function(item, i) {
        VoterData.insert({
          record_id: item.record_id,
          contact_type: item.contact_type,
          street: item.street,
          city: item.city,
          state: item.state,
          zipcode: item.zipcode,
          geo_location: item.geo_location,
          long: item.geo_location.longitude,
          lat: item.geo_location.latitude
        });
      })//here
      })
  }
})

var featureArray = [];
convertToGeoJSON = function() {
  _.each(VoterData.find().fetch(), function(voter) {
    featureArray.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [+voter.long, +voter.lat]
      },
      /*this allows for GeoJSON which Map Box Needs*/
      properties: {
        rec_id: voter.record_id,
        contact_type: voter.contact_type,
        street: voter.street,
        city: voter.city,
        state: voter.state,
        zipcode: +voter.zipcode,
        geo_location: voter.geo_location
      }
    })
  })
}

console.log(VoterDataGeoJSON.find().count())
if (VoterDataGeoJSON.find().count() < 1001) {
  convertToGeoJSON()
  VoterDataGeoJSON.insert({
    "type": "FeatureCollection",
    "features": featureArray
  })
  console.log(VoterDataGeoJSON.find().fetch())
}
console.log(featureArray.length,'length')
Meteor.publish('geojson', function() {
  return VoterDataGeoJSON.find();
})
