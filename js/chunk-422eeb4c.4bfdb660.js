(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-422eeb4c"],{"0405":function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("d2-container",[a("el-tabs",{attrs:{type:"border-card"}},e._l(e.configuration,(function(t,n){return a("el-tab-pane",{key:n,attrs:{label:t.name,type:t.type}},["消息模版设置"==t.name?a("div",{staticClass:"messageConfig"},[a("div",{staticClass:"placeholderList"},[a("el-card",{staticClass:"box-card"},[a("h3",[e._v("占位符模板")]),e._l(e.placeholderList,(function(t,n){return a("div",{key:n,staticClass:"text item"},[e._v(" "+e._s(t.name)+"："+e._s(t.value)+" ")])}))],2)],1),a("div",{staticClass:"messageConfigWrap"},e._l(t.values,(function(t,n){return a("div",{key:n,staticClass:"messageConfigItem"},[a("p",[e._v(e._s(t.name))]),"textarea"==t.type?a("el-input",{attrs:{autosize:{minRows:10,maxRows:16},type:"textarea",rows:2,placeholder:t.name},model:{value:t.default,callback:function(a){e.$set(t,"default",a)},expression:"value.default"}}):e._e()],1)})),0)]):e._l(t.values,(function(t,n){return a("div",{key:n,staticClass:"form-item"},[a("span",{staticStyle:{width:"220px","text-align":"right"}},[e._v(e._s(t.name))]),"input"==t.type?a("el-input",{attrs:{placeholder:t.name},model:{value:t.default,callback:function(a){e.$set(t,"default",a)},expression:"value.default"}}):e._e(),"radio"==t.type?a("el-radio-group",{model:{value:t.default,callback:function(a){e.$set(t,"default",a)},expression:"value.default"}},e._l(t.option,(function(t,n){return a("el-radio",{key:n,attrs:{label:n}},[e._v(e._s(t))])})),1):e._e(),"select"==t.type?a("el-select",{attrs:{placeholder:t.name},model:{value:t.default,callback:function(a){e.$set(t,"default",a)},expression:"value.default"}},e._l(t.option,(function(e){return a("el-option",{key:e.value,attrs:{label:e.label,value:e.value}})})),1):e._e(),"textarea"==t.type?a("el-input",{attrs:{type:"textarea",rows:2,placeholder:t.name},model:{value:t.default,callback:function(a){e.$set(t,"default",a)},expression:"value.default"}}):e._e()],1)})),a("el-button",{staticClass:"submit-button",attrs:{type:"primary"},on:{click:function(a){return e.submit(t)}}},[e._v("提交")])],2)})),1)],1)},i=[],s=(a("a4d3"),a("e01a"),a("d28b"),a("4de4"),a("d3b7"),a("3ca3"),a("466d"),a("ddb0"),{name:"ConfigSystem",data:function(){return{configuration:[],htmlItem:"",placeholderList:[],apiUrl:window.apiObj.ApiUrl}},mounted:function(){this.getConfig(),this.getMessageConfig()},methods:{getConfig:function(){var e=this;this.$axios.post("/v1/admin/settings/get",{}).then((function(t){e.configuration=t.data}))},submit:function(e){var t=this,a={};a.type=e.type;var n=!0,i=!0,s=!1,l=void 0;try{for(var r,o=e.values[Symbol.iterator]();!(i=(r=o.next()).done);i=!0){var u=r.value;if("url"==u.filter){if(n=this.functionisURL(u.default),!n){this.$message.error("请输入有效的验证地址");break}}else if("all"==u.filter){if(n=u.default.length>0,!n){this.$message.error("输入的数据不能为空");break}}else if("email"==u.filter){if(n=this.functionisEmail(u.default),!n){this.$message.error("输入的邮箱格式不正确");break}}else if("int"==u.filter&&(n=this.functionisInt(u.default),!n)){this.$message.error("请输入整数型的字符串");break}a[u.key]=u.default}}catch(c){s=!0,l=c}finally{try{i||null==o.return||o.return()}finally{if(s)throw l}}n&&this.$axios.post("/v1/admin/settings/set",a).then((function(e){t.$message.success("提交成功")}))},functionisURL:function(e){return!!e.match(/(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g)},functionisEmail:function(e){var t=/^[\w.-]+@([1-9]|[a-z]|[A-Z])+(\.[A-Za-z]{2,4}){1,2}$/;return t.test(e)},functionisInt:function(e){var t=/^\d+$/;return t.test(e)},getMessageConfig:function(){var e=this;this.$axios.post("/v1/admin/settings/get",{}).then((function(t){e.placeholderList=t.data.placeholder}))}}}),l=s,r=(a("9f4f"),a("2877")),o=function(e){e.options.__source="src/views/systemConfig/configSystem.vue"},u=o,c=Object(r["a"])(l,n,i,!1,null,"587eb171",null);"function"===typeof u&&u(c);t["default"]=c.exports},"9f4f":function(e,t,a){"use strict";var n=a("d07d"),i=a.n(n);i.a},d07d:function(e,t,a){}}]);