import { AuditLog, UserRole } from '../types';
import { DEMO_AUDIT_LOGS } from '../data/demoData';

const AUDIT_STORAGE_KEY = 'smart_attendance_audit_v1';

export const auditService = {
  getLogs(): AuditLog[] {
    const data = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_AUDIT_LOGS;
  },

  saveLogs(logs: AuditLog[]): void {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs));
  },

  log(params: {
    userId: string;
    userName: string;
    userRole: UserRole;
    action: string;
    targetRecord: string;
    metadata?: string;
  }): void {
    const logs = this.getLogs();
    const newEntry: AuditLog = {
      id: `AUD-${Date.now()}`,
      userId: params.userId,
      userName: params.userName,
      userRole: params.userRole,
      action: params.action,
      targetRecord: params.targetRecord,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      metadata: params.metadata,
    };
    logs.unshift(newEntry);
    this.saveLogs(logs);
  },
};
