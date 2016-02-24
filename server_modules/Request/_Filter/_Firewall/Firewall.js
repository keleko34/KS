module.exports = (function(){
  function CreateFirewall()
  {
    var _host = ''
      , _ip = ''
      , _url = ''
      , _base = ''

    function Firewall()
    {
      if(config.sites[Firewall.host()] !== undefined && config.sites[Firewall.host()].firewall !== undefined)
      {
        var deny = false
          , _path = Firewall.base()+(Firewall.url().lastIndexOf('/') !== (Firewall.url().length-1) ? Firewall.url() : Firewall.url().substring(0,(Firewall.url().length-2)))
          , ipKeys = Object.keys(config.sites[Firewall.host()].firewall)
          , x = 0
          , denyCheck = function(ipKey)
            {
              switch(config.sites[Firewall.host()].firewall[ipKey].type)
              {
                case 'allow':
                  if(config.sites[Firewall.host()].firewall[ipKey].ip.indexOf(Firewall.ip()) < 0)
                  {
                    return true;
                  }
                break;
                case 'deny':
                  if(config.sites[Firewall.host()].firewall[ipKey].ip.indexOf(Firewall.ip()) > -1)
                  {
                    return true;
                  }
                break;
              }
              return false;
            }
        outer:for(x;x<ipKeys.length;x+=1)
        {
          if(ipKeys[x].indexOf('*') < 0)
          {
            if(_path === ipKeys[x])
            {
              if(denyCheck(ipKeys[x]))
              {
                deny = true;
                break outer;
              }
            }
          }
          else if(_path.indexOf(ipKeys[x].replace('*','')) === 0)
          {
            if(denyCheck(ipKeys[x]))
            {
              deny = true;
              break outer;
            }
          }
        }
        return !deny;
      }
      return false;
    }

    Firewall.host = function(h)
    {
      if(h === undefined)
      {
        return _host;
      }
      _host = (typeof h === 'string' ? (h.indexOf(':') > -1 ? (h.substring(0,h.indexOf(':'))) : h) : _host);
      return Firewall;
    }

    Firewall.ip = function(i)
    {
      if(i === undefined)
      {
        return _ip;
      }
      _ip = (typeof i === 'string' ? i : _ip);
      return Firewall;
    }

    Firewall.url = function(i)
    {
      if(i === undefined)
      {
        return _url;
      }
      _url = (typeof i === 'string' && i.indexOf('/') > -1 ? i : _url);
      return Firewall;
    }

    Firewall.base = function(b)
    {
      if(b === undefined)
      {
        return _base;
      }
      _base = (typeof b === 'string' ? b : _base);
      return Firewall;
    }

    return Firewall;
  }
  return CreateFirewall;
}());
