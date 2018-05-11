express= require('express');
bodyParser=require('body-parser');
var sleep = require('system-sleep');


app=express();

app.use(bodyParser.json());


app.use(express.static(__dirname + '/public'));

const googleMapsClient = require('@google/maps').createClient({
	        key: 'AIzaSyDptlHYXtPhfVcziZpdoNTrs1Iq0ALEDYo',
	        Promise: Promise 
	        });

app.get('/place',function(req,res)
{
		var w=req.query.p1;
		var h=req.query.p2;
		var radius=req.query.distance;
		var type=req.query.category;
		var keyword=req.query.keyword;
		
        if(typeof req.query.p1!='undefined' && typeof req.query.p2 != 'undefined')
		{
			
			googleMapsClient.placesNearby({keyword: keyword, location:w+','+h, type:type, radius:parseFloat(radius)}).asPromise()
			  .then((response) => {
			    //console.log(response.json.results);
			  obj1=response.json.results;
			  if(typeof(response.json.next_page_token) !='undefined')
			  {
				        sleep(2000);
				    	googleMapsClient.placesNearby({location:w+','+h,pagetoken:response.json.next_page_token}).asPromise().then((resp) => {
				    	var obj2=resp.json.results;
				    	for (var j=0; j < obj2.length; j++)
				    	{
								obj1.push(obj2[j]);
                        }
                        if(typeof(resp.json.next_page_token) !='undefined')
			   			{
				   			sleep(2000);
					    	googleMapsClient.placesNearby({location:w+','+h,pagetoken:resp.json.next_page_token}).asPromise().then((respo) => {
					    	var obj3=respo.json.results;
					    	for (var k=0; k < obj3.length; k++)
					    	{
					    	  obj1.push(obj3[k]);
	                        }
	                        res.send(obj1);
					        })
							.catch((err) => {
							 console.log(err);
							});
				        }
				        else
				        {   
							res.send(obj1);
				        }
			   })
						.catch((err) => {
						 console.log(err);
						});
				}
				else
				{  
					res.send(obj1);
				}
			})
			  .catch((err) => {
			    console.log(err);
			  });
		}
			
});

app.get('/location',function(req,res)
       {
		var address=req.query.address;
		var radius=req.query.distance;
		var type=req.query.category;
		var keyword=req.query.keyword;

		
        if(typeof req.query.address!='undefined')
		{
			// Geocode an address with a promise
			googleMapsClient.geocode({address:address}).asPromise()
			  .then((response) => {
			  	var array=[];
			  	var location=response.json.results;
			    if (location.length != 0)
			    {
			    	array.push(location[0]['geometry']['location']);
			    
					googleMapsClient.placesNearby({keyword: keyword, location:array[0]['lat']+','+array[0]['lng'], type:type, radius:parseFloat(radius) }).asPromise()
					  .then((response) => {
					  	obj1=response.json.results;
			  if(typeof(response.json.next_page_token) !='undefined')
			  {
				        sleep(2000);
				    	googleMapsClient.placesNearby({location:array[0]['lat']+','+array[0]['lng'],pagetoken:response.json.next_page_token}).asPromise().then((resp) => {
				    	var obj2=resp.json.results;
						for (var j=0; j < obj2.length; j++)
				    	{
								obj1.push(obj2[j]);
								
                        }
                    
                        if(typeof(resp.json.next_page_token) !='undefined')
			   			{
				   			sleep(2000);
					    	googleMapsClient.placesNearby({location:array[0]['lat']+','+array[0]['lng'],pagetoken:resp.json.next_page_token}).asPromise().then((respo) => {
					    	var obj3=respo.json.results;
					    	for (var k=0; k < obj3.length; k++)
					    	{
					    	  obj1.push(obj3[k]);
					    	  
	                        }
	                        res.send(obj1);
					        })
							.catch((err) => {
							 console.log(err);
							});
				        }
				        else
				        {   
							res.send(obj1);
				        }
			   })
						.catch((err) => {
						 console.log(err);
						});
				}
				else
				{  
					res.send(obj1);
				}
		
			})
					  .catch((err) => {
					    console.log(err);
					  });
				}
			  })
			  .catch((err) => {
			    console.log(err);
			  });
		}
	    });


        



'use strict';
const yelp = require('yelp-fusion');
app.get('/yelp',function(req,res)
{		
	var name=req.query.name;
	var	locality=req.query.locality;
    var postal_code=req.query.postal_code;
    var country=req.query.country;
    var state=req.query.state;
    var address1=req.query.address1;

		 const apiKey = 'galHgrqI8-qa6AyB22j-hQ_E-PwFxL9394aGJKT0dGrXj7GfrJJQTn0PILzbiBrIxNuWVrbj6OQ-GPsVtItpUQyLqMHOjAcTyQhxyrS0A1-BeabjRzUj0XY2KNbBWnYx';
		 const client = yelp.client(apiKey);
		 client.businessMatch('best', {
		  name: name,
		  address1: address1,
		  city: locality,
		  state: state,
		  country: country,
		  postal_code:postal_code
		}).then(response => {
			console.log(response.jsonBody.businesses);
			if(response.jsonBody.businesses.length == 0)
			{
				 res.json("No");
			}
		  else
		  {
				client.reviews(response.jsonBody.businesses[0].id).then(resp => {
				   res.json(resp.jsonBody.reviews);
				}).catch(e => {
					console.log(e);
				});
		 }
		

		}).catch(e => {
		  console.log(e);
		});
});

var listenPort= process.env.PORT || 8080;
app.listen(listenPort,function()
{
	console.log('Server started');

})