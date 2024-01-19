interface Observer {
  update: (data: unknown) => void;
}

class ConcreteObserver implements Observer {
  public update (data: unknown) {
    console.log('received data: ', data);
  }
}

class Subject {
  private observers: Observer[] = []
  
  public addObserver(observer: Observer) {
    this.observers.push(observer)
  }
  
  public notify(data: unknown) {
    this.observers.forEach(ob => {
      ob.update(data)
    })
  }
  
  public removeObserver(observer: Observer) {
    const i = this.observers.findIndex(ob => ob === observer)
    i !== -1 && this.observers.splice(i, 1)
  }
}

const sub = new Subject()

const observer1 = new ConcreteObserver()
const observer2 = new ConcreteObserver()

sub.addObserver(observer1)
sub.addObserver(observer2)
sub.notify("冬马")
sub.removeObserver(observer1)
sub.notify("和纱")

class LazyMan {
  private queue:Function[] = []
  constructor(name: string) {
    console.log(`Hi I am ${name}`)
    setTimeout(() => this.next(), 0)
  }
  
  public sleep(time: number) {
    let that = this;
    const callback = () => {
      setTimeout(() => {
        console.log(`等待了${time / 1000}秒`)
        this.next()
      }, time)
    }
    this.queue.push(callback)
    return that;
  }
  
  public eat(str: string) {
    const callback = () => {
      console.log(`I am eating ${str}`)
      this.next()
    }
    this.queue.push(callback)
    return this;
  }
  
  public sleepFirst(time: number) {
    const cb = () => {
      console.log(`等待了${time / 1000}秒...`)
      this.next()
    }
    this.queue.unshift(cb)
    return this;
  }
  
  public next() {
     const cb = this.queue.shift()
     cb?.()
  }
}

new LazyMan('Tony').eat('lunch').eat('dinner').sleep(1000).eat('junk food').sleepFirst(5000);
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food

let a9 = [2, 4, 6]
a9.forEach(_ => {
  _ = _+1
  return _;
})
console.log('a9: ', a9);