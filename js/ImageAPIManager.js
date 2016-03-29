
var https = require('https'); 



function ImageAPIManager(anArrayOfUrls) {
    
    //want to make the below private
    
    this.urls = anArrayOfUrls; //not a good name, but intended to be a list of options objects to pass to node http requests
    
    /*
    
    expected type downstream, identical to Node.js options to be passed into an http request
    
    {
        headers: {
            Authorization: "Client-ID e6a75edc46cd964",
            },
        host: 'api.imgur.com',
        path: '/3/gallery/search/?q='+searchTerm,
    }; 

    */ 
    
    var transformImgurData = function(dataArray) { //private transformer methods would just be added to this class for new APIs
        
        var transformedData = dataArray.map(function(value) {
            
            //alas, this can't be properly typed
            return {
                    title: value.title, 
                    imageUrl: value.link, 
                    pageUrl: "https://imgur.com/gallery/"+value.id,
                    topic: value.topic, 
                    views: value.views, 
                    posted: value.datetime
                }
            
        }); 
        
        return transformedData; 
    }; 

    
    //the belowshould be the only public method 
    
    
    this.getAllImages = function(callback) { 
        
        //in the future, would like to allow a sorting parameter here as well, or it could be included in the  callback
        
    try {
            
        var allImageData = []; 
        
        var length = this.urls.length; 
        
        var max = max; 
        
        var offset = offset; 
        
        this.urls.forEach(function(value) {
            
            https.get(value, function(response) {
            
            var fullData;
        
            response.on('data', function(data) {
                
                fullData=fullData+data; 
                
            }); 
        
            response.on('end', function(data) {
            
                if (value.host == 'api.imgur.com') { //TODO: pull this out into its own piece to map different api responses to our desired return type
                    
                    allImageData.push(transformImgurData(JSON.parse(fullData.substr(9)).data)); 
                    
                    if (allImageData.length == length) {
                        callback(allImageData.reduce((a,b) => a.concat(b))); 
                    }
     
                }
            
            }); 
        
        });
    }); 
    //  no longer needed as the callback will handle the data
    //return data; // this should make requests to each API, transform the data using the private methods, and return it in a single list
    
    } catch(e) {
            throw new Error("problem with:"+e); 
        }
    };
    
    
}

module.exports = ImageAPIManager; 