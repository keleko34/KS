var env_module = require('./_Env/Env')
  , vhost_module = require('./_Vhost/Vhost')
  , alias_module = require('./_Alias/Alias')
  , file_module = require('./_File/File')
  , error_module = require('./_Error/Error')

module.exports = (function(CreateEnv,CreateVhost,CreateAlias,CreateFile,CreateError){
  function CreateFilter()
  {
    var _type = 'env'
      , _typeEnum = ['env','vhost','alias','file','directory','module']
      , _pipe = function(){}
      , _error = function(){}
      , _then = function(){}

    function Filter()
    {
      switch(Filter.type())
      {
        case 'alias':
          var _alias = CreateAlias()
          .host(this.host())
          .url(this.url());
          return _alias.call(this);

        case 'env':
          var _env = CreateEnv()
          .host(this.host())
          .active((this.queryString().env !== undefined ? this.queryString().env : this.base()));
          return _env.call(this);

        case 'vhost':
          var _vhost = CreateVhost()
          .host(this.host())
          .request(this.url());
          return _vhost.call(this);

        case 'file':
          CreateFile()
          .host(this.host())
          .base(this.base())
          .dir(this.dir())
          .location(this.location())
          .url(((this.url().indexOf('.') > -1) ? this.url() : (this.url()+(this.url().lastIndexOf('/') !== (this.url().length-1) ? "/index.html" : "index.html"))))
          .ext((this.ext().length < 1 ? 'html' : this.ext()))
          .error(Filter.error())
          .pipe(Filter.pipe())
          .then(Filter.then())
          .call(this);
          return true;

        case 'error':
          Filter.error(CreateError()
          .host(this.host())
          .type(Filter.errorCode())
          .call(this));
          return true;
      }
    }

    Filter.type = function(t)
    {
      if(t === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(t) > -1 ? t : _type);
      return Filter;
    }

    Filter.pipe = function(o)
    {
      if(o === undefined)
      {
        return _pipe;
      }
      _pipe = (typeof o === 'function' ? o : _pipe);
      return Filter;
    }

    Filter.error = function(o)
    {
      if(o === undefined)
      {
        return _error;
      }
      _error = (typeof o === 'function' ? o : _error);
      return Filter;
    }

    Filter.statusCode = function(o)
    {
      if(o === undefined)
      {
        return _statusCode;
      }
      _statusCode = (typeof o === 'number' ? o : _statusCode);
      return Filter;
    }

     Filter.then = function(o)
     {
        if(o === undefined)
        {
          return _then;
        }
        _then = (typeof o === 'function' ? o : _then);
        return Filter;
     }

    return Filter;
  }
  return CreateFilter;
}(env_module,vhost_module,alias_module,file_module,error_module));
