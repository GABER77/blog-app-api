import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from 'src/users/user.entity';

// Custom interface extending Express.Request to include the authenticated user
interface RequestWithUser extends Request {
  user: User;
}

/**
 * Decorator to extract the authenticated user
 * from the request object populated by your ProtectGuard
 */
export const ActiveUser = createParamDecorator(
  (field: keyof User | undefined, ctx: ExecutionContext) => {
    // Access the current HTTP request from the context
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();

    const user = request.user;

    // If a specific key is requested (like 'id'), return that field
    if (field) {
      return user?.[field];
    }

    // Otherwise, return the entire user object
    return user;
  },
);
