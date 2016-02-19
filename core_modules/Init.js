var master_module = require('./Master/Master')
  , fork_module = require('./Forks/Fork')
  , os_module = require('os')
  , cluster_module = require('cluster')

module.exports = (function(CreateMaster,CreateFork,os,cluster){
  function CreateInit()
  {
    /* Master Module is used for creating a master channel and spawning cluster forks
     * cluster forks work as by seperate processes but on the same thread, each fork will
     * just rerun the same files as the master, so thus a master check is required for which path the code should take */

    var _master = CreateMaster()
      , _fork = CreateFork();

    function Init(config)
    {
      /* if is master process, then setup master and call, the fork count is dependent on the number of cpu cores the computer
       * that the application is running on has else if this is a forked process then a fork setup and call is required with
       * the master that will be communicated to being stored in the forks master property */
      if(cluster.isMaster)
      {
        Init.master()
        .forkCount(os.cpus().length)
        .threadCount((config.sites !== undefined ? Object.keys(config.sites).length : 1))
        .config(config)
        .call(Init.master(),config)
      }
      else
      {
        Init.fork()
        .id(process.env.id)
        .master(process)
        .config((process.env.server !== undefined ? JSON.parse(process.env.server) : {}))
        .call(Init.fork(),config)
      }
    }

    /* The current process if process is master */
    Init.master = function(m)
    {
      if(m === undefined)
      {
        return _master;
      }
      _master = (typeof m === 'function' ? m : _master);
      return Init;
    }

    /* The current process if process is a fork */
    Init.fork = function(f)
    {
      if(f === undefined)
      {
        return _fork;
      }
      _fork = (typeof f === 'function' ? f : _fork);
      return Init;
    }

    return Init;
  }
  return CreateInit;
}(master_module,fork_module,os_module,cluster_module));
