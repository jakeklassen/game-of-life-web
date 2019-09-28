// Avoid errors with PNG imports
declare module '*.png' {
  const value: any;
  export = value;
}
