import { Request, Response, NextFunction } from 'express';
import { auditService, AuditActions } from '../services/audit.service';

// Helper to get client IP address
const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string') {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown';
};

// Generic audit middleware factory
export const createAuditMiddleware = (
  action: string,
  entityType: string,
  getEntityId?: (req: Request) => string | undefined,
  getDetails?: (req: Request, res: Response) => Record<string, unknown> | undefined
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Store original end function
    const originalEnd = res.end.bind(res);

    // Override end to log after response is sent
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (res.end as any) = function (chunk?: any, encoding?: BufferEncoding | (() => void), cb?: () => void) {
      // Only log successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        auditService.log({
          action,
          entityType,
          entityId: getEntityId ? getEntityId(req) : undefined,
          details: getDetails ? getDetails(req, res) : undefined,
          ipAddress: getClientIp(req),
          actorId: req.user?.id,
        });
      }

      // Call original end
      if (typeof encoding === 'function') {
        return originalEnd(chunk, encoding);
      }
      return originalEnd(chunk, encoding as BufferEncoding, cb);
    };

    next();
  };
};

// Pre-built audit middlewares for common operations
export const auditLogin = (success: boolean) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Log immediately for login attempts
    auditService.log({
      action: success ? AuditActions.USER_LOGIN : AuditActions.USER_LOGIN_FAILED,
      entityType: 'User',
      details: { email: req.body?.email },
      ipAddress: getClientIp(req),
      actorId: success ? req.user?.id : undefined,
    });
    next();
  };
};

export const auditTicketCreate = createAuditMiddleware(
  AuditActions.TICKET_CREATED,
  'Ticket',
  undefined,
  (req) => ({
    title: req.body?.title,
    priority: req.body?.priority,
    assigneeId: req.body?.assigneeId,
  })
);

export const auditTicketUpdate = createAuditMiddleware(
  AuditActions.TICKET_UPDATED,
  'Ticket',
  (req) => req.params.id,
  (req) => ({ changes: req.body })
);

export const auditTicketDelete = createAuditMiddleware(
  AuditActions.TICKET_DELETED,
  'Ticket',
  (req) => req.params.id
);

export const auditTicketStatusChange = createAuditMiddleware(
  AuditActions.TICKET_STATUS_CHANGED,
  'Ticket',
  (req) => req.params.id,
  (req) => ({ newStatus: req.body?.status })
);

export const auditCommentAdd = createAuditMiddleware(
  AuditActions.COMMENT_ADDED,
  'Comment',
  undefined,
  (req) => ({ ticketId: req.params.ticketId })
);

export const auditCommentDelete = createAuditMiddleware(
  AuditActions.COMMENT_DELETED,
  'Comment',
  (req) => req.params.commentId,
  (req) => ({ ticketId: req.params.ticketId })
);

export const auditImageUpload = createAuditMiddleware(
  AuditActions.IMAGE_UPLOADED,
  'Image',
  undefined,
  (req) => ({
    ticketId: req.params.ticketId,
    fileCount: (req.files as Express.Multer.File[])?.length || 1,
  })
);

export const auditImageDelete = createAuditMiddleware(
  AuditActions.IMAGE_DELETED,
  'Image',
  (req) => req.params.imageId
);

export const auditUserCreate = createAuditMiddleware(
  AuditActions.USER_CREATED,
  'User',
  undefined,
  (req) => ({ email: req.body?.email, role: req.body?.role })
);

export const auditUserRoleChange = createAuditMiddleware(
  AuditActions.USER_ROLE_CHANGED,
  'User',
  (req) => req.params.id,
  (req) => ({ newRole: req.body?.role })
);

export const auditUserDeactivate = createAuditMiddleware(
  AuditActions.USER_DEACTIVATED,
  'User',
  (req) => req.params.id
);

export const auditUserActivate = createAuditMiddleware(
  AuditActions.USER_ACTIVATED,
  'User',
  (req) => req.params.id
);

export const auditPasswordChange = createAuditMiddleware(
  AuditActions.PASSWORD_CHANGED,
  'User',
  (req) => req.user?.id
);
