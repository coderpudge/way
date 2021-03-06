var BaseView = require("BaseView")
var BigwayData = require("WayBillData").BigwayData

import {
    ListView
} from "listview"

cc.Class({
    extends: BaseView,

    properties: {
        moduleName: {
            override: true,
            default: "WayBill",
            visible: false,
        },

    },

    onLoad: function () {
        this._super()
        this.initAd();
        this.initAnalytics();
        // this.getDeviceId();
        // this._data_saveName = 'way_bill_data'+ Math.ceil(Math.random() * 1000 )
        this._data_saveName = 'way_bill_data' + 10
        this._data_lastUploadLength = "way_bill_data_last_Length";
        this.isPreView = false; //是否预览;
        this.isWayOver = true;
        this.storageWayData = [];
        this.readData();
        this.scrollview = this.find("historyList").getComponent(cc.ScrollView);
        this.mask = this.scrollview.node.getChildByName("view");
        this.content = this.mask.getChildByName('content');
        this.item_tpl = this.find('tplItem').node

        this.list = new ListView({
            scrollview: this.scrollview,
            mask: this.mask,
            content: this.content,
            item_tpl: this.item_tpl,
            cb_host: this,
            item_setter: this.list_item_setter,
            select_cb: this.list_item_onselect,
            recycle_cb: this.list_item_onrecycle,
            column: 1,
            gap_y: 10,
            direction: 1,
            // height:this.mask.height + this.item_tpl.height,
        });
        let showData = this.storageWayData.slice(-8);
        this.list.set_data(showData);



        for (var i = 0; i < 3; i++) {
            this.find("imgZhuang" + i).node.active = false
            this.find("imgXian" + i).node.active = false
        }
        this.find("txtJushu").string = "局数:0"
        // this.find("txtZhuang").string = "0"
        // this.find("txtXian").string = "0"
        // this.find("txtHe").string = "0"
        // this.find("txtTian").string = "0"
        // this.find("txtZhuangdui").string = "0"
        // this.find("txtXiandui").string = "0"

        this.find("txtZhuang").string = "庄:" + 0
        this.find("txtXian").string = "闲:" + 0
        this.find("txtHe").string = "和:" + 0
        this.find("txtTian").string = "天牌:" + 0
        this.find("txtZhuangdui").string = "庄对:" + 0
        this.find("txtXiandui").string = "闲对:" + 0
    },

    list_item_setter(item, data, index) {
        cc.log("item set", data, index);
        let com = item.getComponent("WayBillItem");
        com.init(this, data, index);

    },

    clear: function name() {
        this.find("contentQiPaiLu").getChildByName("layout_qipailu").removeAllChildren()
        this.find("contentThirdQiPaiLu").getChildByName("layout_thirdQiPaiLu").removeAllChildren()
        this.find("contentBigWay").getChildByName("layout_bigway").removeAllChildren()
        this.find("contentBigEyeWay").getChildByName("layout_bigeyeway").removeAllChildren()
        this.find("contentSmallWay").getChildByName("layout_smallway").removeAllChildren()
        this.find("contentSmQiangWay").getChildByName("layout_smqiangway").removeAllChildren()
    },

    setData: function (chess_cards_way_list, isWen = false) {
        // this.wayData = chess_cards_way_list
        // this.wayData = clone(chess_cards_way_list)
        this.clear()
        this.initQiPaiLuView(chess_cards_way_list)
        this.initThirdQiPaiLuView();
        this.initBigWayView()
        this.initBigEyeWayView()
        this.initSmallWayView()
        this.initSmQiangWayView()
        // this.initForecastView(clone(chess_cards_way_list))

        if (!isWen) {
            this.initTotalView();
        } else {
            this.blink();
        }
        // cc.eventMgr.emit("onWayBillPreviewSetData", this.qipailuData)
    },

    blink() {

        let qipai = this.find("contentQiPaiLu").getChildByName("layout_qipailu");
        let thirdQiPai = this.find("contentThirdQiPaiLu").getChildByName("layout_thirdQiPaiLu")
        let bigway = this.find("contentBigWay").getChildByName("layout_bigway")
        let bigeyeway = this.find("contentBigEyeWay").getChildByName("layout_bigeyeway")
        let smailway = this.find("contentSmallWay").getChildByName("layout_smallway")
        let smqiangway = this.find("contentSmQiangWay").getChildByName("layout_smqiangway")
        let delay = 3600;
        if (qipai.childrenCount > 0) {
            let blink = cc.blink(delay, delay);
            let callFun = cc.callFunc(() => {
                this.setData(this.wayData);
            })
            qipai.children[qipai.childrenCount - 1].stopAllActions();
            qipai.children[qipai.childrenCount - 1].runAction(cc.sequence(blink, callFun));
        }
        if (thirdQiPai.childrenCount > 0) {
            let blink = cc.blink(delay, delay);
            thirdQiPai.children[thirdQiPai.childrenCount - 1].stopAllActions();
            thirdQiPai.children[thirdQiPai.childrenCount - 1].runAction(blink);
        }
        if (bigway.childrenCount > 0) {
            let blink = cc.blink(delay, delay);
            bigway.children[bigway.childrenCount - 1].stopAllActions();
            bigway.children[bigway.childrenCount - 1].runAction(blink);
        }
        if (bigeyeway.childrenCount > 0) {
            let blink = cc.blink(delay, delay);
            bigeyeway.children[bigeyeway.childrenCount - 1].stopAllActions();
            bigeyeway.children[bigeyeway.childrenCount - 1].runAction(blink);
        }
        if (smailway.childrenCount > 0) {
            let blink = cc.blink(delay, delay);
            smailway.children[smailway.childrenCount - 1].stopAllActions();
            smailway.children[smailway.childrenCount - 1].runAction(blink);
        }
        if (smqiangway.childrenCount > 0) {
            let blink = cc.blink(delay, delay);
            smqiangway.children[smqiangway.childrenCount - 1].stopAllActions();
            smqiangway.children[smqiangway.childrenCount - 1].runAction(blink);
        }
    },

    onBlinkEnd() {

    },

    test: function () {
        var chess_cards_way_list = []
        chess_cards_way_list.push({
            state_list: [3],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [3, 4],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 7
        })
        chess_cards_way_list.push({
            state_list: [1, 5],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 9
        })

        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })

        chess_cards_way_list.push({
            state_list: [3],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 7
        })
        chess_cards_way_list.push({
            state_list: [3, 5],
            points: 7
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 2
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 9
        })

        chess_cards_way_list.push({
            state_list: [2],
            points: 6
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 3
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 6
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 6
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 6
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 6
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })

        chess_cards_way_list.push({
            state_list: [2],
            points: 6
        })
        chess_cards_way_list.push({
            state_list: [3],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 7
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 7
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 5
        })
        chess_cards_way_list.push({
            state_list: [3],
            points: 8
        })

        chess_cards_way_list.push({
            state_list: [1],
            points: 7
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 4
        })
        chess_cards_way_list.push({
            state_list: [3],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [3],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 7
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 9
        })

        chess_cards_way_list.push({
            state_list: [2],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 5
        })
        chess_cards_way_list.push({
            state_list: [2],
            points: 9
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 8
        })
        chess_cards_way_list.push({
            state_list: [1],
            points: 6
        })




        this.setData(chess_cards_way_list)

        var self = this
        // for (var i = 0; i < chess_cards_way_list.length; i++) {
        //     var data = []
        //     for (var j = 0; j < i; j++) {
        //         data.push(chess_cards_way_list[j])
        //     }

        //     function handle(data, i) {
        //         setTimeout(function () {
        //             cc.log(i)
        //             self.setData(data)
        //         }, i * 1500)
        //     }
        //     handle(data, i)
        // }
    },

    initTotalView: function () {
        var zhuang, xian, he, tianpai, zhuangdui, xiandui
        zhuang = xian = he = tianpai = zhuangdui = xiandui = 0
        for (var i = 0; i < this.qipailuData.length; i++) {
            var data = this.qipailuData[i]
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
        this.find("txtJushu").string = "局数:" + this.qipailuData.length
        this.find("txtZhuang").string = "庄:" + zhuang
        this.find("txtXian").string = "闲:" + xian
        this.find("txtHe").string = "和:" + he
        this.find("txtTian").string = "天牌:" + tianpai
        this.find("txtZhuangdui").string = "庄对:" + zhuangdui
        this.find("txtXiandui").string = "闲对:" + xiandui
    },

    initQiPaiLuView: function (data) {
        this.qipailuData = data.slice(0);
        var layout_qipailu = this.find("layout_qipailu")
        // var layout_qipailu = this.find("contentQiPaiLu").getChildByName("layout_qipailu")
        function getNextPos(index) {
            var row = index % 6
            if (0 == row) {
                row = 6
            }
            var col = Math.ceil(index / 6)
            return {
                row: row,
                col: col
            }
        }
        for (var i = 0; i < data.length; i++) {
            var item = cc.instantiate(cc.res["prefabs/wayBill/QipailuItem"])
            item.getComponent("QipailuItem").setData(clone(data[i]))
            item.parent = layout_qipailu.node
            var pos = getNextPos(i + 1)
            // var width = 49
            // var height = 50
            var width = 44
            var height = 44
            item.position = {
                x: (pos.col - 1) * width - 2,
                y: (6 - pos.row) * height
            }
        }
    },

    initThirdQiPaiLuView: function () {
        this.thirdQipailuData = this.qipailuData.filter(item => item.state_list.indexOf(3) == -1);

        var layout_thirdQiPaiLu = this.find("layout_thirdQiPaiLu")
        // var layout_qipailu = this.find("contentQiPaiLu").getChildByName("layout_qipailu")
        function getNextPos(index) {
            var row = index % 3
            if (0 == row) {
                row = 3
            }
            var col = Math.ceil(index / 3)
            return {
                row: row,
                col: col
            }
        }
        for (var i = 0; i < this.thirdQipailuData.length; i++) {
            var item = cc.instantiate(cc.res["prefabs/wayBill/QipailuItem"])
            item.getComponent("QipailuItem").setData(clone(this.thirdQipailuData[i]), 'en')
            item.parent = layout_thirdQiPaiLu.node
            var pos = getNextPos(i + 1)
            // var width = 49
            // var height = 50
            var width = 44
            var height = 44
            item.position = {
                x: (pos.col - 1) * width - 2,
                y: (3 - pos.row) * height
            }
        }
    },

    addQiPaiLuView: function (data) {
        this.qipailuData = data
        // var layout_qipailu = this.find("layout_qipailu")
        var layout_qipailu = this.find("contentQiPaiLu").getChildByName("layout_qipailu")

        function getNextPos(index) {
            var row = index % 6
            if (0 == row) {
                row = 6
            }
            var col = Math.ceil(index / 6)
            return {
                row: row,
                col: col
            }
        }

        let i = data.length;
        var pos = getNextPos(i);
        let name = pos.row + '-' + pos.col
        var item = layout_qipailu.getChildByName(name);
        if (!item) {
            item = cc.instantiate(cc.res["prefabs/wayBill/QipailuItem"])
        }
        item.getComponent("QipailuItem").setData(clone(data[i]))
        item.parent = layout_qipailu
        item.name = name;
        // var width = 49
        // var height = 50
        var width = 44
        var height = 44
        item.position = {
            x: (pos.col - 1) * width - 2,
            y: (6 - pos.row) * height
        }

    },

    getBigWayData: function (qipailuData) {
        var bigwayData = {} //每一列都是一个长度不定的数组
        var lastData
        //获取这局类型
        function getType(data) {
            //庄
            if (-1 != data.state_list.indexOf(1)) {
                return 1
            }
            //闲 
            else if (-1 != data.state_list.indexOf(2)) {
                return 2
            }
            //和
            else if (-1 != data.state_list.indexOf(3)) {
                return 3
            }
        }
        var isFirstHe = false
        //这里是不拐弯处理的大路数据
        for (var i = 0; i < qipailuData.length; i++) {
            var data = qipailuData[i]
            if (null == lastData) {
                //如果开局为和
                if (3 == getType(data)) {
                    isFirstHe = true
                } else {
                    bigwayData[1] = {}
                    bigwayData[1][1] = clone(data)
                    lastData = bigwayData[1][1]
                    lastData.row = 1
                    lastData.col = 1
                    lastData.isFirstHe = isFirstHe
                }
            } else {
                if (3 == getType(data)) {
                    if (lastData) {
                        lastData.isHe = true
                    }
                } else if (getType(data) == getType(lastData)) {
                    bigwayData[lastData.row][lastData.col + 1] = clone(data)
                    bigwayData[lastData.row][lastData.col + 1].row = lastData.row
                    bigwayData[lastData.row][lastData.col + 1].col = lastData.col + 1
                    lastData = bigwayData[lastData.row][lastData.col + 1]
                } else {
                    //换列
                    bigwayData[lastData.row + 1] = {}
                    bigwayData[lastData.row + 1][1] = clone(data)
                    bigwayData[lastData.row + 1][1].row = lastData.row + 1
                    bigwayData[lastData.row + 1][1].col = 1
                    lastData = bigwayData[lastData.row + 1][1]
                }
            }
        }
        return bigwayData
    },

    initBigWayView: function () {
        var layout_bigway = this.find("layout_bigway")
        //这个数据没有拐弯
        var bigwayData = this.getBigWayData(this.qipailuData)
        this.bigwayData = bigwayData
        //处理拐弯
        var bigwayviewData = {}
        for (var i = 1; i <= tableNums(bigwayData); i++) {
            var maxCol = 6
            for (var j = 1; j <= tableNums(bigwayData[i]); j++) {
                var data = bigwayData[i][j]

                var row = data.row
                var col = data.col
                if (null == bigwayviewData[row]) {
                    bigwayviewData[row] = {}
                }
                //超过第最大行
                if (j > maxCol) {
                    col = maxCol
                    row += j - maxCol
                    bigwayviewData[row] = {}
                }
                //该位置已经被占用，拐弯
                else if (true == bigwayviewData[row][col]) {
                    col -= 1
                    maxCol = col
                    row += j - maxCol
                    bigwayviewData[row] = {}
                }
                bigwayviewData[row][col] = true

                var item = cc.instantiate(cc.res["prefabs/wayBill/BigwayItem"])
                item.getComponent("BigwayItem").setData(data)
                item.parent = layout_bigway.node
                // var width = 35
                // var height = 35
                var width = 40
                var height = 40
                item.position = {
                    x: (row - 1) * width,
                    y: (6 - col) * height
                }
            }
        }
    },

    getBigEyeWayData: function (bigwayData) {
        var array = []
        var beginRow, beginCol
        if (!bigwayData[2] || (1 == tableNums(bigwayData[2]) && !bigwayData[3])) {
            return {}
        }
        var lastData = bigwayData[2][2]
        if (bigwayData[2][2]) {
            beginRow = 2
            beginCol = 2
        } else {
            beginRow = 3
            beginCol = 1
        }
        for (var i = beginRow; i <= tableNums(bigwayData); i++) {
            for (var j = beginCol; j <= tableNums(bigwayData[i]); j++) {
                var data = bigwayData[i][j]
                //直落处理
                if (lastData && lastData.row == data.row) {
                    //有结果有规则
                    if (bigwayData[i - 1][j]) {
                        array.push(true)
                    }
                    //无结果且同列的上一行也无结果，则有规则
                    else if (!bigwayData[i - 1][j] && !bigwayData[i - 1][j - 1]) {
                        array.push(true)
                    } else {
                        array.push(false)
                    }
                }
                //换列处理
                else {
                    if (tableNums(bigwayData[i - 1]) == tableNums(bigwayData[i - 2])) {
                        array.push(true)
                    } else {
                        array.push(false)
                    }
                }
                lastData = data
            }
            beginCol = 1
        }

        lastData = null
        var bigEyeWayData = {}
        var row = 0
        var col = 0
        for (var i = 0; i < array.length; i++) {
            var data = array[i]
            if (null == lastData || lastData != data) {
                row++
                bigEyeWayData[row] = {}
                col = 1
                bigEyeWayData[row][col] = data
            } else {
                col++
                bigEyeWayData[row][col] = data
            }
            lastData = data
        }
        return bigEyeWayData
    },

    initBigEyeWayView: function () {
        var layout_bigeyeway = this.find("layout_bigeyeway")
        var bigEyeWayData = this.getBigEyeWayData(this.bigwayData)
        //处理拐弯
        var bigeyewayviewData = {}
        for (var i = 1; i <= tableNums(bigEyeWayData); i++) {
            var maxCol = 6
            for (var j = 1; j <= tableNums(bigEyeWayData[i]); j++) {
                var data = bigEyeWayData[i][j]

                var row = i
                var col = j
                if (null == bigeyewayviewData[row]) {
                    bigeyewayviewData[row] = {}
                }
                //超过第最大行
                if (j > maxCol) {
                    col = maxCol
                    row += j - maxCol
                    bigeyewayviewData[row] = {}
                }
                //该位置已经被占用，拐弯
                else if (true == bigeyewayviewData[row][col]) {
                    col -= 1
                    maxCol = col
                    row += j - maxCol
                    bigeyewayviewData[row] = {}
                }
                bigeyewayviewData[row][col] = true

                var item = cc.instantiate(cc.res["prefabs/wayBill/BigEyeWayItem"])
                item.getComponent("BigEyeWayItem").setData(data)
                item.parent = layout_bigeyeway.node
                // var width = 12.5
                // var height = 12.5
                var width = 15
                var height = 15
                item.position = {
                    x: (row - 1) * width,
                    y: (6 - col) * height
                }
            }
        }
    },

    getSmallWayData: function (bigwayData) {
        var array = []
        var beginRow, beginCol
        if (!bigwayData[3] || (1 == tableNums(bigwayData[3]) && !bigwayData[4])) {
            return {}
        }
        var lastData = bigwayData[3][2]
        if (bigwayData[3][2]) {
            beginRow = 3
            beginCol = 2
        } else {
            beginRow = 4
            beginCol = 1
        }
        for (var i = beginRow; i <= tableNums(bigwayData); i++) {
            for (var j = beginCol; j <= tableNums(bigwayData[i]); j++) {
                var data = bigwayData[i][j]
                //直落处理
                if (lastData && lastData.row == data.row) {
                    //有结果有规则
                    if (bigwayData[i - 2][j]) {
                        array.push(true)
                    }
                    //无结果且同列的上一行也无结果，则有规则
                    else if (!bigwayData[i - 2][j] && !bigwayData[i - 2][j - 1]) {
                        array.push(true)
                    } else {
                        array.push(false)
                    }
                }
                //换列处理
                else {
                    if (tableNums(bigwayData[i - 1]) == tableNums(bigwayData[i - 3])) {
                        array.push(true)
                    } else {
                        array.push(false)
                    }
                }
                lastData = data
            }
            beginCol = 1
        }

        lastData = null
        var smallWayData = {}
        var row = 0
        var col = 0
        for (var i = 0; i < array.length; i++) {
            var data = array[i]
            if (null == lastData || lastData != data) {
                row++
                smallWayData[row] = {}
                col = 1
                smallWayData[row][col] = data
            } else {
                col++
                smallWayData[row][col] = data
            }
            lastData = data
        }
        return smallWayData
    },

    initSmallWayView: function () {
        var layout_smallway = this.find("layout_smallway")
        var smallWayData = this.getSmallWayData(this.bigwayData)
        //处理拐弯
        var smallwayviewData = {}
        for (var i = 1; i <= tableNums(smallWayData); i++) {
            var maxCol = 6
            for (var j = 1; j <= tableNums(smallWayData[i]); j++) {
                var data = smallWayData[i][j]

                var row = i
                var col = j
                if (null == smallwayviewData[row]) {
                    smallwayviewData[row] = {}
                }
                //超过第最大行
                if (j > maxCol) {
                    col = maxCol
                    row += j - maxCol
                    smallwayviewData[row] = {}
                }
                //该位置已经被占用，拐弯
                else if (true == smallwayviewData[row][col]) {
                    col -= 1
                    maxCol = col
                    row += j - maxCol
                    smallwayviewData[row] = {}
                }
                smallwayviewData[row][col] = true

                var item = cc.instantiate(cc.res["prefabs/wayBill/SmallWayItem"])
                item.getComponent("SmallWayItem").setData(data)
                item.parent = layout_smallway.node
                // var width = 12.5
                // var height = 12
                var width = 15
                var height = 15
                item.position = {
                    x: (row - 1) * width,
                    y: (6 - col) * height
                }
            }
        }
    },

    getSmQiangWayData: function (bigwayData) {
        var array = []
        var beginRow, beginCol
        if (!bigwayData[4] || (1 == tableNums(bigwayData[4]) && !bigwayData[5])) {
            return {}
        }
        var lastData = bigwayData[4][2]
        if (bigwayData[4][2]) {
            beginRow = 4
            beginCol = 2
        } else {
            beginRow = 5
            beginCol = 1
        }
        for (var i = beginRow; i <= tableNums(bigwayData); i++) {
            for (var j = beginCol; j <= tableNums(bigwayData[i]); j++) {
                var data = bigwayData[i][j]
                //直落处理
                if (lastData && lastData.row == data.row) {
                    //有结果有规则
                    if (bigwayData[i - 3][j]) {
                        array.push(true)
                    }
                    //无结果且同列的上一行也无结果，则有规则
                    else if (!bigwayData[i - 3][j] && !bigwayData[i - 3][j - 1]) {
                        array.push(true)
                    } else {
                        array.push(false)
                    }
                }
                //换列处理
                else {
                    if (tableNums(bigwayData[i - 1]) == tableNums(bigwayData[i - 4])) {
                        array.push(true)
                    } else {
                        array.push(false)
                    }
                }
                lastData = data
            }
            beginCol = 1
        }

        lastData = null
        var smQiangWayData = {}
        var row = 0
        var col = 0
        for (var i = 0; i < array.length; i++) {
            var data = array[i]
            if (null == lastData || lastData != data) {
                row++
                smQiangWayData[row] = {}
                col = 1
                smQiangWayData[row][col] = data
            } else {
                col++
                smQiangWayData[row][col] = data
            }
            lastData = data
        }
        return smQiangWayData
    },

    initSmQiangWayView: function () {
        var layout_smqiangway = this.find("layout_smqiangway")
        var smQiangWayData = this.getSmQiangWayData(this.bigwayData)
        //处理拐弯
        var smqiangwayviewData = {}
        for (var i = 1; i <= tableNums(smQiangWayData); i++) {
            var maxCol = 6
            for (var j = 1; j <= tableNums(smQiangWayData[i]); j++) {
                var data = smQiangWayData[i][j]

                var row = i
                var col = j
                if (null == smqiangwayviewData[row]) {
                    smqiangwayviewData[row] = {}
                }
                //超过第最大行
                if (j > maxCol) {
                    col = maxCol
                    row += j - maxCol
                    smqiangwayviewData[row] = {}
                }
                //该位置已经被占用，拐弯
                else if (true == smqiangwayviewData[row][col]) {
                    col -= 1
                    maxCol = col
                    row += j - maxCol
                    smqiangwayviewData[row] = {}
                }
                smqiangwayviewData[row][col] = true

                var item = cc.instantiate(cc.res["prefabs/wayBill/SmQiangWayItem"])
                item.getComponent("SmQiangWayItem").setData(data)
                item.parent = layout_smqiangway.node
                // var width = 12.5
                // var height = 12
                var width = 15
                var height = 15
                item.position = {
                    x: (row - 1) * width,
                    y: (6 - col) * height
                }
            }
        }
    },

    initForecastView: function (qipailuData) {
        var self = this

        function getForecastData(type, tmpQiPaiLu) {
            function getLastData(data) {
                var maxRow = tableNums(data)
                if (0 == maxRow) {
                    return null
                }
                var maxCol = tableNums(data[maxRow])
                return data[maxRow][maxCol]
            }
            tmpQiPaiLu.push({
                state_list: [type],
                points: 9
            })
            var bigWayData = self.getBigWayData(tmpQiPaiLu)
            var bigEyeWayData = self.getBigEyeWayData(bigWayData)
            var smallWayData = self.getSmallWayData(bigWayData)
            var smQiangWayData = self.getSmQiangWayData(bigWayData)
            return [getLastData(bigEyeWayData), getLastData(smallWayData), getLastData(smQiangWayData)]
        }
        // cc.log(getForecastData(1, clone(qipailuData)), getForecastData(2, clone(qipailuData)))
        var ret1 = getForecastData(1, clone(qipailuData))
        var ret2 = getForecastData(2, clone(qipailuData))
        for (var i = 0; i < 3; i++) {
            var resName1, resName2
            if (null == ret1[i]) {
                this.find("imgZhuang" + i).node.active = false
            } else {
                this.find("imgZhuang" + i).node.active = true
                if (ret1[i]) {
                    resName1 = cc.res["waybill/forecast" + i + "yes"]
                } else {
                    resName1 = cc.res["waybill/forecast" + i + "no"]
                }
            }

            if (null == ret2[i]) {
                this.find("imgXian" + i).node.active = false
            } else {
                this.find("imgXian" + i).node.active = true
                if (ret2[i]) {
                    resName2 = cc.res["waybill/forecast" + i + "yes"]
                } else {
                    resName2 = cc.res["waybill/forecast" + i + "no"]
                }
            }

            this.find("imgZhuang" + i).spriteFrame = resName1
            this.find("imgXian" + i).spriteFrame = resName2
        }
    },

    show: function () {
        this._super()
        // this.test()
    },

    hideZXdui() {
        this.find("zzd").node.active = false;
        this.find("xzd").node.active = false;
        this.find("hzd").node.active = false;

        this.find("zxd").node.active = false;
        this.find("xxd").node.active = false;
        this.find("hxd").node.active = false;

        this.find("checkZhuangDui").getComponent(cc.Toggle).isChecked = false;
        this.find("checkXianDui").getComponent(cc.Toggle).isChecked = false;
        this.find("checkTianPai").getComponent(cc.Toggle).isChecked = false;

    },
    onCheckedBox() {
        if (this.find("checkZhuangDui").getComponent(cc.Toggle).isChecked) {
            this.find("zzd").node.active = true;
            this.find("xzd").node.active = true;
            this.find("hzd").node.active = true;
        } else {
            this.find("zzd").node.active = false;
            this.find("xzd").node.active = false;
            this.find("hzd").node.active = false;
        }

        if (this.find("checkXianDui").getComponent(cc.Toggle).isChecked) {
            this.find("zxd").node.active = true;
            this.find("xxd").node.active = true;
            this.find("hxd").node.active = true;
        } else {
            this.find("zxd").node.active = false;
            this.find("xxd").node.active = false;
            this.find("hxd").node.active = false;
        }
    },

    showLoading(data) {
        let loading = this.find("wayLoading");

        let zhuang = loading.getChildByName('zhuang')
        let xian = loading.getChildByName('xian')
        let he = loading.getChildByName('he')

        zhuang.active = data == 1;
        xian.active = data == 2;
        he.active = data == 3;
        loading.active = true;
        let delay = cc.delayTime(1);
        loading.active = true;
        let callFun = cc.callFunc(() => {
            loading.active = false;
        });
        loading.runAction(cc.sequence(delay, callFun));
    },
    hideLoading() {
        this.find("wayLoading").active = false;
    },

    onBtnZhuangwen() {
        if (!this.wayData || this.wayData.length == 0) {
            return;
        }
        let item = {
            state_list: [1],
        };
        let data = this.wayData.slice(0);
        data.push(item);
        this.setData(data, true);
    },
    onBtnXianwen() {
        if (!this.wayData || this.wayData.length == 0) {
            return;
        }
        let item = {
            state_list: [2],
        };
        let data = this.wayData.slice(0);
        data.push(item);
        this.setData(data, true);
    },

    showADImg(url, cb) {
        // let url = 'http://waybill.gie777.com/ad.json';
        // data = [1,2,3,4,5];
        var xhr = cc.loader.getXMLHttpRequest()
        // this.streamXHREventsToLabel(xhr, this.xhrAB, this.xhrABResp, "POST");
        xhr.ontimeout = function () {
            cc.log("ontimeout")
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                if (cb) {
                    cb(response);
                }
            }
        };

        xhr.open("GET", url, true);
        xhr.timeout = 5000
        //set Content-type "text/plain" to post ArrayBuffer or ArrayBufferView
        // xhr.setRequestHeader("Content-Type","text/plain");
        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }
        // Uint8Array is an ArrayBufferView
        // let dataView = new Uint8Array(data.wayBillList);
        xhr.send();
    },

    initAd() {
        let url = 'http://waybill.gie777.com/ad.json';
        this.showADImg(url, (data) => {
            this.adJson = JSON.parse(data);
            cc.loader.load(this.adJson.img, (err, res) => {
                // cc.loader.load({url:'https://thirdqq.qlogo.cn/g?b=sdk&k=zTZwwyd85CzdQUjM93h14g&s=100&t=1537753864',type:'jpg'},(err,res)=>{
                if (!err) {
                    let tex = { width: 400, height: 200 };
                    var spriteFrame = new cc.SpriteFrame(res, cc.Rect(0, 0, tex.width, tex.height));
                    let adImg = cc.find('Canvas/Canvas/body/right/ad/adImg')
                    adImg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
            })
        });
    },

    onBtnAd() {
        if (this.adJson && this.adJson.open == '1') {
            cc.sys.openURL(this.adJson.url);
            this.initAd();
        }
    },

    addData(event, data) {
        if (this.isPreView) {
            this.setData([])
            this.isPreView = false;
        }
        data = parseInt(data);
        this.showLoading(data);
        this.wayData = this.wayData || [];
        let item = {
            state_list: [data],
        };
        // item.state_list.push(data);
        let isdui = false;
        if (this.find("checkZhuangDui").getComponent(cc.Toggle).isChecked) {
            item.state_list.push(4);
        }
        if (this.find("checkXianDui").getComponent(cc.Toggle).isChecked) {
            item.state_list.push(5);
        }
        if (this.find("checkTianPai").getComponent(cc.Toggle).isChecked) {
            item.state_list.push(6);
        }
        this.wayData.push(item);
        this.hideZXdui();
        this.setData(this.wayData);
        this.isWayOver = false;
        // this.hideLoading();
    },

    removeData(event, data) {
        if (this.isPreView) {
            this.clear();
            this.wayData = [];
            this.isPreView = false;
            return;
        }

        if (data == '1') {
            if (this.wayData.length > 0) {
                this.wayData.pop();
            } else {
                this.isWayOver = true;
            }

        } else if (data == '2') {
            if (this.wayData.length > 0) {

                // let data = this.packData();
                let tempData = this.wayData.slice(0);
                this.storageWayData.unshift(tempData);
                this.writeData();
                this.list.set_data(this.storageWayData);
            }
            this.wayData = [];
            this.isWayOver = true;
        }

        this.setData(this.wayData);
        this.upload();
    },

    preView(data) {
        if (this.isWayOver) {
            this.isPreView = true;
            this.setData(data);
        }
    },
    packData() {
        var zhuang, xian, he, tianpai, zhuangdui, xiandui
        zhuang = xian = he = tianpai = zhuangdui = xiandui = 0
        for (var i = 0; i < this.wayData.length; i++) {
            var data = this.wayData[i]
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
        model.jushu = this.wayData.length
        model.zhuang = zhuang
        model.xian = xian
        model.he = he
        model.tian = tianpai
        model.zhuangdui = zhuangdui
        model.xiandui = xiandui
        // model.wayBill = [];
        model.wayBill = this.wayData;
        // for (const item of this.wayData) {
        //     model.wayBill.push((item))
        // }
        return model;
    },

    readData() {
        let data = cc.sys.localStorage.getItem(this._data_saveName);
        if (data && data != 'undefined') {
            let storageData = JSON.parse(data);
            // this.storageWayData = this.objToArray(storageData);
            this.storageWayData = storageData;
        }
    },
    writeData() {
        // let wayBillList = this.arrayToObj();
        let wayBillList = this.storageWayData;
        var jsonStr = JSON.stringify(wayBillList);
        cc.sys.localStorage.setItem(this._data_saveName, jsonStr);
    },

    arrayToObj() {
        cc.log(JSON.stringify(this.storageWayData))
        let data = {};
        for (let i = 0; i < this.storageWayData.length; i++) {
            let way = this.storageWayData[i];
            let newItem = {};
            for (let j = 0; j < way.length; j++) {
                let item = way[j];
                newItem[j + ''] = {};
                newItem[j + ''].state_list = item.state_list;
                newItem[j + ''].points = item.points;
            }
            data[i + ''] = newItem;
        }
        return data;
    },
    objToArray(storageData) {
        let data = [];
        for (const key in storageData) {
            if (storageData.hasOwnProperty(key)) {
                let way = storageData[key];
                let newWay = [];
                for (const key2 in way) {
                    if (way.hasOwnProperty(key2)) {
                        let item = way[key2];
                        newWay[parseInt(key2)] = item;
                    }
                }
                data[parseInt(key)] = newWay;

            }
        }
        return data;
    },

    upload() {
        if (this.sending) {
            return;
        }
        let lastLen = cc.sys.localStorage.getItem(this._data_lastUploadLength);
        if (!lastLen) {
            lastLen = 0;
        }
        lastLen = parseInt(lastLen);
        let uploadData = []
        let len = this.storageWayData.length;
        let diff = len - lastLen;

        if (diff <= 0) {
            return;
        } else {
            uploadData = this.storageWayData.slice(0, diff);
        }

        if (uploadData.length > 0) {
            let data = {};
            data.deviceId = this.getDeviceId();
            data.os = cc.sys.os;
            data.wayBillList = uploadData;
            var jsonStr = JSON.stringify(data);

            cc.log('upload', data, jsonStr)
            this.sending = true;
            this.send(data, () => {
                cc.sys.localStorage.setItem(this._data_lastUploadLength, len);
                this.sending = false;
            });
        }
    },

    getDeviceId() {
        // NSString* imei = [DeviceTools getIDFV];
        let id = 0;
        // cc.sys.os  cc.sys.platform
        if (cc.sys.os == cc.sys.OS_IOS) {
            cc.log("ios")
            id = jsb.reflection.callStaticMethod('DeviceTools', 'getIDFV');
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            cc.log("android")
            id = jsb.reflection.callStaticMethod('tools/DeviceTools', 'getMacAddress', "()Ljava/lang/String;");
        }
        cc.log('device id:', id);
        return id;
    },

    send(data, cb) {
        let url = 'http://waybill.gie777.com/home/index/add';
        // data = [1,2,3,4,5];
        var xhr = cc.loader.getXMLHttpRequest()
        // this.streamXHREventsToLabel(xhr, this.xhrAB, this.xhrABResp, "POST");
        xhr.ontimeout = function () {
            cc.log("ontimeout")
        };
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;
                console.log(response);
                if (cb) {
                    cb();
                }
            }
        };

        xhr.open("POST", url);
        xhr.timeout = 2000
        //set Content-type "text/plain" to post ArrayBuffer or ArrayBufferView
        xhr.setRequestHeader("Content-Type", "text/plain");
        // Uint8Array is an ArrayBufferView
        let dataView = new Uint8Array(data.wayBillList);
        xhr.send(JSON.stringify(data));
    },

    streamXHREventsToLabel: function (xhr, eventLabel, label, method, responseHandler) {
        var handler = responseHandler || function (response) {
            return method + " Response (30 chars): " + response.substring(0, 30) + "...";
        };

        var eventLabelOrigin = eventLabel.string;
        // Simple events
        ['loadstart', 'abort', 'error', 'load', 'loadend', 'timeout'].forEach(function (eventname) {
            xhr["on" + eventname] = function () {
                eventLabel.string = eventLabelOrigin + "\nEvent : " + eventname;
                if (eventname === 'timeout') {
                    label.string = '(timeout)';
                }
            };
        });

        // Special event
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)) {
                label.string = handler(xhr.responseText);
            }
        };
    },


    initAnalytics() {
        //ANALYTICS: login
        cocosAnalytics.CAAccount.loginStart();
        cocosAnalytics.CAAccount.loginSuccess({ 'deviceId': this.getDeviceId() });
        // 设置帐号类型
        // cocosAnalytics.CAAccount.setAccountType('VIP1');
        // 年龄
        // cocosAnalytics.CAAccount.setAge(18);
        // 性别：1为男，2为女，其它表示未知
        // cocosAnalytics.CAAccount.setGender(2);
    }

});