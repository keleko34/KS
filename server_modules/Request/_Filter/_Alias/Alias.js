var url_module = require('url')
  , querystring_module = require('querystring');

module.exports = (function(url,querystring){
  function CreateAlias()
  {
    var _host = ''
      , _url = ''

    function Alias()
    {
      if(config.sites[Alias.host()] !== undefined && config.sites[Alias.host()].alias[Alias.url()] !== undefined)
      {
        var _aliases = config.sites[Alias.host()].alias
          , _alias = ((_aliases[Alias.url()].indexOf('/') !== 0 ? '/' : '')+_aliases[Alias.url()])
          , _query = querystring.parse(decodeURI(url.parse(_alias).query));

        this.url(decodeURI(url.parse(_alias).pathname));
        Object.keys(_query).forEach((function(k,i){
          var _qString = this.queryString();
          _qString[k] = _query[k];
          this.queryString(_qString);
        }).bind(this));

        console.log(this.queryString());
        return true;
      }
      return false;
    }

    Alias.url = function(a)
    {
      if(a === undefined)
      {
        return _url;
      }
      _url = (typeof a === 'string' ? a : _url);
      return Alias;
    }

    Alias.host = function(n)
    {
      if(n === undefined)
      {
        return _host;
      }
      _host = (typeof n === 'string' ? (n.indexOf(':') > -1 ? (n.substring(0,n.indexOf(':'))) : n) : _host);
      return Alias;
    }

    return Alias;
  }
  return CreateAlias;
}(url_module,querystring_module));
