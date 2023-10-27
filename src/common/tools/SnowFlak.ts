export class SnowFlake {
  private START_TIME = 0;
  private SEQUENCE_BIT = 12;
  private MACHINE_BIT = 5;
  private DATA_CENTER_BIT = 5; 
  private MAX_MACHINE_NUM = -1 ^ (-1 << this.MACHINE_BIT)
  private MAX_DATA_CENTER_NUM = -1 ^ (-1 << this.DATA_CENTER_BIT)
  private MAX_SEQUENCE_NUM = -1 ^ (-1 << this.SEQUENCE_BIT)
  
  private MACHINE_LEFT = this.SEQUENCE_BIT
  private DATA_CENTER_LEFT = this.SEQUENCE_BIT + this.MACHINE_BIT
  private TIMESTAMP_LEFT = this.DATA_CENTER_LEFT + this.DATA_CENTER_BIT
  private lastTimestamp = -1
  private machine_id;
  private data_center_id;
  private sequence = 0;
  
  constructor(machine_id: number = 1, data_center_id: number = 1) {
    if (machine_id >= this.MAX_MACHINE_NUM || machine_id < 0) {
      throw new Error('机器id应该大于0且小于最大机器数量')
    }
    else if(data_center_id >= this.MAX_DATA_CENTER_NUM || data_center_id < 0) {
      throw new Error('数据中心id应该大于0且小于最大数据中心数量')
    }
    this.machine_id = machine_id
    this.data_center_id = data_center_id
  }
  
  private getTime() {
    return new Date().getTime()
  }
  
  private maxWaitTime() {
    let timeStamp = this.getTime()
    while(timeStamp <= this.lastTimestamp) {
      timeStamp = this.getTime()
    }
    return timeStamp
  }
  
  nextId() {
    let timeStamp = this.getTime()
    if (timeStamp < this.lastTimestamp) {
      throw new Error('系统时钟回调 拒绝生成id' + (timeStamp - this.lastTimestamp))
    }
    if (timeStamp === this.lastTimestamp) {
      this.sequence = (this.sequence) & this.MAX_SEQUENCE_NUM
      if (this.sequence === 0) {
        timeStamp = this.maxWaitTime()
      }
    }
    else this.sequence = 0
    this.lastTimestamp = timeStamp
    const timeStampPos = (BigInt(timeStamp - this.START_TIME) << BigInt(this.TIMESTAMP_LEFT))
    const dataCenterPos = (BigInt(this.data_center_id) << BigInt(this.DATA_CENTER_LEFT))
    const machinePos = (BigInt(this.machine_id) << BigInt(this.MACHINE_LEFT))
    return (
     timeStampPos | dataCenterPos | machinePos | BigInt(this.sequence) 
    ).toString() 
  }
}