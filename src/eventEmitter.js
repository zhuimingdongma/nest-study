var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.eventList = {};
    }
    // 订阅
    EventEmitter.prototype.on = function (event, callback) {
        if (!this.eventList[event])
            this.eventList[event] = [];
        this.eventList[event].push(callback);
    };
    // 发布
    EventEmitter.prototype.emit = function (event) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.eventList[event].forEach(function (callback) {
            callback.update.apply(_this, args);
        });
    };
    EventEmitter.prototype.off = function (event, fn) {
        var i = this.eventList[event].findIndex(function (callback) { return callback === fn; });
        i !== -1 && this.eventList[event].splice(i, 1);
    };
    return EventEmitter;
}());
var emitter = new EventEmitter();
var test1 = function (a, b) {
    var c = a + b;
    return a + b;
};
var callback1 = {
    update: function (message, message1) {
        console.log("update 1: ".concat(message, " ").concat(message1));
    }
};
var callback2 = {
    update: function (message) {
        console.log("update 2: ".concat(message));
    }
};
emitter.on('dongma', callback1);
emitter.on('dongma', callback2);
emitter.emit('dongma', 'dongma', 'hesha');
emitter.emit('dongma', 'zhui');
