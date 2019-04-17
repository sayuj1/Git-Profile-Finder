const express = require('express');
const app = express();
const request = require('request');
const parse = require('parse-link-header');

app.set("view engine", "ejs");

app.use(express.static("public"));

//Routes

//for searching user
app.get("/", function(req, res){
    //display homepage
    res.render("index", {url: req.originalUrl});
});

//For showing user list
app.get("/show/", function(req, res){
    let user = req.query.user;
    //console.log(req.originalUrl);
    //console.log(user);
   var options = {
       url: "http://api.github.com/search/users?q="+user+"&page=1&per_page=7",
       headers:{
           'user-agent':  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
       },
       data:{
           client_id: 'eb37eae804d2c4b69980',
           client_secret: '869f459c6e3f3d0f8413e34f1443e6512a70d58a'
       },
   };
   function callback(error, response, body){
       if(!error && response.statusCode == 200){
         //  console.log(req.originalUrl);
          // console.log(body);
          //console.log(response.headers['link']); //getting value of link header
          const page = parse(response.headers['link']);
           const userInfo = JSON.parse(body);
           res.render("show", {data: userInfo, page: page, page_no: '1', url: req.originalUrl, user: user});  //https://api.github.com/search/users?q='+user+'&page=2&per_page=5
       }
       else{
           //console.log(req.headers);
           //console.log(body);
           console.log(error);
       }
   }
   request(options, callback);
   /*request('http://api.github.com/search/users?q=sayuj+user:mozilla', function(error, response, body){
    console.log(body);
   }); */
});

//for pagination
app.get("/show/:user/:id", function(req, res){
    let user = req.params.user;
    let id = req.params.id;
    //console.log(user);
   var options = {
       url: "http://api.github.com/search/users?q="+user+"&page="+id+"&per_page=7",
       headers:{
           'user-agent':  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
       },
       data:{
           client_id: 'eb37eae804d2c4b69980',
           client_secret: '869f459c6e3f3d0f8413e34f1443e6512a70d58a'
       },
   };
   function callback(error, response, body){
       if(!error && response.statusCode == 200){
          // console.log(body);
          //console.log(response.headers['link']); //getting value of link header
          const page = parse(response.headers['link']);   //converting link header value in JSON format
           const userInfo = JSON.parse(body);
           res.render("show", {data: userInfo, page: page, page_no: id, url: req.originalUrl, user: user});  //https://api.github.com/search/users?q='+user+'&page=2&per_page=5
       }
       else{
           //console.log(req.headers);
           //console.log(body);
         //  console.log(error);
       }
   }
   request(options, callback);
});

app.get("/profile/:username", function(req, res){
let user = req.params.username;
//console.log(user);
var options = {
    url: "https://api.github.com/users/"+user,
    headers:{
        'user-agent':  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36',
    },
    data:{
        client_id: 'eb37eae804d2c4b69980',
        client_secret: '869f459c6e3f3d0f8413e34f1443e6512a70d58a'
    },
};
function callback(error, response, body){
    if(!error && response.statusCode == 200){
        const userInfo = JSON.parse(body);
        //console.log(userInfo);
        res.render("profile", {data: userInfo, url: req.originalUrl, user: user});
    }
}
request(options, callback);
});

const server = app.listen(3000, function(){
console.log('server started at port 3000');
});
