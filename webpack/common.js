
const commonConfig = (env) => {
  return {
    name: env,
    mode: process.env.NODE_ENV,
    target: env === "client" ? "web" : "node",
  };
};

module.exports = commonConfig;