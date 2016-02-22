module.exports = (function(){
  function CreateError()
  {
    var _type = 0
      , _typeEnum = [404,500] //need to add more

    function Error()
    {
      switch(Error.type())
      {
        case 404:
          return "sorry no file here";
        case 500:
          return "Access to here is denied"
      }
      return ""
    }

    Error.type = function(t)
    {
      if(t === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(t) > -1 ? t : _type);
      return Error;
    }

    return Error;
  }
  return CreateError;
}());
