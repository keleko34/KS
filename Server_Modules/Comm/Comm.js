var command_module = require('./_Commands/Command')

module.exports = (function(CreateCommands){
  function CreateComm()
  {
    var _type = 'master'
      , _typeEnum = ['master','fork','thread']
      , _commands = CreateCommands()
    
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
    
  }
  return CreateComm;
}(command_module))