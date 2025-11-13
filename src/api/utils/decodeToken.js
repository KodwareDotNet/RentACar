// Tokendecoder.js

const Tokendecoder = {
  decodeJWT: (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  },

  storeTokenData: (token, role, refreshToken, expiresAt, Navigate) => {
    const decodedToken = Tokendecoder.decodeJWT(token);
    if (decodedToken) {
      console.log("Decoded Token:", decodedToken);
      console.log("Organization ID:", decodedToken.OrganizationId);
      console.log("User Role:", role);

      // Store all necessary data in localStorage
      localStorage.setItem('role', role);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('expiresAt', expiresAt);
      localStorage.setItem('organizationId', decodedToken.OrganizationId);
      localStorage.setItem('userId', decodedToken.sub);
      localStorage.setItem('email', decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"]);
      localStorage.setItem('userName', decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]);
      localStorage.setItem('permission', decodedToken.Permission);
      localStorage.setItem('UserType', decodedToken.UserType);

      Navigate('/home');
    }
  }
};

export default Tokendecoder;
