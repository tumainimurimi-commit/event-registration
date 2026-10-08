//The dispatcher function that determine the request to the server
async function entryPointHandler(req, res){
    const method=req.method;
    const path=req.url;
    //Route one the post request
    if(method==='POST' && path==='/api/register'){
        return await postRegistration(req, res)
    }
    //Route two the get request
    if(method==='GET' && path==='/api/register'){
        return await getRegistration(req, res);
    }
    //Nothing that maches the request 
    res.writeHead(404,{'Content-Type': 'application/json'});
    res.end(JSON.stringify({error:'Not found'}));
    }
    //The functions that handle the POST request on the server
    async function postRegistration(req, res){
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({message: 'POST handler called'}));
    }
    //The function that handle the GET request
    async function getRegistration(req, res){
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(JSON.stringify({message:'GET handler called'}));
    }

    module.exports={entryPointHandler};


