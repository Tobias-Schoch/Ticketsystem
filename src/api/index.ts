export { api, ApiError, getBackendUrl } from './client';
export type { ApiResponse, PaginatedResponse } from './client';

export { authApi } from './auth';
export type { LoginRequest, LoginResponse, ChangePasswordRequest } from './auth';

export { usersApi, adminApi } from './users';
export type { CreateUserRequest, CreateUserResponse, UpdateUserRequest } from './users';

export { ticketsApi } from './tickets';
export type {
  CreateTicketRequest,
  UpdateTicketRequest,
  TicketFiltersParams,
} from './tickets';
