module.exports = (function(){
  function CreateEnv()
  {
    var _host = ''
      , _active = ''

    function Env()
    {
      if(config.sites[Env.host()] !== undefined)
      {
        if(this.url().indexOf('/admin') === 0 && config.sites[Env.host()].app.admin)
        {
          this.base("/admin");
        }
        else if(config.sites[Env.host()].app.env[Env.active()] !== undefined)
        {
          this.base(config.sites[Env.host()].app.env[Env.active()]);
        }
        return true;
      }
      return false;
    }

    Env.host = function(h)
    {
      if(h === undefined)
      {
        return _host;
      }
      _host = (typeof h === 'string' ? (h.indexOf(':') > -1 ? (h.substring(0,h.indexOf(':'))) : h) : _host);
      return Env;
    }

    Env.active = function(a)
    {
      if(a === undefined)
      {
        return _active;
      }
      _active = (typeof a === 'string' ? a : _active);
      return Env;
    }

    return Env;
  }
  return CreateEnv;
}());
