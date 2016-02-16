module.exports = (function(){
  function CreateHTTPS()
  {
    var _port = 443
      , _base = './app'

    function HTTPS()
    {

    }

    HTTPS.port = function(p)
    {
      if(p === undefined)
      {
        return _port;
      }
      _port = ((typeof p === 'number' || !isNaN(parseInt(p,10))) ? parseInt(p,10) : _port);
      return HTTPS;
    }

    HTTPS.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = ((typeof b === 'string' && b.indexOf('.') === 0) ? b : _base);
      return HTTPS;
    }

    return HTTPS;
  }
  return CreateHTTPS;
}());
