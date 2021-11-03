export interface DetaLib {
  lib: {
    cron: (event: any) => any;
    run: (event: any) => any;
  };
}

export type DetaLibApp = <T>(app: any) => T & DetaLib;
