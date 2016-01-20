// HTTP.get(https://www.dallasopendata.com/resource/ndxz-gccx.json) 





//https://www.dallasopendata.com/resource/4ea4-q4ui.json?$where=within_box(GeoLocation,32.776941,-96.795846)
Meteor.startup(function() {
  if (VoterData.find().count() === 0) {
      var list = HTTP.get("https://www.dallasopendata.com/resource/ndxz-gccx.json", {
    
      }, function(err, res) {
			var keys = _.keys(res.data);
			_.each(res.data, function(item, i) {
			  var voter = {};
			  _.each(keys, function(key) {
			    voter[key] = res.data[key][i]
			  })
			  console.log(keys,'voter');
			  VoterData.insert({
			    record_id: voter.Record,
			    contact_type: voter.Type,
			    street: voter.Street,
			    city: voter.City,
			    state: voter.State,
			    zipcode: voter.Zip,
			    geo_location: voter.GeoLocation
			  });
			})//here
      })
  }
})



