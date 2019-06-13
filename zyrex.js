var exports = module.exports = {};
var request = require('request');
var crypto = require('crypto');

var accessKey = "CHANGE_ME";
var secretKey = "CHANGE_ME";
exports.accessKey = exports.accessKey;
exports.secretKey = exports.secretKey;
var tonce;
var signature;

exports.tonce = function(callback){
  var timeStampInMs = new Date().getTime();
  return callback(timeStampInMs);
};

exports.apiRequest = function(uri, callback){
  var url = 'https://zyrex.io/api/v2/' + uri;

  request.get(url, function (error, response, body) {
    if(error){
 	  return callback({success:false, error:error});
	}else{
	  return callback({success:true, message:body});
	}
  });
};

exports.apiPostRequest = function(uri, payload, callback){
  var url = 'https://zyrex.io/api/v2/' + uri;

  request.post(url, {form:{signature:payload}}, function (error, response, body) {
    if(error){
      return callback({success:false, error:error});
	}else{
	  return callback({success:true, message:body});
	}
  });
};

exports.genPayload = function(requestType, uri, extras, callback){
  exports.tonce(function(tonce){
    var payload = requestType + "|" + uri + "|access_key=" + exports.accessKey + extras + "&tonce=" + tonce;
	var hash = crypto.createHmac('sha256', exports.secretKey).update(payload).digest('hex');
	return callback(hash, tonce);
  });
};

exports.genPayloadNoTONCE = function(requestType, uri, extras, callback){
  var payload = requestType + "|" + uri + "|" + extras;
  var hash = crypto.createHmac('sha256', exports.secretKey).update(payload).digest('hex');
  return callback(hash);
};

