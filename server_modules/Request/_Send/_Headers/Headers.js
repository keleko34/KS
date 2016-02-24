module.exports = (function(){
  function CreateHeader()
  {
    var _status = 200
      , _contentType = 'text/plain'
      , _encoding = 'utf8'
      , _encodingEnum = ['utf8','byte']
      , _cached = false
      , _location = undefined

    function Header(req)
    {
      var _headers = {
        "StatusCode":Header.status(),
        "Content-Type":Header.contentType(),
        "Encoding":Header.encoding()
      };
      if(!Header.cached())
      {
        _headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
        _headers["Pragma"] = "no-cache";
        _headers["Expires"] = "0";
      }
      else
      {
        _headers["Cache-Control"] = "max-age=600000";
      }
      if(Header.location() !== undefined)
      {
        _headers["Location"] = Header.location();
      }
      return _headers;
    }

    Header.status = function(s)
    {
      if(s === undefined)
      {
        return _status;
      }
      _status = (typeof s === 'number' || !isNaN(parseInt(s,10)) ? parseInt(s,10) : _status);
      return Header;
    }

    Header.contentType = function(s)
    {
      if(s === undefined)
      {
        return _contentType;
      }
      _contentType = (typeof s === 'string' && s.indexOf('/') ? s : _contentType);
      return Header;
    }

    Header.encoding = function(s)
    {
      if(s === undefined)
      {
        return _encoding;
      }
      _encoding = (_encodingEnum.indexOf(s) > -1 ? s : _encoding);
      return Header;
    }

    Header.cached = function(s)
    {
      if(s === undefined)
      {
        return _cached;
      }
      _cached = !!s;
      return Header;
    }

    Header.location = function(l)
    {
      if(l === undefined)
      {
        return _location;
      }
      _location = (typeof l === 'string' && l.indexOf('http') > -1 ? l : _location);
      return Header;
    }

    return Header;
  }
  return CreateHeader;
}());
