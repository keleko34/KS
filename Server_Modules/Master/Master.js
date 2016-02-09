var fork_module = require('./../Forks/Fork')
  , thread_module = require('./../Threads/Thread')
  , cluster_module = require('cluster')

module.exports = (function(CreateFork,CreateThread,cluster){
  function CreateMaster()
  {
    var _forkCount = 0
      , _threadCount
      , _forkCrash = -1
      , _threadCrash = -1
      , _active = false
      , _forks = []
      , _threads = []
    
    /* if the amount of forks that are allocated in the forks array are less than what is expected or if a fork has crashed
     * then the associated forks will be respawned or the newly needed forks will be created */
    function Master(config)
    {
      if(Master.forks().length < Master.forkCount())
      {
        for(var x=Master.forks().length;x<Master.forkCount();x+=1)
        {
          Master.forks(x,CreateFork()
            .id(x)
            .cluster(cluster.fork({id:x})));
        }
      }
      if(Master.forkCrash > -1)
      {
        Master.forks()[Master.forkCrash()].shutdown();
        Master.forks(Master.forkCrash(),CreateFork()
          .id(Master.forkCrash())
          .cluster(cluster.fork({id:Master.forkCrash()})))
        .forkCrash(-1);
      }
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
      if((typeof n === 'number' && !isNaN(parseInt(n,10))) && f instanceof CreateFork())
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
      if((typeof n === 'number' && !isNaN(parseInt(n,10))) && t instanceof CreateThread())
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
    
    /* Helper Methods */
    
    /* shuts down all fork processes and spawned thread processes */
    Master.shutdown = function()
    {
      
    }
    
    return Master;
  }
  return CreateMaster;
}(fork_module,thread_module,cluster_module))