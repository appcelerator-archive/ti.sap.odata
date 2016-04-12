
/**
 * Dependencies
 */

var OData = require('..')
  , c = require('./config').sap;


// create new Odata connection

var odata = OData(c.url, {
  user: c.user,
  password : c.password
});


// example of resource specific instance

var products = odata.resource('FlightCollection/Categories');

// query options

var data = {
  format: 'json',
  resource: 'FlightCollection',
  query: {
    '$top' : 2,
    '$orderby': 'PRICE'
  }
};

// example query
odata.get(data, function (err, res){
  console.log('GET QUERY:', res.body);

  // example of using query results to run sub-query
  odata.get({url: res.body.d.results[0].flightBookings.__deferred.uri, format:'json'} ,function (err, res){
    console.log('NESTED GET QUERY:', res.body);
  });

});

// example of metadata query
odata.metadata({}, function(err, res){
  console.log('Metadata: ', res.text.length);
});
