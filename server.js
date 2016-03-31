var express = require('express'); 

var https = require('https'); 

var imageMgr = require('./js/ImageAPIManager.js')



var app = new express(); 

app.set('view engine', 'jade');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/views')); 


app.get('/', (req, res) => {
    
    //TODO: prettify these instructions with info about using the max, offset, and format.
    res.sendFile("index.html"); 
}); 


//refactor this to pull from potentially a list of urls and join them all together
//remove the hard coded concerns for Imgur


app.get('/search/:searchTerm', (req, res) => {
    
    try {
    
    var searchTerm = req.params.searchTerm; 

    var max = req.query.max; 

    var offset = req.query.offset; 
    
    var format = req.query.format; 


    var images = new imageMgr (
    [
        {
            headers: {
                Authorization: "Client-ID e6a75edc46cd964",
                },
            host: 'api.imgur.com',
            path: '/3/gallery/search/?q='+searchTerm,
        }
    ]); 
    

    if (format == "user") {
            try {
                images.getAllImages((data) => res.render('results', {data: data.slice(offset, max)})); 
                addToRecent(searchTerm); 
            } catch(e) {
                console.log(e);
            }
    }
   
    else {
            try{
                images.getAllImages((data) => res.send(data.slice(offset,max))); 
                addToRecent(searchTerm); 
            } catch(e) {
                console.log(e); 
            }
                
        }

    }
    catch(e) {
        res.send('Something bad happened. We will address with our next check-in.', e); 
    }

    
}); 



app.get('/recent',  (req, res) => {
    
    res.send(recentSearches); 
    
}); 


app.listen(app.get('port'), () => {
    console.log('app is running on port', app.get('port')); 
}); 

var recentSearches = []; 


//loose functions will be picked up before finished


//need a class for search term management with a database dependency 

function addToRecent(aString) {
    recentSearches.push({
        searchTerm: aString, 
        date: Date.now()
    }); 
}

//pulling from any api should map the data to this. Will need a class for mapping different apis to this format 

//the class should 
// 1) have a list of api urls
// 2) have a transformer function for each named api 
// 3) return make the request to each api 
// 4) join the results
// 5) return the combined data response 



