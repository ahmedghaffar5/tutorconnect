// ============================================================
// CANONICAL ROLE & PERMISSION SYSTEM
// ============================================================

export type UserRole = 'student' | 'parent' | 'tutor_applicant' | 'tutor' | 'admin';
export type AdminRole = 'super_admin' | 'tutor_reviewer' | 'operations' | 'support' | 'finance' | 'content_manager' | 'safeguarding_lead' | 'analyst' | 'auditor';

export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

// Route-based role requirements
export const routeRoleMap: Record<string, UserRole[]> = {
  '/student': ['student', 'parent'],
  '/student/dashboard': ['student'],
  '/student/bookings': ['student'],
  '/student/messages': ['student', 'parent'],
  '/student/settings': ['student'],
  '/parent': ['parent'],
  '/parent/dashboard': ['parent'],
  '/parent/children': ['parent'],
  '/parent/bookings': ['parent'],
  '/parent/billing': ['parent'],
  '/tutor': ['tutor_applicant', 'tutor'],
  '/tutor/dashboard': ['tutor'],
  '/tutor/application': ['tutor_applicant'],
  '/tutor/profile': ['tutor'],
  '/tutor/students': ['tutor'],
  '/tutor/bookings': ['tutor'],
  '/tutor/sessions': ['tutor'],
  '/tutor/earnings': ['tutor'],
  '/admin': ['admin'],
  '/admin/dashboard': ['admin'],
  '/admin/applications': ['admin'],
  '/admin/users': ['admin'],
  '/admin/tutors': ['admin'],
  '/admin/bookings': ['admin'],
  '/admin/payments': ['admin'],
  '/admin/settings': ['admin'],
  '/admin/audit-log': ['admin'],
};

// Admin sub-role permissions
export const adminPermissions: Record<string, Record<string, boolean>> = {
  super_admin: {
    'applications:read': true, 'applications:write': true,
    'users:read': true, 'users:write': true,
    'tutors:read': true, 'tutors:write': true,
    'bookings:read': true, 'bookings:write': true,
    'payments:read': true, 'payments:write': true,
    'refunds:process': true, 'payouts:process': true,
    'messages:read': true,
    'settings:read': true, 'settings:write': true,
    'audit:read': true, 'audit:export': true,
    'content:manage': true, 'safeguarding:read': true,
    'reports:read': true, 'roles:manage': true,
  },
  tutor_reviewer: {
    'applications:read': true, 'applications:write': true,
    'tutors:read': true,
    'documents:read': true,
    'audit:read': true,
  },
  operations: {
    'users:read': true, 'users:write': true,
    'tutors:read': true,
    'bookings:read': true, 'bookings:write': true,
    'audit:read': true,
  },
  support: {
    'users:read': true,
    'bookings:read': true,
    'messages:read': true,
    'tickets:manage': true,
  },
  finance: {
    'payments:read': true, 'payments:write': true,
    'refunds:process': true, 'payouts:process': true,
    'reports:read': true,
    'audit:read': true,
  },
  content_manager: {
    'content:manage': true,
    'subjects:manage': true,
  },
  safeguarding_lead: {
    'safeguarding:read': true, 'safeguarding:write': true,
    'users:read': true,
    'audit:read': true,
  },
  analyst: {
    'reports:read': true,
    'audit:read': true,
  },
  auditor: {
    'audit:read': true,
    'audit:export': true,
  },
};

export function hasAdminPermission(adminRole: string | undefined, permission: string): boolean {
  if (!adminRole) return false;
  const perms = adminPermissions[adminRole];
  return perms?.[permission] ?? false;
}

export function getDashboardRoute(role: UserRole | undefined): string {
  switch (role) {
    case 'student': return '/student/dashboard';
    case 'parent': return '/parent/dashboard';
    case 'tutor_applicant': return '/tutor/application';
    case 'tutor': return '/tutor/dashboard';
    case 'admin': return '/admin/dashboard';
    default: return '/login';
  }
}

export function getAllowedSelfRegisterRoles(): UserRole[] {
  return ['student', 'parent'];
}

export function isRoleSelfAssignable(role: string): boolean {
  return ['student', 'parent'].includes(role);
}
