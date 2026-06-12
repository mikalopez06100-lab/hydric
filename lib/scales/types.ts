export type ScaleProvider = "withings" | "fitbit" | "garmin";

export type WeightSource = ScaleProvider | "manual" | "bluetooth";

export interface OAuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  externalUserId?: string;
  scopes?: string[];
}

export interface ScaleMeasurement {
  externalId: string;
  weightKg: number;
  measuredAt: Date;
  fatRatioPercent?: number;
}

export interface ScaleProviderMeta {
  id: ScaleProvider;
  name: string;
  description: string;
  logo: string;
}

export interface ScaleProviderAdapter {
  meta: ScaleProviderMeta;
  isConfigured(): boolean;
  getAuthorizeUrl(state: string, redirectUri: string): string;
  exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens>;
  refreshTokens(refreshToken: string): Promise<OAuthTokens>;
  fetchMeasurements(
    tokens: OAuthTokens,
    since: Date
  ): Promise<ScaleMeasurement[]>;
}

export type ScaleConnectionPublic = {
  id: string;
  provider: ScaleProvider;
  external_user_id: string | null;
  sync_enabled: boolean;
  last_sync_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
  created_at: string;
};
