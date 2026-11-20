export const environment = {
  production: true,
  fbPayload: {
    _k: "BASE64_ENCODED_API_KEY",
    _d: "BASE64_ENCODED_AUTH_DOMAIN",
    _p: "BASE64_ENCODED_PROJECT_ID",
    _b: "BASE64_ENCODED_STORAGE_BUCKET",
    _m: "BASE64_ENCODED_MESSAGING_SENDER_ID",
    _a: "BASE64_ENCODED_APP_ID"
  },
  tinymce: {
    apiKey: "YOUR_TINYMCE_API_KEY"
  },
  emailjs: {
    contacto: {
      serviceId: "YOUR_EMAILJS_SERVICE_ID",
      templateId: "YOUR_EMAILJS_TEMPLATE_ID",
      publicKey: "YOUR_EMAILJS_PUBLIC_KEY"
    },
    vagas: {
      serviceId: "YOUR_EMAILJS_SERVICE_ID",
      templateId: "YOUR_EMAILJS_TEMPLATE_ID",
      publicKey: "YOUR_EMAILJS_PUBLIC_KEY"
    },
    signup: {
      serviceId: "YOUR_EMAILJS_SERVICE_ID",
      templateId: "YOUR_EMAILJS_TEMPLATE_ID",
      publicKey: "YOUR_EMAILJS_PUBLIC_KEY"
    }
  },
  auth0: {
    domain: "YOUR_AUTH0_DOMAIN",
    clientId: "YOUR_AUTH0_CLIENT_ID"
  }
};
