import { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: 'administrator' | 'teamLead' | 'member';
      };
    }
  }
}

export {};
