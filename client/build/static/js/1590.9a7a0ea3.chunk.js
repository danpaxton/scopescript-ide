(self.webpackChunkclient=self.webpackChunkclient||[]).push([[1590],{1590:function(e,n,t){!function(e){"use strict";e.defineMode("octave",(function(){function e(e){return new RegExp("^(("+e.join(")|(")+"))\\b")}var n=new RegExp("^[\\+\\-\\*/&|\\^~<>!@'\\\\]"),t=new RegExp("^[\\(\\[\\{\\},:=;\\.]"),r=new RegExp("^((==)|(~=)|(<=)|(>=)|(<<)|(>>)|(\\.[\\+\\-\\*/\\^\\\\]))"),i=new RegExp("^((!=)|(\\+=)|(\\-=)|(\\*=)|(/=)|(&=)|(\\|=)|(\\^=))"),a=new RegExp("^((>>=)|(<<=))"),o=new RegExp("^[\\]\\)]"),c=new RegExp("^[_A-Za-z\xa1-\uffff][_A-Za-z0-9\xa1-\uffff]*"),m=e(["error","eval","function","abs","acos","atan","asin","cos","cosh","exp","log","prod","sum","log10","max","min","sign","sin","sinh","sqrt","tan","reshape","break","zeros","default","margin","round","ones","rand","syn","ceil","floor","size","clear","zeros","eye","mean","std","cov","det","eig","inv","norm","rank","trace","expm","logm","sqrtm","linspace","plot","title","xlabel","ylabel","legend","text","grid","meshgrid","mesh","num2str","fft","ifft","arrayfun","cellfun","input","fliplr","flipud","ismember"]),s=e(["return","case","switch","else","elseif","end","endif","endfunction","if","otherwise","do","for","while","try","catch","classdef","properties","events","methods","global","persistent","endfor","endwhile","printf","sprintf","disp","until","continue","pkg"]);function u(e,n){return e.sol()||"'"!==e.peek()?(n.tokenize=l,l(e,n)):(e.next(),n.tokenize=l,"operator")}function f(e,n){return e.match(/^.*%}/)?(n.tokenize=l,"comment"):(e.skipToEnd(),"comment")}function l(d,p){if(d.eatSpace())return null;if(d.match("%{"))return p.tokenize=f,d.skipToEnd(),"comment";if(d.match(/^[%#]/))return d.skipToEnd(),"comment";if(d.match(/^[0-9\.+-]/,!1)){if(d.match(/^[+-]?0x[0-9a-fA-F]+[ij]?/))return d.tokenize=l,"number";if(d.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?[ij]?/))return"number";if(d.match(/^[+-]?\d+([EeDd][+-]?\d+)?[ij]?/))return"number"}if(d.match(e(["nan","NaN","inf","Inf"])))return"number";var h=d.match(/^"(?:[^"]|"")*("|$)/)||d.match(/^'(?:[^']|'')*('|$)/);return h?h[1]?"string":"string error":d.match(s)?"keyword":d.match(m)?"builtin":d.match(c)?"variable":d.match(n)||d.match(r)?"operator":d.match(t)||d.match(i)||d.match(a)?null:d.match(o)?(p.tokenize=u,null):(d.next(),"error")}return{startState:function(){return{tokenize:l}},token:function(e,n){var t=n.tokenize(e,n);return"number"!==t&&"variable"!==t||(n.tokenize=u),t},lineComment:"%",fold:"indent"}})),e.defineMIME("text/x-octave","octave")}(t(3668))}}]);
//# sourceMappingURL=1590.9a7a0ea3.chunk.js.map