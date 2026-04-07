export const endpoints = {
  auth: {
    login: "/v1/auth/login",
    register: "/v1/auth/register",
    google: "/v1/auth/google",
    forgotPassword: "/v1/auth/forgot-password",
    resetPassword: "/v1/auth/reset-password",
    verifyEmail: "/v1/auth/verify-email",
    setPassword: "/v1/auth/set-password",
    telegram: {
      register: "/v1/auth/telegram/register",
    },
    whatsapp: {
      requestOtp: "/v1/auth/whatsapp/request-otp",
      verifyOtp: "/v1/auth/whatsapp/verify-otp",
    },
  },
  categories: {
    list: "/v1/categories",
  },
  interests: {
    list: "/v1/interests",
  },
  users: {
    byId: (id: string) => `/v1/users/${id}`,
    preferences: (id: string) => `/v1/users/${id}/preferences`,
    verifyPhone: {
      request: (id: string) => `/v1/users/${id}/verify-phone/request`,
      confirm: (id: string) => `/v1/users/${id}/verify-phone/confirm`,
    },
    feedbackPreferences: {
      list: (id: string) => `/v1/users/${id}/feedback-preferences`,
      unmuteCategory: (id: string, categoryId: string) =>
        `/v1/users/${id}/feedback-preferences/categories/${categoryId}`,
      unmuteSource: (id: string, sourceId: string) =>
        `/v1/users/${id}/feedback-preferences/sources/${sourceId}`,
    },
  },
  digest: {
    latest: "/v1/digest/latest",
    list: "/v1/digest/list",
    byDate: (date: string) => `/v1/digest/${date}`,
  },
  news: {
    list: "/v1/news",
    feedback: (id: string) => `/v1/news/${id}/feedback`,
  },
  admin: {
    auth: {
      login: "/v1/admin/auth/login",
      forgotPassword: "/v1/admin/auth/forgot-password",
      profile: "/v1/admin/auth/profile",
    },
    stats: "/v1/admin/stats",
    users: "/v1/admin/users",
    digest: {
      retryFailed: "/v1/admin/digest/retry-failed",
    },
    logs: {
      ingestion: "/v1/admin/logs/ingestion",
      digest: "/v1/admin/logs/digest",
    },
    analytics: {
      overview: "/v1/admin/analytics/overview",
      aiUsage: "/v1/admin/analytics/ai-usage",
      costBreakdown: "/v1/admin/analytics/cost-breakdown",
      ingestion: "/v1/admin/analytics/ingestion",
    },
    sources: {
      list: "/v1/admin/news-source",
      create: "/v1/admin/news-source",
      bulk: "/v1/admin/news-source/bulk",
      byId: (id: string) => `/v1/admin/news-source/${id}`,
    },
    interests: {
      list: "/v1/admin/interests",
      byId: (id: string) => `/v1/admin/interests/${id}`,
    },
  },
} as const;
