import { ValidationPipe } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      // 在这里设置您的自定义验证选项
      // ...
      disableErrorMessages: true, // 禁用错误消息
      transform: true, // 启用自动转换
      validateCustomDecorators: true, // 启用自定义装饰器的验证
    });
  }
}
