(self.webpackChunkclient=self.webpackChunkclient||[]).push([[6922],{6922:function(e,t,n){!function(e){"use strict";var t=function(e){return new RegExp("^(?:"+e.join("|")+")$","i")};e.defineMode("cypher",(function(n){var r,i=function(e){var t=e.next();if('"'===t)return e.match(/^[^"]*"/),"string";if("'"===t)return e.match(/^[^']*'/),"string";if(/[{}\(\),\.;\[\]]/.test(t))return r=t,"node";if("/"===t&&e.eat("/"))return e.skipToEnd(),"comment";if(u.test(t))return e.eatWhile(u),null;if(e.eatWhile(/[_\w\d]/),e.eat(":"))return e.eatWhile(/[\w\d_\-]/),"atom";var n=e.current();return c.test(n)?"builtin":l.test(n)?"def":d.test(n)||p.test(n)?"keyword":"variable"},a=function(e,t,n){return e.context={prev:e.context,indent:e.indent,col:n,type:t}},o=function(e){return e.indent=e.context.indent,e.context=e.context.prev},s=n.indentUnit,c=t(["abs","acos","allShortestPaths","asin","atan","atan2","avg","ceil","coalesce","collect","cos","cot","count","degrees","e","endnode","exp","extract","filter","floor","haversin","head","id","keys","labels","last","left","length","log","log10","lower","ltrim","max","min","node","nodes","percentileCont","percentileDisc","pi","radians","rand","range","reduce","rel","relationship","relationships","replace","reverse","right","round","rtrim","shortestPath","sign","sin","size","split","sqrt","startnode","stdev","stdevp","str","substring","sum","tail","tan","timestamp","toFloat","toInt","toString","trim","type","upper"]),l=t(["all","and","any","contains","exists","has","in","none","not","or","single","xor"]),d=t(["as","asc","ascending","assert","by","case","commit","constraint","create","csv","cypher","delete","desc","descending","detach","distinct","drop","else","end","ends","explain","false","fieldterminator","foreach","from","headers","in","index","is","join","limit","load","match","merge","null","on","optional","order","periodic","profile","remove","return","scan","set","skip","start","starts","then","true","union","unique","unwind","using","when","where","with","call","yield"]),p=t(["access","active","assign","all","alter","as","catalog","change","copy","create","constraint","constraints","current","database","databases","dbms","default","deny","drop","element","elements","exists","from","grant","graph","graphs","if","index","indexes","label","labels","management","match","name","names","new","node","nodes","not","of","on","or","password","populated","privileges","property","read","relationship","relationships","remove","replace","required","revoke","role","roles","set","show","start","status","stop","suspended","to","traverse","type","types","user","users","with","write"]),u=/[*+\-<>=&|~%^]/;return{startState:function(){return{tokenize:i,context:null,indent:0,col:0}},token:function(e,t){if(e.sol()&&(t.context&&null==t.context.align&&(t.context.align=!1),t.indent=e.indentation()),e.eatSpace())return null;var n=t.tokenize(e,t);if("comment"!==n&&t.context&&null==t.context.align&&"pattern"!==t.context.type&&(t.context.align=!0),"("===r)a(t,")",e.column());else if("["===r)a(t,"]",e.column());else if("{"===r)a(t,"}",e.column());else if(/[\]\}\)]/.test(r)){for(;t.context&&"pattern"===t.context.type;)o(t);t.context&&r===t.context.type&&o(t)}else"."===r&&t.context&&"pattern"===t.context.type?o(t):/atom|string|variable/.test(n)&&t.context&&(/[\}\]]/.test(t.context.type)?a(t,"pattern",e.column()):"pattern"!==t.context.type||t.context.align||(t.context.align=!0,t.context.col=e.column()));return n},indent:function(t,n){var r=n&&n.charAt(0),i=t.context;if(/[\]\}]/.test(r))for(;i&&"pattern"===i.type;)i=i.prev;var a=i&&r===i.type;return i?"keywords"===i.type?e.commands.newlineAndIndent:i.align?i.col+(a?0:1):i.indent+(a?0:s):0}}})),e.modeExtensions.cypher={autoFormatLineBreaks:function(e){for(var t=e.split("\n"),n=/\s+\b(return|where|order by|match|with|skip|limit|create|delete|set)\b\s/g,r=0;r<t.length;r++)t[r]=t[r].replace(n," \n$1 ").trim();return t.join("\n")}},e.defineMIME("application/x-cypher-query","cypher")}(n(3668))}}]);
//# sourceMappingURL=6922.bf58460d.chunk.js.map