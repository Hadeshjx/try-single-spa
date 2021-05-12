import {MOUNTED, MOUNTING, NOT_MOUNTED} from "../applications/app.helpers";

export async function toMountPromise(app) {
    if(app.status!== NOT_MOUNTED){ // 没有启动过
        return app
    }
    app.status = MOUNTING
    await app.mount(app.customPrpos)
    app.status = MOUNTED
    return app
}