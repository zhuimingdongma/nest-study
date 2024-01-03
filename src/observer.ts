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