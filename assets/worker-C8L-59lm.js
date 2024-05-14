this.document={currentScript:{src:this.location.href}},function(){"use strict";(async()=>{var A="https://meowtec.github.io/hash-tool/assets/hash_tool_bg-DmnYnH3V.wasm",S=async(t={},e)=>{let n;if(e.startsWith("data:")){const s=e.replace(/^data:.*?base64,/,"");let a;if(typeof Buffer=="function"&&typeof Buffer.from=="function")a=Buffer.from(s,"base64");else if(typeof atob=="function"){const o=atob(s);a=new Uint8Array(o.length);for(let r=0;r<o.length;r++)a[r]=o.charCodeAt(r)}else throw new Error("Cannot decode base64-encoded data URL");n=await WebAssembly.instantiate(a,t)}else{const s=await fetch(e),a=s.headers.get("Content-Type")||"";if("instantiateStreaming"in WebAssembly&&a.startsWith("application/wasm"))n=await WebAssembly.instantiateStreaming(s,t);else{const o=await s.arrayBuffer();n=await WebAssembly.instantiate(o,t)}}return n.instance.exports};let i;function L(t){i=t}const B=typeof TextDecoder>"u"?(0,module.require)("util").TextDecoder:TextDecoder;let y=new B("utf-8",{ignoreBOM:!0,fatal:!0});y.decode();let f=null;function l(){return(f===null||f.byteLength===0)&&(f=new Uint8Array(i.memory.buffer)),f}function E(t,e){return t=t>>>0,y.decode(l().subarray(t,t+e))}let h=0;const R=typeof TextEncoder>"u"?(0,module.require)("util").TextEncoder:TextEncoder;let u=new R("utf-8");const U=typeof u.encodeInto=="function"?function(t,e){return u.encodeInto(t,e)}:function(t,e){const n=u.encode(t);return e.set(n),{read:t.length,written:n.length}};function z(t,e,n){if(n===void 0){const _=u.encode(t),d=e(_.length,1)>>>0;return l().subarray(d,d+_.length).set(_),h=_.length,d}let s=t.length,a=e(s,1)>>>0;const o=l();let r=0;for(;r<s;r++){const _=t.charCodeAt(r);if(_>127)break;o[a+r]=_}if(r!==s){r!==0&&(t=t.slice(r)),a=n(a,s,s=r+t.length*3,1)>>>0;const _=l().subarray(a+r,a+s),d=U(t,_);r+=d.written,a=n(a,s,r,1)>>>0}return h=r,a}function k(t,e){const n=e(t.length*1,1)>>>0;return l().set(t,n/1),h=t.length,n}let g=null;function p(){return(g===null||g.byteLength===0)&&(g=new Int32Array(i.memory.buffer)),g}function x(t,e){return t=t>>>0,l().subarray(t/1,t/1+e)}const C=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(t=>i.__wbg_hashdigest_free(t>>>0));class D{__destroy_into_raw(){const e=this.__wbg_ptr;return this.__wbg_ptr=0,C.unregister(this),e}free(){const e=this.__destroy_into_raw();i.__wbg_hashdigest_free(e)}constructor(e){const n=z(e,i.__wbindgen_malloc,i.__wbindgen_realloc),s=h,a=i.hashdigest_new(n,s);return this.__wbg_ptr=a>>>0,this}update(e){const n=k(e,i.__wbindgen_malloc),s=h;i.hashdigest_update(this.__wbg_ptr,n,s)}finalize(){try{const a=this.__destroy_into_raw(),o=i.__wbindgen_add_to_stack_pointer(-16);i.hashdigest_finalize(o,a);var e=p()[o/4+0],n=p()[o/4+1],s=x(e,n).slice();return i.__wbindgen_free(e,n*1,1),s}finally{i.__wbindgen_add_to_stack_pointer(16)}}}function K(t,e){throw new Error(E(t,e))}URL=globalThis.URL;const c=await S({"./hash_tool_bg.js":{__wbindgen_throw:K}},A),M=c.memory,W=c.__wbg_hashdigest_free,v=c.hashdigest_new,I=c.hashdigest_update,O=c.hashdigest_finalize,j=c.__wbindgen_malloc,q=c.__wbindgen_realloc,F=c.__wbindgen_add_to_stack_pointer,N=c.__wbindgen_free;var P=Object.freeze({__proto__:null,__wbg_hashdigest_free:W,__wbindgen_add_to_stack_pointer:F,__wbindgen_free:N,__wbindgen_malloc:j,__wbindgen_realloc:q,hashdigest_finalize:O,hashdigest_new:v,hashdigest_update:I,memory:M});L(P);const G=(t,e)=>({isTaskMessage:!0,type:t,data:e});class H{constructor(e){this.data=e}get byteLength(){return this.data.byteLength}read(e,n){const s=Math.min(n,this.byteLength-e);return Promise.resolve(new Uint8Array(this.data.buffer,this.data.byteOffset+e,this.data.byteOffset+e+s))}}class V{constructor(e){this.data=e}get byteLength(){return this.data.size}async read(e,n){const s=await this.data.slice(e,e+n).arrayBuffer();return new Uint8Array(s)}}function b(t,e){globalThis.postMessage(G(t,e))}const Y=1024*1024*8,w=new Set;function m(t){w.delete(t)}async function Z({type:t,data:e,id:n}){const s=performance.now(),a=new D(t),o=e instanceof Blob?new V(e):new H(e),{byteLength:r}=o;let _=0;for(w.add(n);_<r;){if(!w.has(n)){b("TASK_RESULT",{id:n,success:!1,error:"Task cancel"});return}const T=await o.read(_,Y);a.update(T),_+=T.byteLength,b("TASK_PROGRESS",{id:n,processedBytes:_,totalBytes:r})}const d=a.finalize();m(n),b("TASK_RESULT",{id:n,hash:d,success:!0,totalBytes:r,timing:performance.now()-s})}globalThis.onmessage=t=>{if(!t.data?.isTaskMessage)return;const e=t.data;e.type==="TASK_ADD"&&Z(e.data).catch(n=>{b("TASK_RESULT",{id:e.data.id,success:!1,error:String(n)})}),e.type==="TASK_CANCEL"&&m(e.data.id)},globalThis.postMessage("INIT")})()}();
