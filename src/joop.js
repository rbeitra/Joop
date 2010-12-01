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
var Joop = Joop || function (classname, definition) {
    function c(source, target, preserve) {//copy values from one object to another
 //       pre = pre || '';
        for (var name in source) {
            if (source.hasOwnProperty(name) && !(preserve && target[name])) {
                //l(target, pre+name, source[name]);
                target[name] = source[name];
            }
        }
    }
    function e(target, name, value) {//ensure target has value, or use default
        return (target[name] = target[name] || value);
    }
    function f(o) {//a function maker
        function G() {}
        if (o) {
            G.prototype = o;
        }
        return G;
    }
    function g(target, path, create, limit) {//get a reference by path. optionally create missing nodes
        var parts = path.split('.'),
            max = parts.length,
            i, part;
        limit = limit ? (limit + max) % max : max;//we can limit to specific depth(positive) or limit from the end(negative)
        for (i = 0; i < limit; i += 1) {
            part = parts[i];
            if (create) {
                e(target, part, {});
            }
            target = target[part];
        }
        return target;
    }
    //function d(classname, definition, scope) {//create a constructor and link it in in some scope, or globally
    if (!definition) {
        definition = classname;
        classname = '';
    }
    var t = Joop._, k = t.k, a, b, i, j,//some local variables
    //make some shorter vars for the syntax
        _x = k.x,//extend/inherit
        _m = k.m,//members
        _s = k.s,//statics
        _f = k.f,//non-constructor
        _n = k.n,//classname
        _c = k.c,//constructor
        G = f(e(definition, k.p, {})),//ensure we have a prototype
        p = new G();
    //scope = scope || t.$;
       
    function l(value, target, path) {//link value at path in target.
        var endPart;
        //target = target || t.$;//default target is default scope
        path = path || value[t.k.n];
        endPart = path.split('.').pop();
        target = g(target, path, true, -1);//now get the parent, which could == target if parts.length == 1
        c(e(target, endPart, {}), value, 1);//preserve values from the new guy
        target[endPart] = value;
    } 
    
    //inherit from any base classes
    a = e(definition, _x, []);
    for (i = 0; i < a.length; i += 1) {
        j = a[i];
        j = (typeof j === 'string') ? j : j[_n];//we accept Joop constructors and strings.
        b = g(t.$, j, false, 0);//find the constructor in our scope
        c(b.prototype, p);
        //copy(b.prototype, p, j + '.');//this is a bit pointless and makes huge messy classes
        p[j] = b;//give a reference to the inherited constructor
    } 
    
    //add any members
    c(e(definition, _m, {}), p);
            
    //check if we have this constructor, if so run as constructor otherwise run as non-constructor!
    a = function () {
        b = arguments;
        if (this[this[_n]]) {
            return a[_c].apply(this, b);
        }
        return a[_f].apply(a, b);
    };
    
    p[classname] = a;
    p[_n] = classname;
    
    //set up class info etc
    a.prototype = p;//use proper keyword here
    a[k.d] = definition;//
    a[_c] = e(definition, _c, function () {//default constructor will take an init object and copy its contents
        c(arguments[0] || {}, this);
    });
    a[_f] = e(definition, _f, f());//copy in non-constructor
    c(e(definition, _s, {}), a);//copy in statics
//        a[x] = definition[x];//copy in list of bases
    a[_n] = classname;//set classname
    
    if (classname) {
        l(a, t.$);//a has a classname defined so t.l will use that
    }
    return a;
};
Joop._ = Joop;//set up self reference
Joop.$ = this;//set up default scope
Joop.k = {//keywords are editable if you don't like them
    d: 'def',       //definition
    p: 'proto',     //for prototypal inheritance
    x: 'base',      //inherit from base classes
    m: 'members',   //members of the new class
    s: 'statics',   //static class members
    c: 'init',      //function to be called when constructing
    f: 'fun',       //function to be called when not constructing
    n: 'classname'  //is classname a good name for this?
};