export interface TikTokAccount {
  userId: string;
  openId: string;
  displayName: string | null;
  username: string | null;
  avatarUrl: string | null;
  accessToken: string;
  refreshToken: string | null;
  expiresAt: string;
  refreshExpiresAt: string | null;
  scope: string[];
  timezoneOffsetMinutes: number | null;
  connectedAt: string;
  updatedAt: string;
}
