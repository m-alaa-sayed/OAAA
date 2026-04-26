const session_idle_limit = 30 * 60 * 1000;           // 30 mins
const session_idle_warning = (session_idle_limit - (session_idle_limit - 1)) * 60 * 1000;

export const environment = {
  production: true,
  defaultauth: 'fackbackend',
  // baseURL: "http://151.104.134.248:8081",
  baseURL: "https://jawda.gov.om/api",
  cmsBaseURL: "http://151.104.134.248:1337",

  session_idle_limit,
  session_idle_warning
};
