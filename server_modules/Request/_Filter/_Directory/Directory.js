var fs_module = require('fs')

module.exports = (function(fs){
  function CreateDirectory()
  {
    function Directory()
    {

    }

    Directory.host = function(h)
    {
      if(h === undefined)
      {
        return _host;
      }
      _host = (typeof h === 'string' ? (h.indexOf(':') > -1 ? (h.substring(0,h.indexOf(':'))) : h) : _host);
      return Directory;
    }

    Directory.url = function(a)
    {
      if(a === undefined)
      {
        return _url;
      }
      _url = (typeof a === 'string' ? a : _url);
      return Directory;
    }

    Directory.checkDirectory = function(dir,cb,err)
    {
      fs.readdir(dir,function(error,files){
        if(!error)
        {
          if(files.indexOf((File.base().substring((File.base().lastIndexOf('/')+1),File.base().length))) < 0)
          {
            cb();
          }
          else
          {
            err(500);
          }
        }
        else
        {
          err(404);
        }
      });
    }

    Directory.exists = function(d,cb,err)
    {
      fs.stat(d,function(error,stats){
        if(!error)
        {
          if(stats.isDirectory())
          {
            cb();
          }
          else
          {
            err(404);
          }
        }
        else
        {
          err(404);
        }
      });
    }

    return Directory;
  }
  return CreateDirectory;
}(fs_module));
