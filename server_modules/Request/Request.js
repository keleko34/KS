var headers_module = require('./_Headers/Headers')

module.exports = (function(CreateHeader){
  function CreateRequest()
  {
    var _requestOrder = ['firewall','vhost','alias','file','rest','directory','error']
      , _requestOrderEnum = ['firewall','vhost','alias','file','rest','directory','error']
      , _config = {}
      , _url =''
      , _query = {}
      , _onResponse = function(content,headers){}

    function Request(req)
    {

      //returns needed info for response
      Request.onResponse()
      .call(Request,"Hello World",CreateHeader()(req));
    }

    /* this is the request order in which checks should happen, so the request goes through each check in order */
    Request.requestOrder = function(n,t)
    {
      if(n === undefined)
      {
        return _requestOrder;
      }
      if(t === undefined && n.constructor === Array)
      {
        var valid = true;
        n.forEach(function(v,i){
          if(_typeEnum.indexOf(v) < 0)
          {
            valid = false;
          }
        });
        if(valid)
        {
          _requestOrder = n;
        }
        return Request;
      }
      if(typeof t === 'string' && _typeEnum.indexOf(t) > -1)
      {
        var i = ((typeof n === 'number' || !isNaN(parseInt(n))) && n <= 5 ? n : 0);
        _requestOrder[i] = t;
      }
      return Request;
    }

    /* config is updated with every request to the curent config, as changes may have happened from admin */
    Request.config = function(c)
    {
      if(c === undefined)
      {
        return _config;
      }
      _config = (typeof c === 'object' ? c : _config);
      return Request;
    }

    Request.url = function(u)
    {
      if(u === undefined)
      {
        return _url;
      }
      _url = (typeof u === 'string' ? u : _url);
      return Request;
    }

    Request.query = function(q)
    {
      if(q === undefined)
      {
        return _query;
      }
      _query = (typeof q === 'object' ? q : _query);
      return Request;
    }

    Request.onResponse = function(o)
    {
      if(o === undefined)
      {
        return _onResponse;
      }
      _onResponse = (typeof o === 'function' ? o : _onResponse);
      return Request;
    }

    return Request;
  }
  return CreateRequest;
}(headers_module));
