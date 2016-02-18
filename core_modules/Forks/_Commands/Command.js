module.exports = (function(){
  function CreateForkCommands()
  {
    var _fork = function(){};

    function ForkCommands()
    {
      return {
        fork_start:ForkCommands.fork_start,
        echo:ForkCommands.echo
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
   ForkCommands.fork_start = function(data)
   {
     process.send({command:'echo',data:{message:'echo from fork: '+data.id}});
   }

  ForkCommands.echo = function(data)
  {
    if(data.message !== undefined)
    {
      console.log('From thread '+ForkCommands.fork().id()+': '+data.message);
    }
  }

    return ForkCommands;
  }
  return CreateForkCommands;
}());
