// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const session_idle_limit = 30 * 60 * 1000;           // 30 mins
const session_idle_warning = (session_idle_limit - (session_idle_limit - 1)) * 60 * 1000;

export const environment = {
    production: false,
    defaultauth: 'fackbackend',
    baseURL: "http://151.104.135.168:8081",
    cmsBaseURL: "http://151.104.135.168:1337",

    session_idle_limit,
    session_idle_warning,
  };
  
  /*
   * For easier debugging in development mode, you can import the following file
   * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
   *
   * This import should be commented out in production mode because it will have a negative impact
   * on performance if an error is thrown.
   */
  // import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
