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
        let model = this.analysisData(data);
        this.find("item_txtJushu").string = "局数:" + model.jushu
        this.find("item_txtZhuang").string = "庄:" + model.zhuang
        this.find("item_txtXian").string = "闲:" + model.xian
    },

    onPreView(){
        this.target.preView(this.data);
    },

    start () {

    },
    analysisData(itemData){
        var zhuang, xian, he, tianpai, zhuangdui, xiandui
        zhuang = xian = he = tianpai = zhuangdui = xiandui = 0
        for (var i = 0; i < itemData.length; i++) {
            var data = itemData[i]
            // if (data.points == 8 || data.points == 9) {
            //     tianpai++
            // }
            if (-1 != data.state_list.indexOf(6) || -1 != data.state_list.indexOf(7)) {
                tianpai++
            }
            if (-1 != data.state_list.indexOf(1)) {
                zhuang++
            }
            if (-1 != data.state_list.indexOf(2)) {
                xian++
            }
            if (-1 != data.state_list.indexOf(3)) {
                he++
            }
            if (-1 != data.state_list.indexOf(4)) {
                zhuangdui++
            }
            if (-1 != data.state_list.indexOf(5)) {
                xiandui++
            }
        }

        let model = {};
        model.jushu = itemData.length
        model.zhuang = zhuang
        model.xian = xian
        model.he = he
        model.tian = tianpai
        model.zhuangdui = zhuangdui
        model.xiandui = xiandui
        // model.wayBill = [];
        // model.wayBill = this.wayData;
        // for (const item of this.wayData) {
        //     model.wayBill.push((item))
        // }
        return model;
    },

    // update (dt) {},
});
