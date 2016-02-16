var cluster_module = require('cluster')
  , child_process_module = require('child_process')

module.exports = (function(cluster,child_process){
  function CreateMasterCommands()
  {
    var _master = function(){};

    function MasterCommands()
    {
      return {
          restart:MasterCommands.restart
        , spawn:MasterCommands.spawn
        , crash:MasterCommands.crash
        , update:MasterCommands.update
        , echo:MasterCommands.echo
      }
    }

    MasterCommands.master = function(m)
    {
      if(m === undefined)
      {
        return _master;
      }
      _master = (typeof m === 'function' ? m : _master);
      return MasterCommands;
    }

    /* Method Commands */
    MasterCommands.restart = function(data)
    {
      if(data.type === 'thread' && data.id !== undefined){
        MasterCommands.master().threads()[data.id].shutdown()
        .fork(child_process.fork('./../Threads/Thread.js'));
      }
      else if (data.type === 'fork' && data.id !== undefined){
        MasterCommands.master().forks()[data.id].shutdown()
        .cluster(cluster.fork({id:data.id}));
      }
    }

    MasterCommands.spawn = function(data)
    {
      if(data.type === 'thread'){
        MasterCommands.master().threadCount(MasterCommands.master().threadCount()+1)();
      }
      else if(data.type === 'fork'){
        MasterCommands.master().forkCount(MasterCommands.master().forkCount()+1)();
      }
    }


    MasterCommands.crash = function(data)
    {
      if(data.type === 'thread' && data.id !== undefined){
        MasterCommands.master().threadCrash(data.id)();
      }
      else if(data.type === 'fork' && data.id !== undefined){
        MasterCommands.master().forkCrash(data.id)();
      }
    }

    MasterCommands.update = function(data)
    {
      if(data.config !== undefined)
      {
        //update config here
      }
    }

    MasterCommands.echo = function(data)
    {
      if(data.message !== undefined)
      {
        console.log(data.message);
      }
    }
    return MasterCommands;
  }
  return CreateMasterCommands;
}(cluster_module,child_process_module));
