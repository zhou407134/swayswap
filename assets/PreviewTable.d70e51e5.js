import{w as h,u as i,j as c,s as o,b as t}from"./index.c46161c3.js";globalThis.jotaiAtomCache=globalThis.jotaiAtomCache||{cache:new Map,get(e,a){return this.cache.has(e)?this.cache.get(e):(this.cache.set(e,a),a)}};function l(){const e=i();return h("PoolPage-poolInfo",()=>e?.dryRun.get_info())}globalThis.jotaiAtomCache=globalThis.jotaiAtomCache||{cache:new Map,get(e,a){return this.cache.has(e)?this.cache.get(e):(this.cache.set(e,a),a)}};const n=({title:e,value:a,className:s})=>c("div",{className:o("flex",s),children:[t("div",{children:e}),t("div",{className:"flex-auto text-right",children:a})]}),x=({title:e,children:a,className:s})=>c("div",{className:o(s),children:[e&&t("div",{className:"px-2 text-sm text-gray-50 mb-2",children:e}),t("div",{className:"flex flex-col gap-2 px-3 py-3 text-xs sm:text-sm text-gray-100 bg-gray-700 rounded-xl",children:a})]});export{x as P,n as a,l as u};