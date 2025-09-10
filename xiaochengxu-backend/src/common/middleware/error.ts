import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { ResponseUtil } from '../utils/response';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  // Zod 验证错误
  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    
    return res.status(400).json(
      ResponseUtil.error(`参数验证失败: ${errors[0].message}`, 400)
    );
  }

  // 业务错误
  if (err.message) {
    return res.status(400).json(
      ResponseUtil.error(err.message, 400)
    );
  }

  // 未知错误
  return res.status(500).json(
    ResponseUtil.error('服务器内部错误', 500)
  );
}