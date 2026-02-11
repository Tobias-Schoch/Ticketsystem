import { Prisma } from '@prisma/client';
import { prisma } from '../config/database';
import logger from '../utils/logger';

export interface AuditLogEntry {
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  actorId?: string;
}

export interface AuditLogFilters {
  page: number;
  limit: number;
  action?: string;
  entityType?: string;
  actorId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface AuditLogResponse {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  details: Prisma.JsonValue;
  ipAddress: string | null;
  timestamp: Date;
  actor: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export class AuditService {
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          action: entry.action,
          entityType: entry.entityType,
          entityId: entry.entityId,
          details: entry.details as Prisma.InputJsonValue,
          ipAddress: entry.ipAddress,
          actorId: entry.actorId,
        },
      });
    } catch (error) {
      // Log error but don't throw - audit logging should not break operations
      logger.error('Failed to create audit log:', error);
    }
  }

  async getLogs(filters: AuditLogFilters): Promise<{ logs: AuditLogResponse[]; total: number }> {
    const { page, limit, action, entityType, actorId, startDate, endDate } = filters;

    const where: Prisma.AuditLogWhereInput = {};

    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (actorId) where.actorId = actorId;

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) where.timestamp.gte = startDate;
      if (endDate) where.timestamp.lte = endDate;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          details: true,
          ipAddress: true,
          timestamp: true,
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { timestamp: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }

  async getLogsByEntity(
    entityType: string,
    entityId: string
  ): Promise<AuditLogResponse[]> {
    const logs = await prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        details: true,
        ipAddress: true,
        timestamp: true,
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: 100, // Limit to last 100 entries
    });

    return logs;
  }

  async cleanupOldLogs(daysToKeep: number = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await prisma.auditLog.deleteMany({
      where: {
        timestamp: { lt: cutoffDate },
      },
    });

    logger.info(`Cleaned up ${result.count} audit logs older than ${daysToKeep} days`);
    return result.count;
  }
}

export const auditService = new AuditService();

// Audit action constants
export const AuditActions = {
  // Auth
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_LOGIN_FAILED: 'USER_LOGIN_FAILED',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',

  // User management
  USER_CREATED: 'USER_CREATED',
  USER_UPDATED: 'USER_UPDATED',
  USER_DEACTIVATED: 'USER_DEACTIVATED',
  USER_ACTIVATED: 'USER_ACTIVATED',
  USER_ROLE_CHANGED: 'USER_ROLE_CHANGED',
  AVATAR_UPDATED: 'AVATAR_UPDATED',

  // Tickets
  TICKET_CREATED: 'TICKET_CREATED',
  TICKET_UPDATED: 'TICKET_UPDATED',
  TICKET_DELETED: 'TICKET_DELETED',
  TICKET_STATUS_CHANGED: 'TICKET_STATUS_CHANGED',

  // Comments
  COMMENT_ADDED: 'COMMENT_ADDED',
  COMMENT_DELETED: 'COMMENT_DELETED',

  // Images
  IMAGE_UPLOADED: 'IMAGE_UPLOADED',
  IMAGE_DELETED: 'IMAGE_DELETED',
} as const;
