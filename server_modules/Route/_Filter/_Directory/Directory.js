var fs_module = require('fs')
  , stream_module = require('stream')

module.exports = (function(fs,stream){
  function CreateDirectory()
  {
    var _host = ''
      , _url = ''
      , _base = ''
      , _location = ''
      , _template = 'default'
      , _pipe = function(){}
      , _error = function(){}
      , _then = function(){}

    function Directory()
    {
        var split = (Directory.url().split("/"))
        , req = this
        , _showDirectory = function()
          {
            fs.readdir((Directory.location()+Directory.base()+Directory.url()),function(err,files){
              if(!err)
              {
                var env;
                if(req.query().env !== undefined)
                {
                  env = req.query().env;
                }
                console.log(env);
                files.forEach(function(d,i){ files[i] = (d.indexOf('.') > -1 ? d : d+"/"); files[i] = (env !== undefined ? files[i]+"?env="+env : files[i]);});
                fs.readFile((process.cwd().replace(/\\/g,"/")+"/templates/directory/"+(Directory.template())+".html"),{encoding:"utf8"},function(err,text){
                  text = text.replace(/(<title>)(.*?)(<\/title>)/,"<title>"+Directory.url()+"</title>\n<script type='text/javascript'>var directory = "+JSON.stringify(files)+"</script>");

                  var s = new stream.Readable();
                  s._read = function noop() {};
                  s.push(text);
                  s.push(null);
                  Directory.pipe().call(req,s,"html");
                })
              }
              else
              {
                _foundErrors(404);
              }
            })
          }
        , _foundErrors = function(err)
          {
            Directory.then().call(Directory,err);
            Directory.error().call(Directory,err);
          }
      split.map(function(d,i){if(d.length < 1){ split.splice(i,1);}});
      if(Directory.url().lastIndexOf('/') === (Directory.url().length-1))
      {
        if(split.length > 1)
        {
            var _currentDirectory = Directory.base()
            , x = 0
            , _nextCheck = function()
              {
                x += 1;
                if(x >= (split.length-1))
                {
                  Directory.exists((Directory.location()+Directory.base()+Directory.url()),function(){_showDirectory();},function(err){_foundErrors(err);});
                  return true;
                }
                _currentDirectory = _currentDirectory+(_currentDirectory.lastIndexOf('/') !== (_currentDirectory.length-1) ? '/' : '')+split[x];
                Directory.checkDirectory(Directory.location()+_currentDirectory,_nextCheck,function(err){_foundErrors(err);});
                return true;
              }
          _currentDirectory = _currentDirectory+(_currentDirectory.lastIndexOf('/') !== (_currentDirectory.length-1) ? '/' : '')+split[x];
          Directory.checkDirectory(Directory.location()+_currentDirectory,_nextCheck,function(err){_foundErrors(err);});
        }
        else
        {
          Directory.exists((Directory.location()+Directory.base()+Directory.url()),function(){_showDirectory();},function(err){_foundErrors(err);})
        }
      }
      else
      {
        _foundErrors(404);
      }
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

    Directory.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = (typeof b === 'string' ? b : _base);
      return Directory;
    }

    Directory.location = function(l)
    {
      if(l === undefined)
      {
        return _location;
      }
      _location = (typeof l === 'string' && l.indexOf('/') > -1 ? l : _location);
      return Directory;
    }

    Directory.checkDirectory = function(dir,cb,err)
    {
      fs.readdir(dir,function(error,files){
        if(!error)
        {
          if(files.indexOf((Directory.base().substring((Directory.base().lastIndexOf('/')+1),Directory.base().length))) < 0)
          {
            cb();
          }
          else
          {
            if(process.env.debug !== "false")
            {
              console.error('Directory Not Allowed: Directory Filter: Check: \033[31m',dir,Directory.host(),Directory.base(),Directory.url(),"\033[37m");
            }
            err(500);
          }
        }
        else
        {
          if(process.env.debug !== "false")
          {
            console.error('Directory Not Found: Directory Filter: Check: \033[31m',dir,Directory.host(),Directory.base(),Directory.url(),"\033[37m");
          }
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
            if(process.env.debug !== "false")
            {
              console.error('This is not a Directory: Directory Filter: Exists: \033[31m', d ,Directory.host(),Directory.base(),Directory.url(),"\033[37m");
            }
            err(404);
          }
        }
        else
        {
          if(process.env.debug !== "false")
          {
            console.error('Directory Not Found: Directory Filter: Exists: \033[31m', d ,Directory.host(),Directory.base(),Directory.url(),"\033[37m");
          }
          err(404);
        }
      });
    }

    Directory.pipe = function(f)
    {
      if(f === undefined)
      {
        return _pipe;
      }
      _pipe = (typeof f === 'function' ? f : _pipe);
      return Directory;
    }

    Directory.error = function(f)
    {
      if(f === undefined)
      {
        return _error;
      }
      _error = (typeof f === 'function' ? f : _error);
      return Directory;
    }

    Directory.then = function(f)
    {
      if(f === undefined)
      {
        return _then;
      }
      _then = (typeof f === 'function' ? f : _then);
      return Directory;
    }

    Directory.template = function(t)
    {
      if(t === undefined)
      {
        return _template;
      }
      _template = (typeof t === "string" ? t : _template);
      return Directory;
    }

    return Directory;
  }
  return CreateDirectory;
}(fs_module,stream_module));
