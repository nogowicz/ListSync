declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
}

declare module '@env' {
  export const API_URL: string;
  export const JWT_KEY: string;
}
