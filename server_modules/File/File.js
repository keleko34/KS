var fs_module = require('fs');

module.exports = (function(fs){
  function CreateFile()
  {
    var _ext = ''
      , _path = ''
      , _exists = false
      , _base = process.cwd().replace(/\\/g,"/")

    function File()
    {
      var currentDirectory = File.base()
        , foundError = false;
      File.path().split('/').forEach(function(d,i){
        if(!foundError)
        {
          currentDirectory = currentDirectory+'/'+d;
          File.checkDirectory(currentDirectory,function(){

              if(i >= (File.splitPath().length-1))
              {
                File.exists(function(){
                  console.log('sending: ',File.base()+File.path());
                  File.callback()(fs.createReadStream(File.base()+File.path()))
                },function(err){
                  File.callback()(undefined,err);
                })
              }
          },function(err){
            foundError = true;
            File.callback()(undefined,err);
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
          if(files.indexOf((File.base().substring(File.base().lastIndexOf('/'),File.base().length))))
          {
            err(500);
            return;
          }
          cb();
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
      fs.stats(File.base()+File.path(),function(error,stats){
        if(!error)
        {
          if(stats.isFile())
          {
            cb();
          }
          err(404);
        }
        err('index');
      });
    }

    return File;
  }
  return CreateFile;
}(fs_module));
