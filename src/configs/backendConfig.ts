const config = {
  protocol: process.env.API_SRV_PROTOCOL,
  server: process.env.API_SRV,
  port: process.env.API_SRV_PORT,
};

export default {
  apiProperties: config,
  // api: `${config.protocol}://${config.server}:${config.port}`,
  api: "http://localhost:3000",
};
