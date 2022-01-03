const access = {} 

export default function formatAccess(routers) {
    //簡單檢查是否是可以處理的數據
    if (!(routers instanceof Array)) {
        return false;
    }
    //處理後的容器
    routers.forEach(({ id, assets, apis }) => {
        //遞歸處理
        if (assets && assets instanceof Array) {
            assets = formatAccess(assets);
        }

        if ( id && apis && apis.length)
            access[id] = apis.filter( api => api.checked === 1).map( api => api.method)
    });
    return access;
}
