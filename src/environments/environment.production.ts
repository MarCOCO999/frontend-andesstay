export const environment = {
  production: true,
  azureAd: {
    clientId: 'd6959b0c-9ec2-432e-bddb-54bd0e83ace9',
    tenantId: 'fbf645d5-8f6d-45fc-9e8d-c8866d008af1',
    authority: 'https://login.microsoftonline.com/fbf645d5-8f6d-45fc-9e8d-c8866d008af1',
    // TODO: reemplazar por el dominio real una vez desplegado el frontend.
    redirectUri: 'https://andesstay.example.com',
    postLogoutRedirectUri: 'https://andesstay.example.com/login',
  },
  apiScope: 'api://d6959b0c-9ec2-432e-bddb-54bd0e83ace9/api.access',
  // TODO: reemplazar por la URL del API Gateway de AWS una vez desplegado.
  bffUrl: 'https://api.andesstay.example.com',
};
