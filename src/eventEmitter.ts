interface EventEmitterProps {
  on: (event: string, callback: Subscribe) => void;
  emit: (event: string, ...args: any[]) => void;
  off: (event: string, fn: Subscribe) => void;
}

type List = {[key:string]: Array<Subscribe>}

type Subscribe = {
  update: (...args: any[]) => void;  
}

class EventEmitter implements EventEmitterProps {
  private eventList: List = {};
  // 订阅
  on(event: string, callback: Subscribe) {
    if (!this.eventList[event]) this.eventList[event] = []
    this.eventList[event].push(callback)
  }
  
  // 发布
  emit(event: string, ...args: any[]) {
    this.eventList[event].forEach(callback => {
      callback.update.apply(this, args)
    })
  }
  
  off(event: string, fn: Subscribe) {
    const i = this.eventList[event].findIndex(callback => callback === fn)
    i !== -1 && this.eventList[event].splice(i, 1)
  }
  
}

const emitter = new EventEmitter()

const test1 = (a, b) => {
  let c = a + b;
  return a + b
}

const callback1 = {
  update: (message: string, message1: string) => {
    console.log(`update 1: ${message} ${message1}`);
  }
};

const callback2 = {
  update: (message: string) => {
    console.log(`update 2: ${message}`);
  }
};

emitter.on('dongma', callback1)
emitter.on('dongma', callback2)
emitter.emit('dongma', 'dongma', 'hesha')
emitter.emit('dongma', 'zhui')