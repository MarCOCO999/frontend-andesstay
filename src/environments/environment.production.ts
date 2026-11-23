// Build de produccion (`ng build`): el frontend se sirve desde S3 a traves del mismo API Gateway
// HTTPS que expone el BFF (ver infra/aws/frontend.sh). Rutas /api/** -> BFF, el resto -> S3.
// Este origen debe estar registrado como redirect URI (plataforma SPA) en Azure AD.
const origin = 'https://e94n72mnmk.execute-api.us-east-1.amazonaws.com';

export const environment = {
  production: true,
  azureAd: {
    clientId: 'd6959b0c-9ec2-432e-bddb-54bd0e83ace9',
    tenantId: 'fbf645d5-8f6d-45fc-9e8d-c8866d008af1',
    authority: 'https://login.microsoftonline.com/fbf645d5-8f6d-45fc-9e8d-c8866d008af1',
    redirectUri: origin,
    postLogoutRedirectUri: `${origin}/login`,
  },
  apiScope: 'api://d6959b0c-9ec2-432e-bddb-54bd0e83ace9/api.access',
  bffUrl: origin,
};
