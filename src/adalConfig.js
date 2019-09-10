import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';

export const adalConfig = {
    tenant: "{tenantid}",
    clientId: "{clientid}",
    endpoints: {
        api: 'https://graph.microsoft.com'
    },
    // cacheLocation: 'localStorage',
    // postLogoutRedirectUri: window.location.origin,
    cacheLocation: 'sessionStorage'
};

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (fetch, url, options) =>
    adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);

export const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.api);

export const getTenant = () => {
    return adalConfig.tenant;
}

export const getAdalToken = () => {
    return authContext.getCachedToken(authContext.config.clientId);
};
export const getEmailAddress = () => {
    const tokentest = authContext.getCachedUser();
    return tokentest.userName;
};

export const getUserName = () => {
    const user = authContext.getCachedUser();
    return user.profile.given_name;
};

export const getFullName = () => {
    const user = authContext.getCachedUser();
    return user.profile.name;
};

export const logout = () => {
    authContext.logOut();
}