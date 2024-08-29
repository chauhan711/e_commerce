import { PublicClientApplication } from "@azure/msal-browser";
export declare const getUserAgentApp: ({ clientId, tenantUrl, redirectUri, postLogoutRedirectUri, useLocalStorageCache, }: {
    clientId: string;
    tenantUrl?: string | undefined;
    redirectUri?: string | undefined;
    postLogoutRedirectUri?: string | undefined;
    useLocalStorageCache?: boolean | undefined;
}) => PublicClientApplication | undefined;
export declare const getScopes: (graphScopes?: string[]) => string[];
export declare const getLogger: (isDebugMode?: boolean) => (name: string, content?: any, isError?: boolean) => void;
export declare const checkToIE: () => boolean;
