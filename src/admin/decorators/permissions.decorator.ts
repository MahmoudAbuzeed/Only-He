import { SetMetadata } from "@nestjs/common";

export interface Permission {
  resource: string;
  action: string;
}

export const PERMISSIONS_KEY = "permissions";
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
