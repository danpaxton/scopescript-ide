(self.webpackChunkclient=self.webpackChunkclient||[]).push([[2650],{2650:function(e,t,n){!function(e){"use strict";e.defineMode("elm",(function(){function e(e,t,n){return t(n),n(e,t)}var t=/[a-z]/,n=/[A-Z]/,r=/[a-zA-Z0-9_]/,i=/[0-9]/,o=/[0-9A-Fa-f]/,u=/[-&*+.\\/<>=?^|:]/,f=/[(),[\]{}]/,a=/[ \v\f]/;function s(){return function(s,m){if(s.eatWhile(a))return null;var x=s.next();if(f.test(x))return"{"===x&&s.eat("-")?e(s,m,l(1)):"["===x&&s.match("glsl|")?e(s,m,k):"builtin";if("'"===x)return e(s,m,h);if('"'===x)return s.eat('"')?s.eat('"')?e(s,m,c):"string":e(s,m,p);if(n.test(x))return s.eatWhile(r),"variable-2";if(t.test(x)){var d=1===s.pos;return s.eatWhile(r),d?"def":"variable"}if(i.test(x)){if("0"===x){if(s.eat(/[xX]/))return s.eatWhile(o),"number"}else s.eatWhile(i);return s.eat(".")&&s.eatWhile(i),s.eat(/[eE]/)&&(s.eat(/[-+]/),s.eatWhile(i)),"number"}return u.test(x)?"-"===x&&s.eat("-")?(s.skipToEnd(),"comment"):(s.eatWhile(u),"keyword"):"_"===x?"keyword":"error"}}function l(e){return 0==e?s():function(t,n){for(;!t.eol();){var r=t.next();if("{"==r&&t.eat("-"))++e;else if("-"==r&&t.eat("}")&&0===--e)return n(s()),"comment"}return n(l(e)),"comment"}}function c(e,t){for(;!e.eol();)if('"'===e.next()&&e.eat('"')&&e.eat('"'))return t(s()),"string";return"string"}function p(e,t){for(;e.skipTo('\\"');)e.next(),e.next();return e.skipTo('"')?(e.next(),t(s()),"string"):(e.skipToEnd(),t(s()),"error")}function h(e,t){for(;e.skipTo("\\'");)e.next(),e.next();return e.skipTo("'")?(e.next(),t(s()),"string"):(e.skipToEnd(),t(s()),"error")}function k(e,t){for(;!e.eol();)if("|"===e.next()&&e.eat("]"))return t(s()),"string";return"string"}var m={case:1,of:1,as:1,if:1,then:1,else:1,let:1,in:1,type:1,alias:1,module:1,where:1,import:1,exposing:1,port:1};return{startState:function(){return{f:s()}},copyState:function(e){return{f:e.f}},token:function(e,t){var n=t.f(e,(function(e){t.f=e})),r=e.current();return m.hasOwnProperty(r)?"keyword":n}}})),e.defineMIME("text/x-elm","elm")}(n(3668))}}]);
//# sourceMappingURL=2650.daceacf7.chunk.js.map