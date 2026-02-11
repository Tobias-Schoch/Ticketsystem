import { Request, Response, NextFunction } from 'express';
import { imageService } from '../services/image.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response';
import { BadRequestError } from '../utils/errors';

const hasElevatedRole = (role: string) => role === 'teamLead' || role === 'administrator';

export class ImageController {
  async uploadTicketImages(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ticketId } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        throw new BadRequestError('No files uploaded');
      }

      const images = await imageService.uploadTicketImages(files, ticketId, req.user!.id);

      sendCreated(res, { images }, `${images.length} image(s) uploaded successfully`);
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { imageId } = req.params;
      const isAdmin = hasElevatedRole(req.user!.role);

      await imageService.deleteImage(imageId, req.user!.id, isAdmin);

      sendNoContent(res);
    } catch (error) {
      next(error);
    }
  }

  async uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;

      if (!file) {
        throw new BadRequestError('No file uploaded');
      }

      const avatarUrl = await imageService.uploadAvatar(file, req.user!.id);

      sendSuccess(res, { avatarUrl }, 'Avatar uploaded successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const imageController = new ImageController();
