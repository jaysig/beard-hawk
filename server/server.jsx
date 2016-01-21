// HTTP.get(https://www.dallasopendata.com/resource/ndxz-gccx.json) 





//https://www.dallasopendata.com/resource/4ea4-q4ui.json?$where=within_box(GeoLocation,32.776941,-96.795846)
Meteor.startup(function() {
  if (VoterData.find().count() === 0) {
      var list = HTTP.get("https://www.dallasopendata.com/resource/ndxz-gccx.json", {
    
      }, function(err, res) {
			var keys = _.keys(res.data)

			_.each(res.data, function(item, i) {
			  console.log(item,'item')
			  // var voter = {};
			  // _.each(keys, function(key) {
			  //   console.log(key,'key check')
			  //   voter[key] = res.data[key][i]
			  // })
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
convertToGeoJSON()
if (VoterDataGeoJSON.find().count() === 0) {
  VoterDataGeoJSON.insert({
    "type": "FeatureCollection",
    "features": featureArray
  })
}

Meteor.publish('geojson', function() {
  return VoterDataGeoJSON.find();
})


