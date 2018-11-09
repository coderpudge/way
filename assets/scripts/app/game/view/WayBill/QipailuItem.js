var BaseObj = require("BaseObj")
cc.Class({
    extends: BaseObj,

    properties: {
        
    },

    onLoad: function () {

    },

    //data: {state_list: [1], points: 9}
    setData: function (data) {
        this.data = data
        data.state_list.sort()
        this.find("zd").node.active = false
        this.find("xd").node.active = false
        if (-1 != data.state_list.indexOf(1)) {
            // this.find("txtName").string = "庄"
            this.find("bg").spriteFrame = cc.res["waybill/zhuang"]
        }
        if (-1 != data.state_list.indexOf(2)) {
            // this.find("txtName").string = "闲"
            this.find("bg").spriteFrame = cc.res["waybill/xian"]
        }
        if (-1 != data.state_list.indexOf(3)) {
            // this.find("txtName").string = "和"
            this.find("bg").spriteFrame = cc.res["waybill/he"]
        }
        //庄对
        if (-1 != data.state_list.indexOf(4)) {
            this.find("zd").node.active = true
        }
        //闲对
        if (-1 != data.state_list.indexOf(5)) {
            this.find("xd").node.active = true
        }
        // var str = ""
        // for (var k in data.state_list) {
        //     //过滤 6，7（天牌）
        //     if (data.state_list[k] <= 5) {
        //         str += data.state_list[k]
        //     }
        // }
        // this.find("bg").spriteFrame = cc.res["qipailu/qipailu" + str]
    },
});
