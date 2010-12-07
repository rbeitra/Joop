//a little println thing
Joop('echo', {
    fun: function(){
        var s = ''
        for(var i = 0; i < arguments.length; ++i){
            s += (i?', ':'') + arguments[i];
        }
        echo.echoFunction(s);
    },
    statics: {
        clear: function(){
            
        },
        set: function(f, c){
            echo.echoFunction = f;
            echo.clearFunction = c;
        },
        restore: function(){
            echo.set(function(){
                document.write("<br/>\n");
            }, function(){});
        },
        object: function(o){
            echo(o);
            for(var n in o){
                echo(n + ":" + o[n]);
            }
        },
        clear: function(){
            echo.clearFunction();
        },
        echoFunction: function(){
            document.write("<br/>\n");
        },
        clearFunction: function(){
            //do nothing
        }
    }
});
