module.exports = (function(){
  function CreateForkCommands()
  {
    var _fork = function(){};

    function ForkCommands()
    {
      return {

      }
    }

   ForkCommands.fork = function(f)
    {
      if(f === undefined)
      {
        return _fork;
      }
      _fork = (typeof f === 'function' ? f : _fork);
      return ForkCommands;
    }

    /* Method Commands */


    return ForkCommands;
  }
  return CreateForkCommands;
}());
