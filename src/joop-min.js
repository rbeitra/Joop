var Joop=Joop||function(n,f){function o(a,b,e){for(var d in a)if(a.hasOwnProperty(d)&&!(e&&b[d]))b[d]=a[d]}function g(a,b,e){return a[b]=a[b]||e}function u(a){function b(){}if(a)b.prototype=a;return b}function v(a,b,e,d){b=b.split(".");var i=b.length,q;d=d?(d+i)%i:i;for(i=0;i<d;i++){q=b[i];e&&g(a,q,{});a=a[q]}return a}function w(a,b,e){var d;e=e||a[p];d=e.split(".").pop();b=v(b,e,true,-1);o(g(b,d,{}),a,1);b[d]=a}if(!f){f=n;n=""}var r=Joop,h=r.k,c,k,l,j;l=h.x;var x=h.m,y=h.s,s=h.f,p=h.n,t=h.c,m=new (u(g(f, h.p,{})));c=g(f,l,[]);for(l=0;l<c.length;l++){j=c[l];j=typeof j==="string"?j:j[p];k=v(r.$,j,false,0);o(k.prototype,m);m[j]=k}o(g(f,x,{}),m);c=function(){k=arguments;if(this[this[p]])return c[t].apply(this,k);return c[s].apply(c,k)};m[n]=c;m[p]=n;c.prototype=m;c[h.d]=f;c[t]=g(f,t,function(a){o(a||{},this)});c[s]=g(f,s,u());o(g(f,y,{}),c);(c[p]=n)&&w(c,r.$);return c};Joop.$=this;Joop.k={d:"def",p:"proto",x:"base",m:"members",s:"statics",c:"init",f:"fun",n:"classname"};//(c)2010 r@beitra.net//thanks mum&dad