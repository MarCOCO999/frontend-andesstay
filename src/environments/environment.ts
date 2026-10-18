export const environment = {
  production: false,
  azureAd: {
    clientId: 'd6959b0c-9ec2-432e-bddb-54bd0e83ace9',
    tenantId: 'fbf645d5-8f6d-45fc-9e8d-c8866d008af1',
    authority: 'https://login.microsoftonline.com/fbf645d5-8f6d-45fc-9e8d-c8866d008af1',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200/login',
  },
  // Scope expuesto por el App Registration ("Expose an API"): api://<clientId>/api.access
  apiScope: 'api://d6959b0c-9ec2-432e-bddb-54bd0e83ace9/api.access',
  // BFF local (ms-andesstay-bff). En produccion esto apunta al API Gateway de AWS.
  // Apuntando al API Gateway de AWS. Para trabajar contra el backend local: 'http://localhost:8081'.
  bffUrl: 'https://e94n72mnmk.execute-api.us-east-1.amazonaws.com',
};
