var Joop = Joop || {
    $: this,//our scope
    k:{//keywords are editable if you don't like them
        p: 'proto',     //for prototypal inheritance
        x: 'base',      //inherit from base classes
        m: 'members',   //members of the new class
        s: 'statics',   //static class members
        c: 'init',      //function to be called when constructing
        f: 'fun',       //function to be called when not constructing
        n: 'classname'  //is classname a good name for this?
    },
    c: function(source, target, pre){//copy values from one object to another
        pre = pre || '';
        for(var name in source){
            if(source.hasOwnProperty(name)){
                target[pre+name] = source[name];
            }
        }
    },
    e: function(target, name, value){//ensure target has value, or use default
        return (target[name] = target[name] || value);
    },
    f: function(o){//a function maker
        function G(){}
        if(o){
            G.prototype = o;
        }
        return G;
    },
    g: function(target, path, create, limit){//get a reference by path. optionally create missing nodes
        var parts = path.split('.');
        var max = parts.length;
        limit = limit?(limit+max)%max:max;//we can limit to specific depth(positive) or limit from the end(negatve)
        for(var i = 0; i < limit; ++i){
            var part = parts[i];
            if(create){
                this.e(target, part, {});
            }
            target = target[part];
        }
        return target;
    },
    l: function(target, path, value){//link value at path in target.
        var endPart = path.split('.').pop();
        target = this.g(target, path, true, -1);//now get the parent, which could == target if parts.length == 1
        this.c(this.e(target, endPart, {}), value);
        target[endPart] = value;
    },
    define: function(classname, definition){//create a constructor and link it in the global scope
        var t = this, k = t.k, a, b, i, j,//some local variables
        //make some shorter vars for the syntax
            x = k.x,//extend/inherit
            m = k.m,//members
            s = k.s,//statics
            c = k.c,//constructor
            f = k.f,//non-constructor
            n = k.n,//classname
            /*F=function(o){//a function maker
                function G() {}
                if(o){
                    G.prototype = o;
                }
                return G;
            },*/
            G = t.f(t.e(definition, k.p, {})),//ensure we have a prototype
            p = new G();
            
        //inherit from any base classes
        a = t.e(definition, x, []);
        for(i = 0; i < a.length; ++i){
            j = (typeof a[i] == 'string')?
                                a[i]:
                                a[i][n];//we accept Joop constructors and strings.
            b = t.g(t.$, j, false, 0);//find the constructor in our scope
            t.c(b.prototype, p);
            t.c(b.prototype, p, j+'.');
            p[j] = b;//give a reference to the inherited constructor
        } 
        
        //add any members
        t.c(t.e(definition, m, {}), p);
        
        //non-constructor function
        i = t.e(definition, f, t.f());
                    
        //create a constructor function
        t.e(definition, c, function(){//default constructor will take an init object and copy its contents
            t.c(arguments[0]||{}, this);
        });
        var construct = function(){
            if(this[this[n]]){//check if we have this constructor!
                    return definition[c].apply(this, arguments);
            }
            return i.apply(construct, arguments);
        };
        
        //add any class variables
        t.c(t.e(definition, s, {}), construct);
        
        p[classname] = construct;
        p[n] = classname;
        
        //set up class info etc
        construct.prototype = p;//use proper keyword here
        construct[n] = classname;
        construct[m] = definition[m];
        construct[x] = definition[x];
        if(classname){
            t.l(t.$, classname, construct);
        }
    }
};