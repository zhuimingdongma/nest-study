var ConcreteObserver = /** @class */ (function () {
    function ConcreteObserver() {
    }
    ConcreteObserver.prototype.update = function (data) {
        console.log('received data: ', data);
    };
    return ConcreteObserver;
}());
var Subject = /** @class */ (function () {
    function Subject() {
        this.observers = [];
    }
    Subject.prototype.addObserver = function (observer) {
        this.observers.push(observer);
    };
    Subject.prototype.notify = function (data) {
        this.observers.forEach(function (ob) {
            ob.update(data);
        });
    };
    Subject.prototype.removeObserver = function (observer) {
        var i = this.observers.findIndex(function (ob) { return ob === observer; });
        i !== -1 && this.observers.splice(i, 1);
    };
    return Subject;
}());
var sub = new Subject();
var observer1 = new ConcreteObserver();
var observer2 = new ConcreteObserver();
sub.addObserver(observer1);
sub.addObserver(observer2);
sub.notify("冬马");
sub.removeObserver(observer1);
sub.notify("和纱");
var LazyMan = /** @class */ (function () {
    function LazyMan(name) {
        var _this = this;
        this.queue = [];
        console.log("Hi I am ".concat(name));
        setTimeout(function () { return _this.next(); }, 0);
    }
    LazyMan.prototype.sleep = function (time) {
        var _this = this;
        var that = this;
        var callback = function () {
            setTimeout(function () {
                console.log("\u7B49\u5F85\u4E86".concat(time / 1000, "\u79D2"));
                _this.next();
            }, time);
        };
        this.queue.push(callback);
        return that;
    };
    LazyMan.prototype.eat = function (str) {
        var _this = this;
        var callback = function () {
            console.log("I am eating ".concat(str));
            _this.next();
        };
        this.queue.push(callback);
        return this;
    };
    LazyMan.prototype.sleepFirst = function (time) {
        var _this = this;
        var cb = function () {
            console.log("\u7B49\u5F85\u4E86".concat(time / 1000, "\u79D2..."));
            _this.next();
        };
        this.queue.unshift(cb);
        return this;
    };
    LazyMan.prototype.next = function () {
        var cb = this.queue.shift();
        cb === null || cb === void 0 ? void 0 : cb();
    };
    return LazyMan;
}());
new LazyMan('Tony').eat('lunch').eat('dinner').sleep(1000).eat('junk food').sleepFirst(5000);
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
