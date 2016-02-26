module.exports = (function(){
  function CreateErrorLog()
  {
    var _error = ''
      , _date = "[]"

    function ErrorLog()
    {
      return ErrorLog.date()+" "+ErrorLog.error();
    }

    ErrorLog.error = function(e)
    {
      if(e === undefined)
      {
        return _error;
      }
      _error = (typeof e === 'string' ? e : _error);
      return ErrorLog;
    }

    ErrorLog.date = function(d)
    {
      if(d === undefined)
      {
        return _date;
      }
      _date = (typeof d === 'string' && d.indexOf("[") === 0 && d.indexOf("]") === (d.length-1) ? d : _date);
      return ErrorLog;
    }

    return ErrorLog;
  }
  return CreateErrorLog;
}());
