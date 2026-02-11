import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

// Check if user has team lead or higher permissions
export const requireTeamLead = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (req.user.role !== 'teamLead' && req.user.role !== 'administrator') {
    return next(new ForbiddenError('Team-Lead access required'));
  }

  next();
};

// Check if user is administrator (highest level)
export const requireAdministrator = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  if (req.user.role !== 'administrator') {
    return next(new ForbiddenError('Administrator access required'));
  }

  next();
};

// Alias for backwards compatibility
export const requireAdmin = requireTeamLead;
