module.exports = (function(){
  function CreateThreadCommands()
  {
    var _thread = function(){};

    function ThreadCommands()
    {
      return {
        echo:ThreadCommands.echo
      }
    }

    ThreadCommands.thread = function(t)
    {
      if(t === undefined)
      {
        return _thread;
      }
      _thread = (typeof t === 'function' ? t : _thread);
      return ThreadCommands;
    }

    /* Method Commands */

    ThreadCommands.echo = function(data)
    {
      if(data.message !== undefined)
      {
        console.log('From thread '+ThreadCommands.thread().id()+': '+data.message);
      }
    }

    return ThreadCommands;
  }
  return CreateThreadCommands;
}());
