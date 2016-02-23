module.exports = (function(){
  function CreateHeader()
  {
    var _status = 200
      , _contentType = 'text/plain'
      , _encoding = 'utf8'
      , _encodingEnum = ['utf8','byte'];

    function Header(req)
    {
      return {
        "statusCode":Header.status(),
        "content-type":Header.contentType(),
        "encoding":Header.encoding()
      };
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

    return Header;
  }
  return CreateHeader;
}());
