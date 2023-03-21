/* eslint-disable no-undef */
module.exports = {
  launch: {
    headless: !process.env.E2E_DEBUG,
    devtools: !!process.env.E2E_DEBUG,
  },
};
