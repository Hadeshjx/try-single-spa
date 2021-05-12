import { reroute } from "../navigations/reroute"
import { BOOTSTRAPPING, LOADING_SOURCE_CODE, MOUNTED, NOT_BOOTSTRAPPED, NOT_LOADED, NOT_MOUNTED, shouldBeActive, SKIP_BECAUSE_BROKEN } from "./app.helpers"

const apps = [] // 用来存放所有的应用
/**
 * 维护应用所有的状态 状态机
 * @param {*} appName 应用名字
 * @param {*} loadApp 加载的应用
 * @param {*} activeWhen 当激活时会调用 loadApp
 * @param {*} customPrpos 自定义属性
 */
export function registerApplication(appName,loadApp,activeWhen,customPrpos){
    apps.push({ // 这里就将应用注册好了
        name: appName,
        loadApp,
        activeWhen,
        customPrpos,
        status: NOT_LOADED
    })
    reroute() // 加载应用
}

export function getAppChanges(){
    const appsToUnmount = [] // 要卸载的app
    const appsToLoad = [] // 要加载的app
    const appsToMount = [] // 需要挂载的

    apps.forEach(app=>{
        // 需不需要被加载
        const appShouldBeActive = app.status !== SKIP_BECAUSE_BROKEN && shouldBeActive(app)
        switch (app.status) {
            case NOT_LOADED:
            case LOADING_SOURCE_CODE:
                if(appShouldBeActive){
                    appsToLoad.push(app)
                }
                break    

            case NOT_BOOTSTRAPPED:
            case BOOTSTRAPPING:    
            case NOT_MOUNTED:    
                if(appShouldBeActive){
                    appsToMount.push(app)
                }
                break    
            case MOUNTED:
                if(!appShouldBeActive){
                    appsToUnmount.push(app)
                }    
                break
            default:
                break
        }
    })
    return {appsToUnmount,appsToLoad,appsToMount}
}