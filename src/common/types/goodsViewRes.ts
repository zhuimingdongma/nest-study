import { GoodsEntity } from "src/module/goods/goods.entity";

export interface GoodsViewResponse extends GoodsEntity {
  game_name?: string;
  phone_number?: string;
}