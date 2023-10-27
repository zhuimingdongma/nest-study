export enum AuthEnum {
  TOURIST = 'tourist',
  COMMON = 'common',
  ADMIN = 'admin',
  SUPER = 'super'
}

export enum WhetherEnum {
  NOT = 0,
  IS = 1
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
  CONTACT = 3
}

export enum GoodsSaleStatusEnum {
  // 待上架
  PENDING_LISTING = 0,
  // 正出售
  FOR_SALE = 1,
  SOLD = 2,
  // 已下架
  OFF_SHELF = 3,
  DELETED = 4
}

export enum GoodsLevelEnum {
  COMMON = 'common',
  HIGH = 'high',
  TOPPING = 'topping'
}