var BigwayData = cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    ctor: function () {
        this.lastElement = {row : 0, col : 0}
        this.matrix = {}
        // for (var i = 1; i <= 6; i++) {
        //     this.matrix[i] = {}
        // }
        this.matrix[1] = {}
    },

    // init: function (array) {
    //     for (var i = 0; i < array.length; i++) {
    //         this.push(clone(array[i]))
    //     }
    // },

    //state_list 数组：1:庄，2:闲，3:和，4:庄对，5:闲对
    push: function (state_list) {
        var pos = this.getNextPos(this.lastElement.row, this.lastElement.col)
        var row = pos[0]
        var col = pos[1]
        state_list.sort()
        this.matrix[row][col] = state_list
        this.lastElement.row = row
        this.lastElement.col = row
    },

    getNextPos: function (row, col) {
        if (0 == row && 0 == col) {
            return [1, 1]
        }
        // if (6 == row) {
        //     return [1, col + 1]
        // }
        return [row + 1, col]
    },
});

module.exports = {
    BigwayData:BigwayData,
}
