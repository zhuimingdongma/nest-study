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
