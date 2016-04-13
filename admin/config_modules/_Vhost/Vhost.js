var jsonfile_module = require('jsonfile')
  , fs_module = require('fs')

module.exports = (function(jsonfile,fs){
  function CreateVshost()
  {
    var _path = ''
      , _config = {}

    function Vshost()
    {
      jsonfile.readFile(_path,function(err,data){
        if(!err) _config = data;
      })
    }

    Vshost.path = function(v)
    {
      if(v === undefined)
      {
        return _path;
      }
      _path = (typeof v === 'string' ? v : _path);
      return Vshost;
    }

    Vshost.config = function()
    {
      return _config;
    }

    Vshost.addHost = function(h)
    {

    }

    Vhost.removeHost = function(h)
    {

    }

    return Vshost;
  }
  return CreateVshost;
}(jsonfile_module,fs_module));
