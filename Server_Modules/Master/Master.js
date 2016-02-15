var fork_module = require('./../Forks/Fork')
  , thread_module = require('./../Threads/Thread')
  , comm_module = require('./../Comm/Comm')
  , cluster_module = require('cluster')
  , childprocess_module = require('child_process')

module.exports = (function(CreateFork,CreateThread,CreateComm,cluster,child_process){
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
          Master.forks(x,CreateFork()
            .id(x)
            .cluster(cluster.fork({id:x,server:Master.config().server}).on('message',Master.comm()))
            .status('online'))
          .comm()
          .channels('fork',function(message){
            for(var x=0;x<Master.forks().length;x+=1)
            {
              Master.forks()[x].send(message);
            }
          });
        }
      }
      if(Master.forkCrash() > -1)
      {
        Master.forks()[Master.forkCrash()].shutdown();
        Master.forks(Master.forkCrash(),CreateFork()
          .id(Master.forkCrash())
          .cluster(cluster.fork({id:Master.forkCrash(),server:Master.config().server}).on('message',Master.comm()))
          .status('online'))
        .forkCrash(-1)
        .comm()
        .channels('fork',function(message){
          for(var x=0;x<Master.forks().length;x+=1)
          {
            Master.forks()[x].send(message);
          }
        });
      }

      /* The threads creation section, whenever a thread crashes or a new thread needs spawned this constructor will run */
      if(Master.threads().length < Master.threadCount())
      {
        for(var x=Master.threads().length;x<Master.threadCount();x+=1)
        {
          Master.threads(x,CreateThread()
              .id(x)
              .fork(child_process.fork('./Server_Modules/Threads/Thread.js',[],{env:{id:x,controller:'thread',modules:JSON.stringify(Master.config().Threads[x].modules)}}).on('message',Master.comm()))
              .status('online'))
            .comm()
            .channels('thread',function(message){
              for(var x=0;x<Master.threads().length;x+=1)
              {
                Master.threads()[x].send(message);
              }
            });
        }
      }
      if(Master.threadCrash() > -1)
      {
        Master.threads()[Master.threadCrash()].shutdown();
        Master.threads(Master.threadCrash(),CreateThread()
            .id(Master.threadCrash())
            .fork(child_process.fork('./Server_Modules/Threads/Thread.js',[],{env:{id:Master.threadCrash(),controller:'thread',modules:JSON.stringify(Master.config().Threads[Master.threadCrash()].modules)}}).on('message',Master.comm()))
            .status('online'))
          .threadCrash(-1)
          .comm()
          .channels('thread',function(message){
            for(var x=0;x<Master.threads().length;x+=1)
            {
              Master.threads()[x].send(message);
            }
          });
      }

      Master.comm()
      .type('master')
      .channels('fork',{send:function(msg){Master.forks().forEach(function(d,i){d.send(msg);});}})
      .commands()
      .list('restart',function(data){
        if(data.type === 'thread' && data.id !== undefined){
          Master.threads()[data.id].shutdown()
          .fork(child_process.fork('./../Threads/Thread.js'));
        }
        else if (data.type === 'fork' && data.id !== undefined){
          Master.forks()[data.id].shutdown()
          .cluster(cluster.fork({id:data.id}));
        }
      })
      .list('spawn',function(data){
        if(data.type === 'thread'){
          Master.threadCount(Master.threadCount()+1)();
        }
        else if(data.type === 'fork'){
          Master.forkCount(Master.forkCount()+1)();
        }
      })
      .list('crash',function(data){
        if(data.type === 'thread' && data.id !== undefined){
          Master.threadCrash(data.id)();
        }
        else if(data.type === 'fork' && data.id !== undefined){
          Master.forkCrash(data.id)();
        }
      })
      .list('update',function(data){
        if(data.config !== undefined)
        {
          //update config here
        }
      })
      .list('echo',function(data){
        if(data.message !== undefined)
        {
          console.log(data.message);
        }
      })

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
    
    Master.comm = function(c)
    {
      if(c === undefined)
      {
        return _comm;
      }
      _comm = (c instanceof CreateComm() ? c : _comm);
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
}(fork_module,thread_module,comm_module,cluster_module,childprocess_module))
