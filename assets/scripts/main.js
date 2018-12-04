cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.director.setDisplayStats(true);
        cc.res = {};
        cc.loader.loadResDir("waybill",cc.SpriteFrame,(err,res,urls)=>{
            // cc.log(err,res,urls)
            let i = 0
            for (const url of urls) {
                cc.res[url] = res[i]
                i++
            }
            cc.loader.loadResDir("prefabs/wayBill",(err,res,urls)=>{
                cc.log(err,res,urls)
                let i = 0
                for (const url of urls) {
                    cc.res[url] = res[i]
                    i++
                }
                let prefab = cc.res['prefabs/wayBill/WayBillView']
                if (prefab) {
                    var view = cc.instantiate(prefab)
                    view.parent = this.node
                    view.getComponent("WayBillView").clear()
                }
            });
            
        });
    },

    start () {

    },

    // update (dt) {},
});
