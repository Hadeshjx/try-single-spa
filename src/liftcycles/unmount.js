import {MOUNTED, NOT_MOUNTED, UNMOUNTING} from "../applications/app.helpers";

export async function toUnmountPromise(app){
    // 当前应用没有被挂载直接什么都不做了
    if(app.status != MOUNTED){
        return app
    }
    app.status = UNMOUNTING
    await app.unmount(app.customPrpos)
    app.status = NOT_MOUNTED
    return app
}