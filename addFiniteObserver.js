  addFiniteObserver: function(key, target, method, context){
     
     // normalize.  if a function is passed to target, make it the method.
     if (method === undefined) {
       method = target; target = this ;
     }
     if (!target) target = this ;

     if (typeof method === "string") method = target[method] ;
     if (!method) throw "You must pass a method to addObserver()" ;

     var me = this; // replace by context?
     var f = function() { 
        var val = me.get(key);
        var ret = method.call(target,val);
        console.log("addFiniteObserver function called: val = " + val + " and ret = " + ret);
        if(ret){
           me.removeObserver(key, me, f); 
        }
     };
     this.addObserver(key, this, f);
  },
