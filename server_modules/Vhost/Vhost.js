module.exports = (function(){
  function CreateVhost()
  {
    var _base = 'app'
      , _host = 'localhost'
      , _admin = true

    function Vhost(req)
    {
      if(req.indexOf('/admin') === 0 && Vhost.admin())
      {
        return (process.cwd()+req).replace(/\\/g,"/");
      }
      else
      {
        return (process.cwd()+'/sites/'+Vhost.host()+'/'+Vhost.base()+req).replace(/\\/g,"/");
      }
    }

    Vhost.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = (typeof b === 'string' && b.indexOf('./') > -1 ? b.replace('./','') : _base);
      return Vhost;
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
