import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8084;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  // filter image endpoint
  app.get('/filteredimage',async (req,res) => {
    const {image_url} = req.query;

    if(!image_url){
      res.status(400)
          .send('image_url is required');
    }

    const result = await filterImageFromURL(image_url);
    res.status(200)
        .sendFile(result,{},async function(err){
          if(!err){
            await deleteLocalFiles([result]);
          }
    });
   
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();