import { UserRole } from "../types";
import { PermissionSlug } from "../types/permissions.types";

export interface Role {
  id: number;
  name: string;
  slug: UserRole;
  permissions: PermissionSlug[];
}

export const ROLES: Role[] = [
  {
    id: 1,
    name: "Admin",
    slug: "admin",
    permissions: ["users:all", "products:all", "roles:manage"],
  },
  {
    id: 2,
    name: "User",
    slug: "user",
    permissions: ["products:read", "products:create", "products:update"],
  },
];

export function isAdmin(roleId: number): boolean {
  const role = ROLES.find((r) => r.id === roleId);
  if (!role) {
    return false;
  }
  if (role.slug === "admin") {
    return true;
  } else {
    return false;
  }
}

export function hasPermission(roleId: number, slug: PermissionSlug): boolean {
  const role = ROLES.find((r) => r.id === roleId);
  if (!role) {
    return false;
  }

  if (role.permissions.includes(slug)) {
    return true;
  }

  const resource = slug.split(":")[0];
  const allSlug = `${resource}:all` as PermissionSlug;

  return role.permissions.includes(allSlug);
}