exports.listMarkets = function(callback){
  exports.genPayload("GET", "/api/v2/markets", "", function(payload, tonce){
	var uri = "markets?access_key=" + exports.accessKey + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
	  if(result.success){
	    return callback(JSON.parse(result.message));
	  }else{
	    return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.allMarketsTicker = function(callback){
  var uri = "tickers";
  exports.apiRequest(uri, function(result){
    if(result.success){
      return callback(JSON.parse(result.message));
    }else{
      return callback(JSON.parse(result.error));	
    }
  })
}

exports.ticker = function(market, callback){
  var uri = "tickers/" + market;
  exports.apiRequest(uri, function(result){
    if(result.success){
      console.log(result.message);
    }else{	
      console.log(result.error);
    }
  })
}

exports.account = function(callback){
  exports.genPayload("GET", "/api/v2/members/me", "", function(payload, tonce){
    var uri = "members/me?access_key=" + exports.accessKey + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
	  if(result.success){
	    return callback(JSON.parse(result.message));
	  }else{
	    return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.allDeposits = function(callback){
  exports.genPayload("GET", "/api/v2/deposits", "", function(payload, tonce){
    var uri = "deposits?access_key=" + exports.accessKey + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
	  if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.deposits = function(currencySymbol, callback){
  exports.genPayload("GET", "/api/v2/deposits", "&currency=" + currencySymbol, function(payload, tonce){
    var uri = "deposits?access_key=" + exports.accessKey + "&currency=" + currencySymbol +"&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
	  if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.deposit = function(txid, callback){
  exports.genPayload("GET", "/api/v2/deposit", "&txid=" + txid, function(payload, tonce){
	var uri = "deposit?access_key=" + exports.accessKey + "&txid=" + txid + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
      if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.depositAddress = function(currencySymbol, callback){
  exports.genPayload("GET", "/api/v2/deposit_address", "&currency=" + currencySymbol, function(payload, tonce){
	var uri = "deposit_address?access_key=" + exports.accessKey + "&currency=" + currencySymbol + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
      if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.orders = function(market, callback){
  exports.genPayload("GET", "/api/v2/orders", "&market=" + market, function(payload, tonce){
    var uri = "orders?access_key=" + exports.accessKey + "&market=" + market + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
	  if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.createOrder = function(market, side, volume, price, callback){
  exports.tonce(function(tonce){
	var query = "access_key=" + exports.accessKey + "&market=" + market + "&price=" + price + "&side=" + side + "&tonce=" + tonce+ "&volume=" + volume ;
	exports.genPayloadNoTONCE("POST", "/api/v2/orders", query, function(payload){
      var uri = "orders?" + query;
	  exports.apiPostRequest(uri, payload, function(result){
        if(result.success){
	      return callback(JSON.parse(result.message));
		}else{
		  return callback(JSON.parse(result.error));		
		}
	  })
	});	
  });
}

exports.order = function(id, callback){
  exports.genPayload("GET", "/api/v2/order", "&id=" + id, function(payload, tonce){
	var uri = "order?access_key=" + exports.accessKey + "&id=" + id + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
      if(result.success){
	    return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.cancelOrder = function(id, callback){
  exports.tonce(function(tonce){
	var query = "access_key=" + exports.accessKey + "&id=" + id + "&tonce=" + tonce;
	exports.genPayloadNoTONCE("POST", "/api/v2/order/delete", query, function(payload){
      var uri = "order/delete?" + query;
	  exports.apiPostRequest(uri, payload, function(result){
	    if(result.success){
	      return callback(JSON.parse(result.message));
		}else{
		  return callback(JSON.parse(result.error));	
		}
	  })
	});	
  });
}

exports.clearAllOrdersSide = function(side, callback){
  exports.tonce(function(tonce){
    var query = "access_key=" + exports.accessKey + "&side=" + side + "&tonce=" + tonce;
	exports.genPayloadNoTONCE("POST", "/api/v2/orders/clear", query, function(payload){
	  var uri = "orders/clear?" + query;
	  exports.apiPostRequest(uri, payload, function(result){
	    if(result.success){
		  return callback(JSON.parse(result.message));
        }else{
		  return callback(JSON.parse(result.error));
		}
	  })
	});	
  });
}

exports.clearAllOrders = function(callback){
  exports.tonce(function(tonce){
    var query = "access_key=" + exports.accessKey + "&tonce=" + tonce;
	exports.genPayloadNoTONCE("POST", "/api/v2/orders/clear", query, function(payload){
	  var uri = "orders/clear?" + query;
	  exports.apiPostRequest(uri, payload, function(result){
	    if(result.success){
		  return callback(JSON.parse(result.message));
		}else{
		  return callback(JSON.parse(result.error));		
		}
	  })
    });	
  });
}

exports.orderBook = function(market, callback){
  exports.genPayload("GET", "/api/v2/order_book", "&market=" + market, function(payload, tonce){
	var uri = "order_book?access_key=" + exports.accessKey + "&market=" + market + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
      if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.depth = function(market, callback){
  exports.genPayload("GET", "/api/v2/depth", "&market=" + market, function(payload, tonce){
	var uri = "depth?access_key=" + exports.accessKey + "&market=" + market + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
      if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.trades = function(market, callback){
  exports.genPayload("GET", "/api/v2/trades", "&market=" + market, function(payload, tonce){
    var uri = "trades?access_key=" + exports.accessKey + "&market=" + market + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
	  if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.myTrades = function(market, callback){
  exports.genPayload("GET", "/api/v2/trades/my", "&market=" + market, function(payload, tonce){
    var uri = "trades/my?access_key=" + exports.accessKey + "&market=" + market + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
	  if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.kLine = function(market, callback){
  exports.genPayload("GET", "/api/v2/k", "&market=" + market, function(payload, tonce){
	var uri = "k?access_key=" + exports.accessKey + "&market=" + market + "&tonce=" + tonce + "&signature=" + payload;
	exports.apiRequest(uri, function(result){
      if(result.success){
		return callback(JSON.parse(result.message));
	  }else{
		return callback(JSON.parse(result.error));	
	  }
	})
  });	
}

exports.timestamp = function(callback){
  var uri = "timestamp";
  exports.apiRequest(uri, function(result){
    if(result.success){
      return callback(JSON.parse(result.message));
    }else{
      return callback(JSON.parse(result.error));	
    }
  })	
}