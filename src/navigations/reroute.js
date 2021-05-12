import { getAppChanges } from "../applications/app";
import { started } from "../start";
import {toLoadPromise} from "../liftcycles/load";
import {toUnmountPromise} from "../liftcycles/unmount";
import {toBootstrapPromise} from "../liftcycles/bootstrap";
import {toMountPromise} from "../liftcycles/mount";
import './navigator-events'


// 核心应用处理方法
export function reroute(){

    // 需要获取要加载的应用
    // 需要获取要被挂载的应用
    // 哪些应用需要被卸载

    const {appsToLoad,appsToMount,appsToUnmount}= getAppChanges()
    console.log(appsToLoad,appsToMount,appsToUnmount)

    // starte方法调用时是同步的，但是加载流程是异步的
    if(started){
        // app装载
        // console.log('调用start方法')
        return preformAppChanges() 
    }else{
        // 注册应用时 需要预先加载
        // console.log('调用register')
        return  loadApps()
    }

    async function loadApps(){// 预先加载应用
        let apps = await Promise.all(appsToLoad.map(toLoadPromise)) // 就是获取到bootstrap,mount,ummount方法放到app上
        console.log('apps',apps)
    }
    async function preformAppChanges(){ // 根据路径来装载应用
        // 先卸载不需要的应用
        let unmountPromises = appsToUnmount.map(toUnmountPromise) // 需要去卸载的app

        // 去加载需要的应用
        // 这个应用可能需要加载 但是路径不匹配 加载app1的时候，这个时候切换到了 app2
        appsToLoad.map(async (app)=>{ // 将需要加载的应用拿到=> 加载 => 启动 => 挂载
            app = await toLoadPromise(app)
            app = await toBootstrapPromise(app)
            return toMountPromise(app)
        })
        appsToMount.map(async (app)=>{
            app = await toBootstrapPromise(app)
            return toMountPromise(app)
        })
    }

    // 这个流程是用于初始化操作，还需要单路径切换时重新加载应用
    // 重写路由相关的方法


}