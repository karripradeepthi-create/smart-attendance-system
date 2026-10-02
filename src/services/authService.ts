import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/demoData';

const AUTH_USER_KEY = 'smart_attendance_current_user';

export const authService = {
  getCurrentUser(): User {
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached user', e);
      }
    }
    // Default to Admin demo user if first time
    return DEMO_USERS[0];
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  switchRole(role: UserRole): User {
    const found = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    this.setCurrentUser(found);
    return found;
  },

  async login(email: string, password?: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulated auth service designed for seamless OAuth / JWT backend hookup
    await new Promise((resolve) => setTimeout(resolve, 350));
    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.setCurrentUser(user);
      return { success: true, user };
    }
    // If entered demo credentials or any valid university email
    const fallbackUser: User = {
      id: `USR-${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email,
      role: 'student',
      studentId: 'STU099',
      departmentId: 'DEP-CSE',
    };
    this.setCurrentUser(fallbackUser);
    return { success: true, user: fallbackUser };
  },

  async register(params: {
    name: string;
    email: string;
    role: UserRole;
    department?: string;
    studentId?: string;
    facultyId?: string;
  }): Promise<{ success: boolean; user: User }> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newUser: User = {
      id: `USR-${Date.now()}`,
      name: params.name,
      email: params.email,
      role: params.role,
      departmentId: params.department || 'DEP-CSE',
      studentId: params.studentId || (params.role === 'student' ? 'STU101' : undefined),
      facultyId: params.facultyId || (params.role === 'faculty' ? 'FAC099' : undefined),
    };
    this.setCurrentUser(newUser);
    return { success: true, user: newUser };
  },

  logout(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  },
};
