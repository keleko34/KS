var fs_module = require('fs')
  , path_module = require('path');

module.exports = (function(fs,path){
  function CreateFile()
  {
    var _ext = ''
      , _url = ''
      , _dir = ''
      , _exists = false
      , _base = ''
      , _host = ''
      , _pipe = function(){}
      , _error = function(){}
      , _then = function(){}
      , _location = 'C:/'

    function File()
    {
      if(File.dir().length > 1)
      {
        console.log(File.base());
        var _currentDirectory = File.base();
        File.dir().split("/").forEach(function(d,i){
          _currentDirectory = _currentDirectory+(_currentDirectory.lastIndexOf('/') !== (_currentDirectory.length-1) ? '/' : '')+d;
          console.log("checking: ",_currentDirectory);
          File.checkDirectory(_currentDirectory,function(){
            console.log("found dir: ",_currentDirectory);
            if(i === (File.dir().split("/").length-1))
            {
              console.log(File.location(),File.base(),File.url());
              File.exists((File.location()+File.base()+File.url()),function(){
                console.log("found file: ",File.location(),File.base(),File.url());
                File.pipe()
                .call(File,fs.createReadStream((File.location()+File.base()+File.url())));

                File.then()
                .call(File);

              },File.error());
              return true;
            }
          },File.error())
          return true;
        });
      }
      else
      {
        console.log(File.location(),File.base(),File.url());
        File.exists((File.location()+File.base()+File.url()),function(){
          console.log("found file: ",File.location(),File.base(),File.url());
          File.pipe()
          .call(File,fs.createReadStream((File.location()+File.base()+File.url())),File.ext());

          File.then()
          .call(File);

        },File.error());
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

    File.dir = function(d)
    {
      if(d === undefined)
      {
        return _dir;
      }
      _dir = (typeof d === 'string' && d.indexOf('/') > -1 ? d : _dir);
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
            err(500);
          }
        }
        else
        {
          err(404);
        }
      })
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
            err(404);
          }
        }
        else
        {
          err(404);
        }
      });
    }

    return File;
  }
  return CreateFile;
}(fs_module,path_module));
