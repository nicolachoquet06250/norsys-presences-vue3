(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d6d35"],{"73cf":function(e,t,l){"use strict";l.r(t);var s=l("ade3"),c=l("7a23"),a=Object(c["H"])("data-v-37854b41");Object(c["v"])("data-v-37854b41");var o={class:"alerts container"},n={class:"row"},r={key:0,class:"col-12"},i={class:"container-fluid mt-2"},d={class:"row"},u={class:"col-12 col-md-6 mb-2"},b={class:"form-floating"},p={id:"firstname",ref:"firstname",type:"text",placeholder:"Prénom",class:"form-control"},m=Object(c["g"])("label",{for:"firstname"},"Prénom",-1),j=Object(c["g"])("div",{class:"col-12"},null,-1),f={class:"col-12 col-md-6 mb-2"},g={class:"form-floating"},O={id:"lastname",ref:"lastname",type:"text",placeholder:"Nom de famille",class:"form-control"},v=Object(c["g"])("label",{for:"lastname"},"Nom de famille",-1),w=Object(c["g"])("div",{class:"col-12"},null,-1),h={class:"col-12 col-md-6 mb-2"},y={class:"form-floating"},x={id:"password-1",ref:"password",type:"password",placeholder:"mot de passe",class:"form-control"},k=Object(c["g"])("label",{for:"password-1"},"Mot de passe",-1),_=Object(c["g"])("div",{class:"col-12"},null,-1),C={class:"col-12 col-md-6 mb-2"},T={class:"form-floating"},J={id:"password-2",ref:"password2",type:"password",placeholder:"confirmer le mot de passe",class:"form-control"},N=Object(c["g"])("label",{for:"password-2"},"Confirmation du mot de passe",-1),q={type:"hidden",id:"agency",ref:"agency",value:"1"},G=Object(c["g"])("div",{class:"col-12"},null,-1),P={class:"col-12 col-md-2 mb-2"},S={class:"col-12 col-md-3 mb-2"};Object(c["t"])();var D=a((function(e,t,l,a,D,H){return Object(c["s"])(),Object(c["d"])(c["a"],null,[Object(c["g"])("div",o,[Object(c["g"])("div",n,[a.alert.show?(Object(c["s"])(),Object(c["d"])("div",r,[Object(c["g"])("div",{class:Object(s["a"])({alert:!0},"alert-".concat(a.alert.type),!0),role:"alert"},Object(c["C"])(a.alert.text),3)])):Object(c["e"])("",!0)])]),Object(c["g"])("div",i,[Object(c["g"])("form",d,[Object(c["g"])("div",u,[Object(c["g"])("div",b,[Object(c["g"])("input",p,null,512),m])]),j,Object(c["g"])("div",f,[Object(c["g"])("div",g,[Object(c["g"])("input",O,null,512),v])]),w,Object(c["g"])("div",h,[Object(c["g"])("div",y,[Object(c["g"])("input",x,null,512),k])]),_,Object(c["g"])("div",C,[Object(c["g"])("div",T,[Object(c["g"])("input",J,null,512),N])]),Object(c["g"])("input",q,null,512),G,Object(c["g"])("div",P,[Object(c["g"])("button",{type:"submit",class:"btn btn-success",onClick:t[1]||(t[1]=Object(c["G"])((function(){return a.register&&a.register.apply(a,arguments)}),["prevent","stop"]))}," S'inscrire ")]),Object(c["g"])("div",S,[Object(c["g"])("button",{type:"button",id:"alereay-account",class:"btn btn-info",onClick:t[2]||(t[2]=Object(c["G"])((function(e){return a.go_to("/login")}),["prevent","stop"]))}," Déjà un compte ? ")])])])],64)})),H=(l("d3b7"),l("6c02")),I=l("4360"),L={name:"Register",setup:function(){var e="https://norsys-sophia-presence.nicolaschoquet.fr/api",t=Object(H["c"])(),l=Object(I["d"])(),s=l.show_loader,a=l.hide_loader,o=Object(c["x"])(null),n=Object(c["x"])(null),r=Object(c["x"])(null),i=Object(c["x"])(null),d=Object(c["x"])(null),u=Object(c["x"])({text:"",type:"",show:!1});return{firstname:o,lastname:n,password:r,password2:i,agency:d,alert:u,go_to:function(e){t.push(e)},register:function(){if(r.value.value===i.value.value)s(),fetch("".concat(e,"/user/register"),{method:"post",body:JSON.stringify({firstname:o.value.value,lastname:n.value.value,password:r.value.value,agency:d.value.value})}).then((function(e){return e.json()})).then((function(e){if(e.error){u.value={text:e.message,type:"danger",show:!0};var l=setTimeout((function(){u.value.show=!1,clearTimeout(l)}),4e3)}else t.push("/login");a()}));else{u.value={text:"Les 2 mots de passes ne sont pas identiques",type:"danger",show:!0};var l=setTimeout((function(){u.value.show=!1,clearTimeout(l)}),4e3)}}}}};L.render=D,L.__scopeId="data-v-37854b41";t["default"]=L}}]);
//# sourceMappingURL=chunk-2d0d6d35.e567235d.js.map