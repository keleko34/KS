module.exports = (function(){
  function CreateResponse()
  {
    function Response(res)
    {
      Object.keys(Response.headers())
      .forEach(function(h,i){
        if(h !== 'StatusCode')
        {
          res.setHeader(h,Response.headers()[h]);
        }
        else
        {
          res.statusCode = Response.headers().StatusCode;
        }
      });

      if(Response.stream())
      {
        Response.content().pipe(res);
        Response.content().on('data',function(){}); //forces to stream flow mode
        Response.content().on('end',function(){res.end();}) //ends res
      }
      else
      {
        res.write(Response.content(),function(){res.end();});
      }
    }

    Response.stream = function(s)
    {
      if(s === undefined)
      {
        return _stream;
      }
      _stream = !!s;
      return Response;
    }

    Response.content = function(s)
    {
      if(s === undefined)
      {
        return _content;
      }
      _content = s;
      return Response;
    }

    Response.headers = function(s)
    {
      if(s === undefined)
      {
        return _headers;
      }
      _headers = (typeof s === 'object' && s['Content-Type'] !== undefined && s['Encoding'] !== undefined ? s : _headers);
      return Response;
    }

    return Response;
  }
  return CreateResponse;
}());
