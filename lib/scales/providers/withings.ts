import type {
  OAuthTokens,
  ScaleMeasurement,
  ScaleProviderAdapter,
} from "@/lib/scales/types";

const META = {
  id: "withings" as const,
  name: "Withings",
  description: "Body+, Body Cardio, Body Scan et balances Withings",
  logo: "⚖️",
};

function getConfig() {
  return {
    clientId: process.env.WITHINGS_CLIENT_ID ?? "",
    clientSecret: process.env.WITHINGS_CLIENT_SECRET ?? "",
  };
}

async function parseWithingsResponse<T>(res: Response): Promise<T> {
  const json = (await res.json()) as {
    status?: number;
    body?: T;
    error?: string;
  };
  if (!res.ok || (json.status !== undefined && json.status !== 0)) {
    throw new Error(json.error ?? `Withings API error (${res.status})`);
  }
  return json.body as T;
}

export const withingsAdapter: ScaleProviderAdapter = {
  meta: META,

  isConfigured() {
    const { clientId, clientSecret } = getConfig();
    return !!(clientId && clientSecret);
  },

  getAuthorizeUrl(state: string, redirectUri: string) {
    const { clientId } = getConfig();
    const params = new URLSearchParams({
      response_type: "code",
      client_id: clientId,
      state,
      scope: "user.metrics,user.info",
      redirect_uri: redirectUri,
    });
    return `https://account.withings.com/oauth2_user/authorize2?${params}`;
  },

  async exchangeCode(code: string, redirectUri: string): Promise<OAuthTokens> {
    const { clientId, clientSecret } = getConfig();
    const body = new URLSearchParams({
      action: "requesttoken",
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    });

    const res = await fetch("https://wbsapi.withings.net/v2/oauth2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await parseWithingsResponse<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      userid: string;
      scope: string;
    }>(res);

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      externalUserId: String(data.userid),
      scopes: data.scope?.split(",") ?? [],
    };
  },

  async refreshTokens(refreshToken: string): Promise<OAuthTokens> {
    const { clientId, clientSecret } = getConfig();
    const body = new URLSearchParams({
      action: "requesttoken",
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    });

    const res = await fetch("https://wbsapi.withings.net/v2/oauth2", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await parseWithingsResponse<{
      access_token: string;
      refresh_token: string;
      expires_in: number;
      userid: string;
    }>(res);

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: new Date(Date.now() + data.expires_in * 1000),
      externalUserId: String(data.userid),
    };
  },

  async fetchMeasurements(
    tokens: OAuthTokens,
    since: Date
  ): Promise<ScaleMeasurement[]> {
    const body = new URLSearchParams({
      action: "getmeas",
      meastypes: "1",
      category: "1",
      lastupdate: String(Math.floor(since.getTime() / 1000)),
      access_token: tokens.accessToken,
    });

    const res = await fetch("https://wbsapi.withings.net/measure", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const data = await parseWithingsResponse<{
      measuregrps?: Array<{
        grpid: number;
        date: number;
        measures: Array<{ type: number; value: number; unit: number }>;
      }>;
    }>(res);

    const results: ScaleMeasurement[] = [];

    for (const group of data.measuregrps ?? []) {
      const weight = group.measures.find((m) => m.type === 1);
      if (!weight) continue;

      const kg = weight.value * Math.pow(10, weight.unit);
      if (kg < 30 || kg > 300) continue;

      results.push({
        externalId: String(group.grpid),
        weightKg: Math.round(kg * 10) / 10,
        measuredAt: new Date(group.date * 1000),
      });
    }

    return results.sort(
      (a, b) => b.measuredAt.getTime() - a.measuredAt.getTime()
    );
  },
};
