declare module 'jose' {
  export function jwtVerify(token: string, secret: Uint8Array): Promise<any>;
  export function createRemoteJWKSet(url: URL): any;
}