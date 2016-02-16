var fork_module = require('./../Forks/Fork')
  , thread_module = require('./../Threads/Thread')
  , comm_module = require('./../Comm/Comm')
  , master_commands_module = require('./_Commands/Command')
  , cluster_module = require('cluster')
  , childprocess_module = require('child_process')

module.exports = (function(CreateFork,CreateThread,CreateComm,CreateMasterCommands,cluster,child_process){
  function CreateMaster()
  {
    var _forkCount = 0
      , _threadCount
      , _forkCrash = -1
      , _threadCrash = -1
      , _active = false
      , _forks = []
      , _threads = []
      , _comm = CreateComm()
      , _config = {}

    /* if the amount of forks that are allocated in the forks array are less than what is expected or if a fork has crashed
     * then the associated forks will be respawned or the newly needed forks will be created */
    function Master()
    {
      /* The forks creation section, whenever a fork crashes or a new fork needs spawned this constructor will run */
      if(Master.forks().length < Master.forkCount())
      {
        for(var x=Master.forks().length;x<Master.forkCount();x+=1)
        {
          /* we have a new fork to create, we assign an id and spawn a cluster fork, this works on the same thread as the master but on a different process */
          Master.forks(x,CreateFork()
            .id(x)
            .cluster(cluster.fork({id:x,server:Master.config().server}))
            .status('online'));
          Master.forks()[x].cluster().on('message',Master.comm());
        }
      }

      /* if a fork happens to crash we need to send a disconnect notice to the fork so it will shut itself down so we can restart it and make a brand new fork process */
      if(Master.forkCrash() > -1)
      {
        Master.forks()[Master.forkCrash()].shutdown();
        Master.forks(Master.forkCrash(),CreateFork()
          .id(Master.forkCrash())
          .cluster(cluster.fork({id:Master.forkCrash(),server:Master.config().server}))
          .status('online'));
        Master.forks()[Master.forkCrash()].cluster().on('message',Master.comm());
        Master.forkCrash(-1);
      }

      /* The threads creation section, whenever a thread crashes or a new thread needs spawned this constructor will run */
      if(Master.threads().length < Master.threadCount())
      {
        for(var x=Master.threads().length;x<Master.threadCount();x+=1)
        {
          Master.threads(x,CreateThread()
              .id(x)
              .fork(child_process.fork('./core_modules/Threads/Thread.js',[],{env:{id:x,controller:'thread',modules:JSON.stringify(Master.config().Threads[x].modules)}}))
              .status('online'));
          Master.threads()[x].fork().on('message',Master.comm());
        }
      }
      if(Master.threadCrash() > -1)
      {
        Master.threads()[Master.threadCrash()].shutdown();
        Master.threads(Master.threadCrash(),CreateThread()
            .id(Master.threadCrash())
            .fork(child_process.fork('./core_modules/Threads/Thread.js',[],{env:{id:Master.threadCrash(),controller:'thread',modules:JSON.stringify(Master.config().Threads[Master.threadCrash()].modules)}}))
            .status('online'));
        Master.threads()[Master.threadCrash()].fork().on('message',Master.comm());
        Master.threadCrash(-1);

      }

      /* master comm sets up the master communication endpoint, setting up the channels is for relaying route message from others, so as an example if a child process sends a message and wants to be routed to a fork the channels is what relays the message, the commands are the list of message commands that fire when a command param on the message is included. anything coming from child process though will have restricted access to commands in fork and master. */
      Master.comm()
      .type('master')
      .channels('fork',function(msg){Master.forks().forEach(function(d,i){d.send(msg);});})
      .channels('thread',function(msg){Master.forks().forEach(function(d,i){d.send(msg);});})
      .commands()
      .list(CreateMasterCommands().master(Master)());

      process.on('uncaughtException',function(msg){console.log(msg);return false;});
    }

    /* Whether the master has active forks or threads running */
    Master.active = function(a)
    {
      if(a === undefined)
      {
        return _active;
      }
      _active = !!a;
      return Master;
    }

    /* the forks that were spawned */
    Master.forks = function(n,f)
    {
      if(n === undefined)
      {
        return _forks;
      }
      if(f === undefined && n.constructor === Array)
      {
        _forks = n;
        return Master;
      }
      if((typeof n === 'number' && !isNaN(parseInt(n,10))) && typeof f === 'function')
      {
        _forks[parseInt(n,10)] = f;
      }
      return Master;
    }

    /* The number of forks that will be spawned off of the master thread */
    Master.forkCount = function(c)
    {
      if(c === undefined)
      {
        return _forkCount;
      }
      _forkCount = ((typeof c === 'number' || !isNaN(parseInt(c,10))) ? parseInt(c,10) : _forkCount);
      return Master;
    }

    /* if a fork has had an exception and crashed, this is the id of the fork that crashed */
    Master.forkCrash = function(c)
    {
      if(c === undefined)
      {
        return _forkCrash;
      }
      _forkCrash = (((typeof c === 'number' || !isNaN(parseInt(c,10))) && parseInt(c,10) <= _forkCount) ? parseInt(c,10) : _forkCrash);
      return Master;
    }

    /* the threads that were spawned */
    Master.threads = function(n,t)
    {
      if(n === undefined)
      {
        return _threads;
      }
      if(t === undefined && n.constructor === Array)
      {
        _threads = n;
        return Master;
      }
      if((typeof n === 'number' && !isNaN(parseInt(n,10))) && typeof t === 'function')
      {
        _threads[n] = t;
      }
      return Master;
    }

    /* The number of threads to be spawned */
    Master.threadCount = function(c)
    {
      if(c === undefined)
      {
        return _threadCount;
      }
      _threadCount = ((typeof c === 'number' || !isNaN(parseInt(c,10))) ? parseInt(c,10) : _threadCount);
      return Master;
    }

    /* if a thread has had an exception and crashed, this is the id of the thread that crashed */
    Master.threadCrash = function(c)
    {
      if(c === undefined)
      {
        return _threadCrash;
      }
      _threadCrash = (((typeof c === 'number' || !isNaN(parseInt(c,10))) && parseInt(c,10) <= _threadCount) ? parseInt(c,10) : _threadCrash);
      return Master;
    }

    Master.comm = function(c)
    {
      if(c === undefined)
      {
        return _comm;
      }
      _comm = (typeof c === 'function' ? c : _comm);
      return Master;
    }

    Master.config = function(c)
    {
      if(c === undefined)
      {
        return _config;
      }
      _config = (c.constructor === Object ? c : _config);
      return Master;
    }

    /* Helper Methods */

    /* shuts down all fork processes and spawned thread processes */
    Master.shutdown = function()
    {
      process.kill();
      Master();
    }

    return Master;
  }
  return CreateMaster;
}(fork_module,thread_module,comm_module,master_commands_module,cluster_module,childprocess_module))
