module.exports = (function(){
  function CreateContentType()
  {
    var _ext = ''
      , _type = ''
      , _encoding = ''

    function ContentType()
    {

    }

    ContentType.ext = function(v)
    {
      if(v === undefined)
      {
        return _ext;
      }
      _ext = (typeof v === 'string' ? v : _ext);
      return ContentType;
    }

    ContentType.type = function(v)
    {
      if(v === undefined)
      {
        return _type;
      }
      _type = (typeof v === 'string' ? v : _type);
      return ContentType;
    }

    ContentType.encoding = function(v)
    {
      if(v === undefined)
      {
        return _encoding;
      }
      _encoding = (typeof v === 'string' ? v : _encoding);
      return ContentType;
    }

    return ContentType;
  }
  return CreateContentType;
}());
