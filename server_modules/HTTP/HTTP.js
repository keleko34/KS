module.exports = (function(){
  function CreateHTTP()
  {
    var _port = 80
      , _base = './app'

    function HTTP()
    {

    }

    HTTP.port = function(p)
    {
      if(p === undefined)
      {
        return _port;
      }
      _port = ((typeof p === 'number' || !isNaN(parseInt(p,10))) ? parseInt(p,10) : _port);
      return HTTP;
    }

    HTTP.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = ((typeof b === 'string' && b.indexOf('.') === 0) ? b : _base);
      return HTTP;
    }

    return HTTP;
  }
  return CreateHTTP;
}());
