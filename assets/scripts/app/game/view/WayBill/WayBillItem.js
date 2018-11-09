var BaseObj = require("BaseObj")
cc.Class({
    extends: BaseObj,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},
    init(target,data,inx){
        this.target = target;
        this.data = data;
        this.find("item_txtJushu").string = "局数:" + data.jushu
        this.find("item_txtZhuang").string = "庄:" + data.zhuang
        this.find("item_txtXian").string = "闲:" + data.xian
    },

    onPreView(){
        this.target.preView(this.data.wayBill);
    },

    start () {

    },

    // update (dt) {},
});
