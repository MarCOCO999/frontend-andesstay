// Igual que environment.ts, pero contra el backend desplegado en AWS. Se usa con
// `ng serve -c aws`: el frontend sigue corriendo en localhost:4200 (redirect URI de Azure AD)
// y solo cambia el destino de las llamadas al BFF.
export const environment = {
  production: false,
  azureAd: {
    clientId: 'd6959b0c-9ec2-432e-bddb-54bd0e83ace9',
    tenantId: 'fbf645d5-8f6d-45fc-9e8d-c8866d008af1',
    authority: 'https://login.microsoftonline.com/fbf645d5-8f6d-45fc-9e8d-c8866d008af1',
    redirectUri: 'http://localhost:4200',
    postLogoutRedirectUri: 'http://localhost:4200/login',
  },
  apiScope: 'api://d6959b0c-9ec2-432e-bddb-54bd0e83ace9/api.access',
  // API Gateway HTTP de AWS (lo imprime infra/aws/provision.sh al terminar).
  bffUrl: 'https://e94n72mnmk.execute-api.us-east-1.amazonaws.com',
};
