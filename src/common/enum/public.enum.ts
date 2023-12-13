export enum AuthEnum {
  TOURIST = 'tourist',
  COMMON = 'common',
  ADMIN = 'admin',
  SUPER = 'super',
}

export enum WhetherEnum {
  NOT = 0,
  IS = 1,
}

export enum FormTypeEnum {
  TEXT = 1,
  NUMBER = 2,
  PASSWORD = 3,
  RADIO = 4,
  CHECKBOX = 5,
  // 下拉框
  SELECT = 6,
  // 多行文本框
  MULTILINE = 7,
}

export enum SaleAttrTypeEnum {
  ACCOUNT = 0,
  PASSWORD = 1,
  PRICE = 2,
  CONTACT = 3,
}

export enum GoodsSaleStatusEnum {
  // 待上架
  PENDING_LISTING = 0,
  // 正出售
  FOR_SALE = 1,
  SOLD = 2,
  // 已下架
  OFF_SHELF = 3,
  DELETED = 4,
}

export enum GoodsLevelEnum {
  COMMON = 'common',
  HIGH = 'high',
  TOPPING = 'topping',
}

export enum OrderStatusEnum {
  BE_PAID = 'be_paid',
  PAID = 'paid',
  SHIPPED = 'shipped',
  COMPLETION = 'completion',
  // 打款给卖家中
  PAYMENT_PROCESS = 'payment_process',
  TRANSACTION_SUCCESS = 'transaction_success',
  TRANSACTION_CLOSE = 'transaction_close',
  REFUNDING = 'refunding',
  TRANS_CLOSE_WITH_REFUND = 'trans_close_with_refund',
}

export enum EmailTemplateEnum {
  REGISTER = 'register',
  RETRIEVE = 'retrieve',
  RESET = 'reset',
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  HTTP = 'http',
  VERBOSE = 'verbose',
  DEBUG = 'debug',
  SILLY = 'silly',
}
