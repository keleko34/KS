var url_module = require('url')
  , querystring_module = require('querystring');

module.exports = (function(url,querystring){
  function CreateAlias()
  {
    var _host = ''
      , _url = ''

    function Alias()
    {
      if(config.sites[Alias.host()] !== undefined && config.sites[Alias.host()].alias !== undefined)
      {
        var found = false
          , aliasKeys = Object.keys(config.sites[Alias.host()].alias)
          , x = 0
          , filterAlias = (function(aliasReturn,urlToReplace)
            {
              Object.keys(querystring.parse(url.parse(aliasReturn).query)).forEach((function(k,i){
                var qString = this.queryString();
                qString[k] = querystring.parse(url.parse(aliasReturn).query)[k];
                this.queryString(qString);
              }).bind(this));
              this.url(this.url().replace(urlToReplace,decodeURI(url.parse(aliasReturn).pathname)));
                       this.url(this.url().replace(/\/\//g,"/"));
            }).bind(this)

        outer:for(x;x<aliasKeys.length;x+=1)
        {
          if(aliasKeys[x].indexOf('*') < 0)
          {
            if(this.url() === aliasKeys[x])
            {
              filterAlias(config.sites[Alias.host()].alias[aliasKeys[x]],aliasKeys[x]);
              found = true;
              break outer;
            }
          }
          else if(this.url().indexOf(aliasKeys[x].replace('*','')) === 0)
          {
            filterAlias(config.sites[Alias.host()].alias[aliasKeys[x]],aliasKeys[x].replace('*',''));
            found = true;
            break outer;
          }
        }
        return found;
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
