import { UserProfile } from '../types';
import { api } from './api';

const AUTH_USER_KEY = 'stitch_auth_user_v1';
const AUTH_TOKEN_KEY = 'stitch_auth_token';

// Initial profile data matching Screenshot 4
const INITIAL_PROFILE: UserProfile = {
  id: 'mgr-4082',
  staffId: '#MGR-4082',
  name: 'Kaweerna Sneha',
  email: 'kaweerna.sneha@email.com',
  phone: '+1 (555) 789-0123',
  role: 'General Manager',
  shiftInfo: 'Floor & Service • Shift A',
  isOnShift: true,
  rating: 4.9,
  completedShifts: 142,
  floor: 'Zone A',
  alertsAndSound: true,
  avatarUrl: '/staff_avatar.jpg',
  emergencyHotline: '+1 (800) 555-STITCH (Ext 401)',
};

class AuthService {
  getProfile(): UserProfile {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) {
      this.saveProfile(INITIAL_PROFILE);
      return INITIAL_PROFILE;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PROFILE;
    }
  }

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(profile));
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }

  async login(emailOrId: string, password: string): Promise<{ user: UserProfile; token: string }> {
    const trimmedId = emailOrId.trim();

    // Validation
    if (!trimmedId) {
      throw new Error('Please enter your staff email or ID');
    }
    if (!password || password.length < 4) {
      throw new Error('Password must be at least 4 characters');
    }

    try {
      // Optional backend call
      const res = await api.post<{ token: string; user: UserProfile }>('/auth/login', {
        emailOrId: trimmedId,
        password,
      });
      if (res && res.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, res.token);
        this.saveProfile(res.user);
        return res;
      }
    } catch {
      // Fallback local auth simulation
    }

    // Mock successful authentication
    const fakeToken = `stitch_session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    localStorage.setItem(AUTH_TOKEN_KEY, fakeToken);

    const currentProfile = this.getProfile();
    // If logging in with different identifier, reflect it
    if (trimmedId.includes('@')) {
      currentProfile.email = trimmedId;
    }
    this.saveProfile(currentProfile);

    return { user: currentProfile, token: fakeToken };
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    this.saveProfile(updated);

    try {
      await api.put('/auth/profile', updated);
    } catch {
      // Local fallback saved
    }

    return updated;
  }

  async toggleShift(): Promise<UserProfile> {
    const current = this.getProfile();
    return this.updateProfile({ isOnShift: !current.isOnShift });
  }

  async toggleAlertsSound(): Promise<UserProfile> {
    const current = this.getProfile();
    return this.updateProfile({ alertsAndSound: !current.alertsAndSound });
  }
}

export const authService = new AuthService();
