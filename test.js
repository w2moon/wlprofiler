let deferred = [];
let valid = true;
function defer(fn){
    deferred.push(fn)
}
function flush(){
    let q = deferred.slice();
    deferred.length = 0;
    q.forEach(fn=>fn());
}
function reset(){
    flush();
}

var scenes = [{k:1,d:2},{k:2,d:3}];

async function selector(defer,scenes){
    let comp;
    let p = new Promise(resolve=>{
        setTimeout(function(){
            resolve(123);
        },3)
    })
    function close(){
        console.log("close");
    }
    defer(close);
    return await p;
}

let busy = false;
function ready(){
    busy = true;
    defer(_=>busy=false);
}
ready();
let scene = "aaa";
async function test(){
while(busy){
    let fn = scenes[0];
    if(typeof(fn)=='function'){
        fn(defer);
    }
    scene = await selector(defer,scenes)
    reset()
    ready()
}

}

test();