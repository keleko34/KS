var command_module = require('./_Commands/Command')

module.exports = (function(CreateCommands){
  function CreateComm()
  {
    /* The type of comm we are setting up whether master, fork, or thread */
    var _type = 'master'
      , _typeEnum = ['master','fork','thread']
      /* what kind of message command to execute */
      , _commands = CreateCommands()
      , _channels = []
    
    /* comm will filter the incoming messages when recieved */
    function Comm(message)
    {
      
    }
    
    Comm.type = function(t)
    {
      if(t === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(t) > -1 ? t : _type);
      return Comm;
    }
    
    Comm.commands = function(c)
    {
      if(c === undefined)
      {
        return _commands;
      }
      _commands = (c instanceof CreateCommands() ? c : _commands);
      return Comm;
    }
    
    comm.send = function(m,rec){

    }

  }
  return CreateComm;
}(command_module))
