export interface Logger {
  info: (func: string, values: any) => void;
  error: (func: string, values: any) => void;
}

export function createLogger(name: string, verbose: boolean): Logger {
  return {
    info: (func: string, values: any) => {
      if (verbose) console.info(`[AUTH - ${name} - ${func}]`, values);
    },
    error: (func: string, values: any) => {
      console.error(`[AUTH ERROR - ${name} - ${func}]`, values);
    },
  };
}
