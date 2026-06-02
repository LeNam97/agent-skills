const path = require("path");

module.exports = (options, webpack) => {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      alias: {
        ...options.resolve?.alias,
        "@ac/api-common": path.resolve(__dirname, "../../packages/api-common/src"),
        "@ac/common": path.resolve(__dirname, "../../packages/api-common/src"),
        "@ac/api-i18n": path.resolve(__dirname, "../../packages/api-i18n/src"),
        "@ac/i18n": path.resolve(__dirname, "../../packages/api-i18n/src"),
        "@ac/api-utils": path.resolve(__dirname, "../../packages/api-utils/src"),
        "@ac/utils": path.resolve(__dirname, "../../packages/api-utils/src"),
        "@ac/api-models": path.resolve(__dirname, "../../packages/api-models/src"),
        "@ac/models": path.resolve(__dirname, "../../packages/api-models/src"),
        "@ac/api-queue": path.resolve(__dirname, "../../packages/api-queue/src"),
        "@workspace/shared": path.resolve(__dirname, "../../packages/shared/src"),
      },
    },
  };
};
