var command_module = require('./_Commands/Commands')

module.exports = (function(CreateCommands){
  function CreateComm()
  {
    /* The type of comm we are setting up whether master, fork, or thread */
    var _type = 'master'
      , _typeEnum = ['master','fork','thread']
      /* what kind of message command to execute */
      , _commands = CreateCommands()
      , _channels = {'master':function(){},'fork':function(){},'thread':function(){}}

    /* comm will filter the incoming messages when recieved */
    function Comm(message)
    {
      if(message.route !== undefined){
        var route = message.route;
        message.route = undefined;
        comm.channels(route)(message);
      }
      if(message.command !== undefined){
        Comm.commands().call(Comm.commands(),message);
      }
    }

    Comm.type = function(t){
      if(t === undefined)
      {
        return _type;
      }
      _type = (_typeEnum.indexOf(t) > -1 ? t : _type);
      _channels = [];
      return Comm;
    }

    Comm.commands = function(c){
      if(c === undefined)
      {
        return _commands;
      }
      _commands = (typeof c === 'function' ? c : _commands);
      return Comm;
    }

    Comm.channels = function(n,f){
      if(n === undefined){
        return _channels;
      }
      if(f === undefined){
        return _channels[((typeof n === 'string' && _channels[n] !== undefined) ? n : 'master')];
      }
      if(typeof f === 'function' && (typeof n === 'string' && _channels[n] !== undefined)){
        _channels[n] = f;
      }
      return Comm;
    }
    return Comm;
  }
  return CreateComm;
}(command_module))
