import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    // JwtStrategy attaches an object like { userId, username }
    const user = request.user;
    return user?.userId || user?.id || null;
  }
);
