(self.webpackChunkclient=self.webpackChunkclient||[]).push([[8595],{8595:function(t,e,a){!function(t){"use strict";var e={noEndTag:!0,soyState:"param-def"},a={alias:{noEndTag:!0},delpackage:{noEndTag:!0},namespace:{noEndTag:!0,soyState:"namespace-def"},"@attribute":e,"@attribute?":e,"@param":e,"@param?":e,"@inject":e,"@inject?":e,"@state":e,template:{soyState:"templ-def",variableScope:!0},extern:{soyState:"param-def"},export:{soyState:"export"},literal:{},msg:{},fallbackmsg:{noEndTag:!0,reduceIndent:!0},select:{},plural:{},let:{soyState:"var-def"},if:{},javaimpl:{},jsimpl:{},elseif:{noEndTag:!0,reduceIndent:!0},else:{noEndTag:!0,reduceIndent:!0},switch:{},case:{noEndTag:!0,reduceIndent:!0},default:{noEndTag:!0,reduceIndent:!0},foreach:{variableScope:!0,soyState:"for-loop"},ifempty:{noEndTag:!0,reduceIndent:!0},for:{variableScope:!0,soyState:"for-loop"},call:{soyState:"templ-ref"},param:{soyState:"param-ref"},print:{noEndTag:!0},deltemplate:{soyState:"templ-def",variableScope:!0},delcall:{soyState:"templ-ref"},log:{},element:{variableScope:!0},velog:{},const:{soyState:"const-def"}},n=Object.keys(a).filter((function(t){return!a[t].noEndTag||a[t].reduceIndent}));t.defineMode("soy",(function(e){var r=t.getMode(e,"text/plain"),o={html:t.getMode(e,{name:"text/html",multilineTagIndentFactor:2,multilineTagIndentPastTag:!1,allowMissingTagName:!0}),attributes:r,text:r,uri:r,trusted_resource_uri:r,css:t.getMode(e,"text/css"),js:t.getMode(e,{name:"text/javascript",statementIndent:2*e.indentUnit})};function s(t){return t[t.length-1]}function l(t,e,a){if(t.sol()){for(var n=0;n<e.indent&&t.eat(/\s/);n++);if(n)return null}var r=t.string,o=a.exec(r.substr(t.pos));o&&(t.string=r.substr(0,t.pos+o.index));var l=t.hideFirstChars(e.indent,(function(){var a=s(e.localStates);return a.mode.token(t,a.state)}));return t.string=r,l}function i(t,e){for(;t;){if(t.element===e)return!0;t=t.next}return!1}function p(t,e){return{element:e,next:t}}function c(t){t.context&&(t.context.scope&&(t.variables=t.context.scope),t.context=t.context.previousContext)}function u(t,e,a){return i(t,e)?"variable-2":a?"variable":"variable-2 error"}function m(t,e,a){this.previousContext=t,this.tag=e,this.kind=null,this.scope=a}function d(t,e){var a;return t.match(/[[]/)?(e.soyState.push("list-literal"),e.context=new m(e.context,"list-literal",e.variables),e.lookupVariables=!1,null):t.match(/map\b/)?(e.soyState.push("map-literal"),"keyword"):t.match(/record\b/)?(e.soyState.push("record-literal"),"keyword"):t.match(/([\w]+)(?=\()/)?"variable callee":(a=t.match(/^["']/))?(e.soyState.push("string"),e.quoteKind=a[0],"string"):t.match(/^[(]/)?(e.soyState.push("open-parentheses"),null):t.match(/(null|true|false)(?!\w)/)||t.match(/0x([0-9a-fA-F]{2,})/)||t.match(/-?([0-9]*[.])?[0-9]+(e[0-9]*)?/)?"atom":t.match(/(\||[+\-*\/%]|[=!]=|\?:|[<>]=?)/)?"operator":(a=t.match(/^\$([\w]+)/))?u(e.variables,a[1],!e.lookupVariables):(a=t.match(/^\w+/))?/^(?:as|and|or|not|in|if)$/.test(a[0])?"keyword":null:(t.next(),null)}return{startState:function(){return{soyState:[],variables:p(null,"ij"),scopes:null,indent:0,quoteKind:null,context:null,lookupVariables:!0,localStates:[{mode:o.html,state:t.startState(o.html)}]}},copyState:function(e){return{tag:e.tag,soyState:e.soyState.concat([]),variables:e.variables,context:e.context,indent:e.indent,quoteKind:e.quoteKind,lookupVariables:e.lookupVariables,localStates:e.localStates.map((function(e){return{mode:e.mode,state:t.copyState(e.mode,e.state)}}))}},token:function(r,i){switch(s(i.soyState)){case"comment":if(r.match(/^.*?\*\//)?i.soyState.pop():r.skipToEnd(),!i.context||!i.context.scope)for(var y=/@param\??\s+(\S+)/g,h=r.current();S=y.exec(h);)i.variables=p(i.variables,S[1]);return"comment";case"string":var S;return(S=r.match(/^.*?(["']|\\[\s\S])/))?S[1]==i.quoteKind&&(i.quoteKind=null,i.soyState.pop()):r.skipToEnd(),"string"}if(!i.soyState.length||"literal"!=s(i.soyState)){if(r.match(/^\/\*/))return i.soyState.push("comment"),"comment";if(r.match(r.sol()?/^\s*\/\/.*/:/^\s+\/\/.*/))return"comment"}switch(s(i.soyState)){case"templ-def":return(S=r.match(/^\.?([\w]+(?!\.[\w]+)*)/))?(i.soyState.pop(),"def"):(r.next(),null);case"templ-ref":return(S=r.match(/(\.?[a-zA-Z_][a-zA-Z_0-9]+)+/))?(i.soyState.pop(),"."==S[0][0]?"variable-2":"variable"):(S=r.match(/^\$([\w]+)/))?(i.soyState.pop(),u(i.variables,S[1],!i.lookupVariables)):(r.next(),null);case"namespace-def":return(S=r.match(/^\.?([\w\.]+)/))?(i.soyState.pop(),"variable"):(r.next(),null);case"param-def":return(S=r.match(/^\*/))?(i.soyState.pop(),i.soyState.push("param-type"),"type"):(S=r.match(/^\w+/))?(i.variables=p(i.variables,S[0]),i.soyState.pop(),i.soyState.push("param-type"),"def"):(r.next(),null);case"param-ref":return(S=r.match(/^\w+/))?(i.soyState.pop(),"property"):(r.next(),null);case"open-parentheses":return r.match(/[)]/)?(i.soyState.pop(),null):d(r,i);case"param-type":var f=r.peek();return-1!="}]=>,".indexOf(f)?(i.soyState.pop(),null):"["==f?(i.soyState.push("param-type-record"),null):"("==f?(i.soyState.push("param-type-template"),null):"<"==f?(i.soyState.push("param-type-parameter"),null):(S=r.match(/^([\w]+|[?])/))?"type":(r.next(),null);case"param-type-record":return"]"==(f=r.peek())?(i.soyState.pop(),null):r.match(/^\w+/)?(i.soyState.push("param-type"),"property"):(r.next(),null);case"param-type-parameter":return r.match(/^[>]/)?(i.soyState.pop(),null):r.match(/^[<,]/)?(i.soyState.push("param-type"),null):(r.next(),null);case"param-type-template":return r.match(/[>]/)?(i.soyState.pop(),i.soyState.push("param-type"),null):r.match(/^\w+/)?(i.soyState.push("param-type"),"def"):(r.next(),null);case"var-def":return(S=r.match(/^\$([\w]+)/))?(i.variables=p(i.variables,S[1]),i.soyState.pop(),"def"):(r.next(),null);case"for-loop":return r.match(/\bin\b/)?(i.soyState.pop(),"keyword"):"$"==r.peek()?(i.soyState.push("var-def"),null):(r.next(),null);case"record-literal":return r.match(/^[)]/)?(i.soyState.pop(),null):r.match(/[(,]/)?(i.soyState.push("map-value"),i.soyState.push("record-key"),null):(r.next(),null);case"map-literal":return r.match(/^[)]/)?(i.soyState.pop(),null):r.match(/[(,]/)?(i.soyState.push("map-value"),i.soyState.push("map-value"),null):(r.next(),null);case"list-literal":return r.match("]")?(i.soyState.pop(),i.lookupVariables=!0,c(i),null):r.match(/\bfor\b/)?(i.lookupVariables=!0,i.soyState.push("for-loop"),"keyword"):d(r,i);case"record-key":return r.match(/[\w]+/)?"property":r.match(/^[:]/)?(i.soyState.pop(),null):(r.next(),null);case"map-value":return")"==r.peek()||","==r.peek()||r.match(/^[:)]/)?(i.soyState.pop(),null):d(r,i);case"import":return r.eat(";")?(i.soyState.pop(),i.indent-=2*e.indentUnit,null):r.match(/\w+(?=\s+as)/)?"variable":(S=r.match(/\w+/))?/(from|as)/.test(S[0])?"keyword":"def":(S=r.match(/^["']/))?(i.soyState.push("string"),i.quoteKind=S[0],"string"):(r.next(),null);case"tag":void 0===i.tag?(k=!0,E=""):E=(k="/"==i.tag[0])?i.tag.substring(1):i.tag;var g=a[E];if(r.match(/^\/?}/)){var x="/}"==r.current();return x&&!k&&c(i),"/template"==i.tag||"/deltemplate"==i.tag?(i.variables=p(null,"ij"),i.indent=0):i.indent-=e.indentUnit*(x||-1==n.indexOf(i.tag)?2:1),i.soyState.pop(),"keyword"}if(r.match(/^([\w?]+)(?==)/)){if(i.context&&i.context.tag==E&&"kind"==r.current()&&(S=r.match(/^="([^"]+)/,!1))){var b=S[1];i.context.kind=b;var v=o[b]||o.html;(C=s(i.localStates)).mode.indent&&(i.indent+=C.mode.indent(C.state,"","")),i.localStates.push({mode:v,state:t.startState(v)})}return"attribute"}return d(r,i);case"template-call-expression":return r.match(/^([\w-?]+)(?==)/)?"attribute":r.eat(">")||r.eat("/>")?(i.soyState.pop(),"keyword"):d(r,i);case"literal":return r.match("{/literal}",!1)?(i.soyState.pop(),this.token(r,i)):l(r,i,/\{\/literal}/);case"export":if(S=r.match(/\w+/)){if(i.soyState.pop(),"const"==S)return i.soyState.push("const-def"),"keyword";if("extern"==S)return i.soyState.push("param-def"),"keyword"}else r.next();return null;case"const-def":return r.match(/^\w+/)?(i.soyState.pop(),"def"):(r.next(),null)}if(r.match("{literal}"))return i.indent+=e.indentUnit,i.soyState.push("literal"),i.context=new m(i.context,"literal",i.variables),"keyword";if(S=r.match(/^\{([/@\\]?\w+\??)(?=$|[\s}]|\/[/*])/)){var w=i.tag;i.tag=S[1];var k="/"==i.tag[0],T=!!a[i.tag],E=k?i.tag.substring(1):i.tag;g=a[E],"/switch"!=i.tag&&(i.indent+=((k||g&&g.reduceIndent)&&"switch"!=w?1:2)*e.indentUnit),i.soyState.push("tag");var I=!1;if(g)if(k||g.soyState&&i.soyState.push(g.soyState),g.noEndTag||!T&&k){if(k){var U="extern"==E&&i.context&&"export"==i.context.tag;if(!i.context||i.context.tag!=E&&!U)I=!0;else if(i.context){var C;i.context.kind&&(i.localStates.pop(),(C=s(i.localStates)).mode.indent&&(i.indent-=C.mode.indent(C.state,"",""))),c(i)}}}else i.context=new m(i.context,i.tag,g.variableScope?i.variables:null);else k&&(I=!0);return(I?"error ":"")+"keyword"}return r.eat("{")?(i.tag="print",i.indent+=2*e.indentUnit,i.soyState.push("tag"),"keyword"):!i.context&&r.match(/\bimport\b/)?(i.soyState.push("import"),i.indent+=2*e.indentUnit,"keyword"):(S=r.match("<{"))?(i.soyState.push("template-call-expression"),i.indent+=2*e.indentUnit,i.soyState.push("tag"),"keyword"):(S=r.match("</>"))?(i.indent-=1*e.indentUnit,"keyword"):l(r,i,/\{|\s+\/\/|\/\*/)},indent:function(a,n,r){var o=a.indent,l=s(a.soyState);if("comment"==l)return t.Pass;if("literal"==l)/^\{\/literal}/.test(n)&&(o-=e.indentUnit);else{if(/^\s*\{\/(template|deltemplate)\b/.test(n))return 0;/^\{(\/|(fallbackmsg|elseif|else|ifempty)\b)/.test(n)&&(o-=e.indentUnit),"switch"!=a.tag&&/^\{(case|default)\b/.test(n)&&(o-=e.indentUnit),/^\{\/switch\b/.test(n)&&(o-=e.indentUnit)}var i=s(a.localStates);return o&&i.mode.indent&&(o+=i.mode.indent(i.state,n,r)),o},innerMode:function(t){return t.soyState.length&&"literal"!=s(t.soyState)?null:s(t.localStates)},electricInput:/^\s*\{(\/|\/template|\/deltemplate|\/switch|fallbackmsg|elseif|else|case|default|ifempty|\/literal\})$/,lineComment:"//",blockCommentStart:"/*",blockCommentEnd:"*/",blockCommentContinue:" * ",useInnerComments:!1,fold:"indent"}}),"htmlmixed"),t.registerHelper("wordChars","soy",/[\w$]/),t.registerHelper("hintWords","soy",Object.keys(a).concat(["css","debugger"])),t.defineMIME("text/x-soy","soy")}(a(3668),a(2373))}}]);
//# sourceMappingURL=8595.0fd8a5d9.chunk.js.map