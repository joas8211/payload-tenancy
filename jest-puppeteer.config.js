/* eslint-disable no-undef */
module.exports = {
  launch: {
    headless: process.env.E2E_DEBUG !== "1" ? "new" : false,
    devtools: process.env.E2E_DEBUG === "1",
  },
  runBeforeUnloadOnClose: true,
};
