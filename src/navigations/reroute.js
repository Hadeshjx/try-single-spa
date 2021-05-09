import { getAppChanges } from "../applications/app";
import { started } from "../start";

// 核心应用处理方法
export function reroute(){

    // 需要获取要加载的应用
    // 需要获取要被挂载的应用
    // 哪些应用需要被卸载

    const {appsToLoad,appsToMount,appsToUnmount}= getAppChanges()
    console.log(appsToLoad,appsToMount,appsToUnmount)

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

    }
    async function preformAppChanges(){ // 根据路径来装载应用

    }
}