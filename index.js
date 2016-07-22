/*------------------------------------------------------------------------------------

 More details to be added soon

 | Author   : Deepak Kamat & Aumkar Thakur
 | Git Repo : https://github.com/PokemonGoApps/pokemongo-nearby-players-api
-------------------------------------------------------------------------------------*/

// Dependencies and requirements
var _          = require('lodash'),
    express    = require('express'),
    request    = require('request'),

    config     = require('./private/configs/config.js'),
    mapsFunc   = require('./map-functions.js');


// Server port
var _port_ = process.env.PORT || 3000;

// Keys
var keys = {
	geocodeApiKey: "AIzaSyDCsK09IQUZnU7AwM5gOhSOeugTNe-WamQ"
};


/*-----------------------------------------------------------------------------
ExpressJS App - Settings and Routes
------------------------------------------------------------------------------*/

var pokemonGoApi = express(); 
pokemonGoApi.use( '/static', express.static(__dirname + '/static') );
pokemonGoApi.set( 'views', './views' );
pokemonGoApi.set( 'view engine', 'pug' );


/*///////////////
 API Routes
////////////////*/

pokemonGoApi.get('/api/', function(req, res){
	res.render('default');
});

pokemonGoApi.get('/api/near/:latitude/:longtitude', function(req, res){

	// Set response headers here
	res.set('Content-type', 'application/json');

	// Check if Latitude & Longtitude are correct
	if (true) {}
	
	// Create a new object with the longtitude and latitude
    var coords = new Coords( 
    	req.params.latitude, 
    	req.params.longtitude 
    );


    // Reverse Geocode
    var rvrs_geocode_uri = "https://maps.googleapis.com/maps/api/geocode/json?latlng="
    + coords.lat +","
    + coords.lng 
    +"&key="
    + keys.geocodeApiKey 
    + " ";

    request(rvrs_geocode_uri, ( err, response, data ) => {
    	// Handle exceptions
    	if ( err ) {
    		console.err("Error occured: " + err);
    		res.send("An error occured: " + err);
    	}

    	// Storing the Google Geocode JSON Data of the Lat-Long in the following variable
    	var maps_data = JSON.parse( data );

    	// Check if we got results for the passed lat-long
    	if (maps_data.status == "okay") {
    		console.log('>> Body >>');
    		res.send( JSON.parse( JSON.stringify( maps_data, null, 2 ) ) );
    	}

    	else if ( maps_data.status != "okay" ) {
    		var error_data = {
    			"status" : "failed",
    		    "reason" : maps_data.status,
    		    "message": "Please check the passed latitude and longtitude. -90 >= Latitude =< 90 && -180 >= Longtitude =< 180"
    	    };
    		res.send( error_data );
    	}

    });


    // Send the response
    // res.send( coords.float() );

});



/* Co-ordinates object */
function Coords(latitude, longtitude) {
	   this.lat = latitude;
	   this.lng = longtitude;
}

Coords.prototype.float = function( precision ) {
	var PRECISION = precision || 8;

	var returnData = {
		lat: parseFloat(this.lat).toPrecision( PRECISION ),
		lng: parseFloat(this.lng).toPrecision( PRECISION )
	};
	
	return returnData;
}



/*-----------------------------------------------------------------------------
Serve the app hot
------------------------------------------------------------------------------*/
pokemonGoApi.listen( _port_ );
console.log('Server is running at 127.0.0.1:' + _port_);
