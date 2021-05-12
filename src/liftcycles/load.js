import {LOADING_SOURCE_CODE, NOT_BOOTSTRAPPED} from "../applications/app.helpers";

function flattenFnArray(fns){
    fns = Array.isArray(fns) ? fns : [fns]
    /*
    return function(props){
        //=> Promise.resolve().then(() => fn1(props)).then(()=> fn2(props))
        return fns.reduce(
            (p,fn) => p.then(() => fn(props)),
            Promise.resolve()
        )
    }
    上述，简化成以下形式：
    */
    return (props) => fns.reduce((p,fn) => p.then(() => fn(props)), Promise.resolve()) // 通过promise链来链式调用 多个方法组合成一个方法
}

export async function toLoadPromise(app){
    if(app.loadPromise){
        return app.loadPromise // 缓存机制
    }

    return (app.loadPromise = Promise.resolve().then(async ()=>{
        app.status = LOADING_SOURCE_CODE
        let {bootstrap,mount,unmount} = await app.loadApp(app.customPrpos)
        app.status = NOT_BOOTSTRAPPED // 没有调用bootstap方法
        // 希望将多个 promise 组合在一起 compose
        app.bootstrap = flattenFnArray(bootstrap)
        app.mount = flattenFnArray(mount)
        app.unmount = flattenFnArray(unmount)
        delete app.loadPromise
        return app
    }))
}