/*
Copyright (c) 2010 Robin Beitra (beitra.net)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

The Software shall be used for Good, not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
var Joop = Joop || (function (scope, syntax) {
    
    function copy(source, target, preserve) {//copy values from one object to another
        for (var name in source) {
            if (source.hasOwnProperty(name) && !(preserve && target[name])) {
                target[name] = source[name];
            }
        }
    }
    
    function ensure(target, name, value) {//ensure target has value, or use default
        return (target[name] = target[name] || value);
    }
    
    function funner(proto) {//a function maker
        function G() {}
        if (proto) {
            G.prototype = proto;
        }
        return G;
    }
    
    function getter(target, path, create, limit) {//get a reference by path. optionally create missing nodes
        var parts = path.split('.'),
            max = parts.length,
            i, part;
        limit = limit ? (limit + max) % max : max;//we can limit to specific depth(positive) or limit from the end(negative)
        for (i = 0; i < limit; i += 1) {
            part = parts[i];
            if (create) {
                ensure(target, part, {});
            }
            target = target[part];
        }
        return target;
    }
       
    function link(value, target, path) {//link value at path in target.
        var endPart;
        path = path || value[syntax.n];
        endPart = path.split('.').pop();
        target = getter(target, path, true, -1);//now get the parent, which could == target if parts.length == 1
        copy(ensure(target, endPart, {}), value, 1);//preserve values from the new guy
        target[endPart] = value;
    }
    
    function define(classname, definition) {//define a class and link it if a classname is supplied
        if (!definition) {
            definition = classname;
            classname = '';
        }
        
        var a, b, i, j,//some local variables
            G = funner(ensure(definition, syntax.p, {})),//ensure we have a prototype
            proto = new G();
        
        //inherit from any base classes
        a = ensure(definition, syntax.x, []);
        for (i = 0; i < a.length; i += 1) {
            j = a[i];
            j = (typeof j === 'string') ? j : j[syntax.n];//we accept Joop constructors and strings.
            b = getter(scope, j, false, 0);//find the constructor in our scope
            copy(b.prototype, proto);
            proto[j] = b;//give a reference to the inherited constructor
        }
        
        //add any members
        copy(ensure(definition, syntax.m, {}), proto);
                
        //check if we have this constructor, if so run as constructor otherwise run as non-constructor!
        a = function () {
            b = arguments;
            if (this[this[syntax.n]]) {
                return a[syntax.c].apply(this, b);
            }
            return a[syntax.f].apply(a, b);
        };
        
        //set up prototype
        proto[classname] = a;
        proto[syntax.n] = classname;
        
        //set up class info etc
        a.prototype = proto;//use proper keyword here
        a[syntax.d] = definition;//
        a[syntax.c] = ensure(definition, syntax.c, function () {//default constructor will take an init object and copy its contents
            copy(arguments[0] || {}, this);
        });
        a[syntax.f] = ensure(definition, syntax.f, funner());//copy in non-constructor
        copy(ensure(definition, syntax.s, {}), a);//copy in statics
        a[syntax.n] = classname;//set classname
        
        if (classname) {
            link(a, scope);//a has a classname defined so link will use that
        }
        return a;
    }
    
    define.k = syntax;//the syntax is made available for editing here
    
    return define;
}(this, {//keywords are editable if you don't like them
    d: 'def',       //definition
    p: 'proto',     //for prototypal inheritance
    x: 'base',      //inherit from base classes
    m: 'members',   //members of the new class
    s: 'statics',   //static class members
    c: 'init',      //function to be called when constructing
    f: 'fun',       //function to be called when not constructing
    n: 'classname'  //is classname a good name for this?
}));