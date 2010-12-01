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
        set: function(f){
            echo.echoFunction = f;
        },
        restore: function(){
            echo.set(function(){
                document.write("<br/>\n");
            });
        },
        object: function(o){
            echo(o);
            for(var n in o){
                echo(n + ":" + o[n]);
            }
        },
        echoFunction: function(){
            document.write("<br/>\n");
        },
    }
});
