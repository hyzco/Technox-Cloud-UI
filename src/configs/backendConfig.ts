const config = {
  protocol: process.env.API_SRV_PROTOCOL,
  server: process.env.API_SRV,
  port: process.env.API_SRV_PORT,
};

export default {
  apiProperties: config,
  // api: `${config.protocol}://${config.server}:${config.port}`,
  api: "http://185.184.24.212:3000",
};
