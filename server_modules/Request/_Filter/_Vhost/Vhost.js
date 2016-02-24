module.exports = (function(){
  function CreateVhost()
  {
    var _host = 'localhost'
      , _admin = true

    function Vhost()
    {
      if(config.sites[Vhost.host()] !== undefined)
      {
        if(Vhost.request().indexOf('/admin') > -1 && config.sites[Vhost.host()].app.admin)
        {
          this.location(process.cwd());
          this.url(this.url().replace('/admin','/').replace('//','/'));
        }
        else
        {
          this.location(process.cwd()+'/sites/'+Vhost.host());
        }
        return true;
      }
      return false;
    }

    Vhost.host = function(n)
    {
      if(n === undefined)
      {
        return _host;
      }
      _host = (typeof n === 'string' ? (n.indexOf(':') > -1 ? (n.substring(0,n.indexOf(':'))) : n) : _host);
      return Vhost;
    }

    Vhost.request = function(r)
    {
      if(r === undefined)
      {
        return _request;
      }
      _request = (typeof r === 'string' && r.indexOf('/') > -1 ? r : _request);
      return Vhost;
    }

    Vhost.admin = function(a)
    {
      if(a === undefined)
      {
        return _admin;
      }
      _admin = !!a;
      return Vhost;
    }

    return Vhost;
  }
  return CreateVhost;
}());
