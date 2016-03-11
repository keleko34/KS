var fs_module = require('fs')
  , path_module = require('path');

module.exports = (function(fs,path){
  function CreateFile()
  {
    var _ext = ''
      , _url = ''
      , _exists = false
      , _base = ''
      , _host = ''
      , _pipe = function(){}
      , _error = function(){}
      , _then = function(){}
      , _location = 'C:/'

    function File()
    {
      var split = (File.url().split("/"))
        , req = this;
      split.map(function(d,i){if(d.length < 1){ split.splice(i,1);}});
      if(split.length > 1)
      {
        var _currentDirectory = File.base()
          , x = 0
          , _foundError = function(err)
            {
              File.then().call(File,err);
              File.error().call(File,err);
            }
          , _nextCheck = function()
            {
              x += 1;
              if(x >= (split.length-1))
              {
                File.exists((File.location()+File.base()+File.url()),function(){
                  File.then()
                  .call(File);

                  File.pipe()
                  .call(File,fs.createReadStream((File.location()+File.base()+File.url())),File.ext());

                },_foundError);
                return true;
              }
              _currentDirectory = _currentDirectory+(_currentDirectory.lastIndexOf('/') !== (_currentDirectory.length-1) ? '/' : '')+split[x];
              File.checkDirectory(File.location()+_currentDirectory,_nextCheck,_foundError);
              return true;
            }
        _currentDirectory = _currentDirectory+(_currentDirectory.lastIndexOf('/') !== (_currentDirectory.length-1) ? '/' : '')+split[x];
        File.checkDirectory(File.location()+_currentDirectory,_nextCheck,_foundError);
      }
      else
      {
        File.exists((File.location()+File.base()+File.url()),function(){
          File.then()
          .call(File);

          File.pipe()
          .call(File,fs.createReadStream((File.location()+File.base()+File.url())),File.ext());

        },function(err){File.then().call(File,err);File.error().call(File,err);});
      }
    }

    File.host = function(h)
    {
      if(h === undefined)
      {
        return _host;
      }
      _host = (typeof h === 'string' ? (h.indexOf(':') > -1 ? (h.substring(0,h.indexOf(':'))) : h) : _host);
      return File;
    }

    File.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = (typeof b === 'string' ? b : _base);
      return File;
    }

    File.ext = function(t)
    {
      if(t === undefined)
      {
        return _ext;
      }
      _ext = (typeof t === 'string' ? t : _ext);
      return File;
    }

    File.url = function(p)
    {
      if(p === undefined)
      {
        return _url;
      }
      _url = (typeof p === 'string' && p.indexOf('/') > -1 ? p : _url);
      return File;
    }

    File.location = function(l)
    {
      if(l === undefined)
      {
        return _location;
      }
      _location = (typeof l === 'string' && l.indexOf('/') > -1 ? l : _location);
      return File;
    }

    File.pipe = function(p)
    {
      if(p === undefined)
      {
        return _pipe;
      }
      _pipe = (typeof p === 'function' ? p : _pipe);
      return File;
    }

    File.error = function(p)
    {
      if(p === undefined)
      {
        return _error;
      }
      _error = (typeof p === 'function' ? p : _error);
      return File;
    }

    File.then = function(p)
    {
      if(p === undefined)
      {
        return _then;
      }
      _then = (typeof p === 'function' ? p : _then);
      return File;
    }

    File.checkDirectory = function(dir,cb,err)
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
            if(process.env.debug !== "false")
            {
              console.error('Blocked Url: File Filter: Check: \033[31m',dir,File.host(),File.base(),File.url(),"\033[37m");
            }
            err(500);
          }
        }
        else
        {
          if(process.env.debug !== "false")
          {
            console.error('Bad directory: File Filter: Check: \033[31m',dir,File.host(),File.base(),File.url(),"\033[37m");
          }
          err(404);
        }
      });
    }

    File.exists = function(f,cb,err)
    {
      fs.stat(f,function(error,stats){
        if(!error)
        {
          if(stats.isFile())
          {
            cb();
          }
          else
          {
            if(process.env.debug !== "false")
            {
              console.error('Is Not File: File Filter: Exist: \033[31m',f,File.host(),File.base(),File.url(),"\033[37m");
            }
            err(404);
          }
        }
        else
        {
          if(process.env.debug !== "false")
          {
            console.error('File does not exist: File Filter: Exist: \033[31m',f,File.host(),File.base(),File.url(),"\033[37m");
          }
          err(404);
        }
      });
    }

    return File;
  }
  return CreateFile;
}(fs_module,path_module));
