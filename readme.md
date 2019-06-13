<p align="center">
    <img src="https://github.com/ZyrkProject/zyrex-js/blob/master/images/header.png">
</p>

<a href="https://discord.gg/QHRk9NF"><img src="https://discordapp.com/api/guilds/569285452213911552/embed.png" alt="Discord Server" /></a> <a href="https://twitter.com/intent/follow?screen_name=ProjectZyrk"><img src="https://img.shields.io/twitter/follow/ProjectZyrk.svg?style=social&logo=twitter" alt="Follow on Twitter"></a> [![HitCount](http://hits.dwyl.io/zyrkproject/zyrex-js.svg)](http://hits.dwyl.io/zyrkproject/zyrex-js)

# Zyrex javascript API wrapper
***

## Setup

### Requirements:

* Download + Install [Node.js](https://nodejs.org/)

```bash
git clone https://github.com/zyrkproject/zyrex-js
cd zyrex-js
npm install
```	

### Examples:

```bash
//Import zyrex-js
var zyrex = require("./zyrex.js");
//Create API tokens first and replace below
zyrex.accessKey  =  "";    
zyrex.secretKey  =  ""

//Get all market tickers        
zyrex.allMarketsTicker(function(res){
  if(!res.error){        
    console.log(res)
  }else{        
    console.log(res)
  }
});

//Create buy order
zyrex.createOrder("zyrktc", "buy", "5.0", "0.00002500", function(res){    
  if(!res.error){    
    console.log(res);    
  }else{    
    console.log("ERROR: " + res)    
  }    
});
```	
