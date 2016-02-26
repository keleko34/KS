module.exports = (function(){
  function CreateRequestLog()
  {
    var _date = "[]"
      , _url = ''
      , _ip = ''

    function requestLog()
    {
      return requestLog.date()+" "+requestLog.ip()+" Requested: "+requestLog.url();
    }

    requestLog.date = function(d)
    {
      if(d === undefined)
      {
        return _date;
      }
      _date = (typeof d === 'string' && d.indexOf("[") === 0 && d.indexOf("]") === (d.length-1) ? d : _date);
      return requestLog;
    }

    requestLog.ip = function(i)
    {
      if(i === undefined)
      {
        return _ip;
      }
      _ip = (typeof i === 'string' ? (i.substring(0,(i.indexOf(' ,') > -1 ? i.indexOf(' ,') : i.length)).replace('::1','').replace('::ffff:','')) : _ip);
      _ip = (_ip.length < 1 ? 'localhost' : _ip);
      return requestLog;
    }

    requestLog.url = function(u)
    {
      if(u === undefined)
      {
        return _url;
      }
      _url = (typeof u === 'string' ? u : _url);
      return requestLog;
    }

    return requestLog;
  }
  return CreateRequestLog;
}());
