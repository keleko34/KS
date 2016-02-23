var fs_module = require('fs');

module.exports = (function(fs){
  function CreateFile()
  {
    var _ext = ''
      , _path = ''
      , _exists = false
      , _base = 'C:/'

    function File()
    {
      var currentDirectory = File.base()
        , foundError = false;
      console.log(File.base(),File.path());
      File.path().split('/').forEach(function(d,i){
        if(!foundError)
        {
          currentDirectory = currentDirectory+'/'+d;
          File.checkDirectory(currentDirectory,function(){
              if(i >= (File.path().split('/').length-1))
              {
                File.exists(function(){
                  File.callback()
                  .call(File,fs.createReadStream(File.base()+File.path())
                        , undefined
                        , File.path().substring((File.path().indexOf('.')+1),File.path().length))
                },function(err){
                  File.callback()(undefined,err,'html');
                })
              }
          },function(err){
            foundError = true;
            File.callback()(undefined,err,'html');
          });
        }
      });
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

    File.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      console.log(b);
      _base = (typeof b === 'string' && b.indexOf(process.cwd().replace(/\\/g,"/")) > -1 ? b : _base);
      return File;
    }

    File.path = function(p)
    {
      if(p === undefined)
      {
        return _path;
      }
      _path = (typeof p === 'string' ? p : _path);
      return File;
    }

    File.callback = function(c)
    {
      if(c === undefined)
      {
        return _callback;
      }
      _callback = (typeof c === 'function' ? c : _callback);
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

    File.exists = function(cb,err)
    {
      if(File.ext().length < 1)
      {
        File.path(File.path()+'/index.html');
      }
      console.log(File.base(),File.path());
      if(File.path().indexOf('/') !== 0)
      {
        File.path("/"+File.path())
      }
      fs.stat(File.base()+File.path(),function(error,stats){
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
}(fs_module));
