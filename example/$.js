//a utility class for manipulating the page
Joop('$', {
    fun: function(items){
        return new $(items);
    },
    init: function(input){
        if(typeof input === 'string'){
            this.items = [];
            var all = document.getElementsByTagName("*");
            var matcher = $.matcher(input);
            for(var i = 0, max = all.length; i < max; ++i){
                var item = all[i];
                if(matcher(item)){
                    this[''+this.items.length] = item;
                    this.items.push(item);
                }
            }
        } else {
            this.items = input
        }
    },
    members:{
        each: function(fun){
            for(var i = 0, max = this.items.length; i < max; ++i){
                fun(this.items[i], i);
            }
            return this;            
        },
        appendChildTag: function(tagName, content, attributes){
            var result = [];
            this.each(function(item, i) {
                var newItem = $.tag(tagName, content, attributes);
                item.appendChild(newItem);
                result.push(newItem);
            });
            return $(result);//return the new items
        },
        appendChild: function(){
            for(var j = 0; j < arguments.length; ++j){
                var appendee = arguments[j];
                this.each(function(item, i) {
                    item.appendChild(appendee);
                });
            }
            return $(arguments);//return the new items
        },
        div: function(content, attributes){
            return this.appendChildTag('div', content, attributes);
        },
        p: function(content, attributes){
            return this.appendChildTag('p', content, attributes);
        },
        span: function(content, attributes){
            return this.appendChildTag('span', content, attributes);
        },
        br: function(){
            return this.appendChildTag('br');
        },
        a: function(content, href, attributes){
            attributes = attributes || {};
            var old = attributes.href;
            attributes.href = href;
            this.appendChildTag('a', content, attributes);
            attributes.href = old;
            return this;
        },
        img: function(src, attributes){
            attributes = attributes || {};
            var old = attributes.src;
            attributes.src = src;
            this.appendChildTag('img', '', attributes);
            attributes.src = old;
            return this;
        },
        innerHTML: function(content){
            return this.each(function(item, i) {
                item.innerHTML = content;
            });
        },
        attributes: function(attributes){
            return this.each(function(item, i) {
                $.attributes(item, attributes);
            });
        },
        alert: function(){
            return this.each(function(item, i) {
                alert(item);
            });
        }
    },
    statics: {
        matcher: function(query){
            if(query[0] === "*"){
                return function(item){return true;};
            } if(query[0] === "#"){
                var id = query.substring(1);
                return function(item){return item.id == id;};
            } else if(query[0] == '.'){
                var className = query.substring(1);
                return function(item){return item.className == className;};
            } else {
                var tagName = query.toUpperCase();
                return function(item){return item.tagName == tagName;};
            }
        },
        tag: function(tagName, content, attributes){
            var result = document.createElement(tagName);
            content = content || '';
            $.attributes(result, attributes);
            if(content != '') result.innerHTML = content;
            return result;
        },
        attributes: function(element, attributes){
            attributes = attributes || {};
            if(attributes.id){
                element.id = attributes.id;
            }
            if(attributes.className){
                element.className = attributes.className;
            }
            for(var name in attributes){
                if(name != 'id' && name != 'className'){
                    element.setAttribute(name, attributes[name]);
                }
            }
        }
    }
});