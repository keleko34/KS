var headers_module = require('./_Headers/Headers')
  , response_module = require('./_Response/Response')

module.exports = (function(CreateHeader,CreateResponse){
  function CreateSend(res)
  {
    var _stream = false
      , _content = ""
      , _error = 404
      , _host = ''
      , _ext = ''
      , _location = undefined

    function Send(res)
    {
      var _header = CreateHeader();
      if(config.sites[Send.host()] !== undefined && config.sites[Send.host()].content_types[Send.ext()] !== undefined)
      {
        if(Send.error())
        {
          _header.status(Send.error());
        }
        _header.contentType(config.sites[Send.host()].content_types[Send.ext()].type)
        .encoding(config.sites[Send.host()].content_types[Send.ext()].encoding)
        .cached(config.sites[Send.host()].app.cached);
      }
      else
      {
        _header.status(Send.error())
        .contentType('text/html')
        .encoding('utf8');
      }
      console.log(Send.location());
      _header.location((Send.location() !== undefined ? Send.location()+"/cool" : ''));
      CreateResponse()
      .stream(Send.stream())
      .headers(_header.call(Send))
      .content(Send.content())
      .call(Send,res)
    }

    Send.ext = function(t)
    {
      if(t === undefined)
      {
        return _ext;
      }
      _ext = (typeof t === 'string' ? t : _ext);
      return Send;
    }

    Send.host = function(h)
    {
      if(h === undefined)
      {
        return _host;
      }
      _host = (typeof h === 'string' ? h : _host);
      return Send;
    }

    Send.stream = function(s)
    {
      if(s === undefined)
      {
        return _stream;
      }
      _stream = !!s;
      return Send;
    }

    Send.error = function(s)
    {
      if(s === undefined)
      {
        return _error;
      }
      _error = (typeof s === 'number' ? s : _error);
      return Send;
    }

    Send.content = function(s)
    {
      if(s === undefined)
      {
        return _content;
      }
      _content = s;
      return Send;
    }

    Send.location = function(l)
    {
      if(l === undefined)
      {
        return _location;
      }
      _location = (typeof l === 'string' && l.indexOf('http') > -1 ? l : _location);
      return Send;
    }

    return Send;
  }
  return CreateSend;
}(headers_module,response_module));
