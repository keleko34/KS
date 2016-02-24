var fs_module = require('fs');

module.exports = (function(fs){
  function CreateError()
  {
    var _type = 0
      , _typeEnum = [404,500] //need to add more
      , _host = ''

    function Error()
    {
      this.url('/errors/'+Error.type()+'.html');
      return fs.createReadStream('./sites/'+Error.host()+this.url());
    }

    Error.host = function(n)
    {
      if(n === undefined)
      {
        return _host;
      }
      _host = (typeof n === 'string' ? (n.indexOf(':') > -1 ? (n.substring(0,n.indexOf(':'))) : n) : _host);
      return Error;
    }

    Error.type = function(t)
    {
      if(t === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(t) > -1 ? t : _type);
      return Error;
    }

    return Error;
  }
  return CreateError;
}(fs_module));
