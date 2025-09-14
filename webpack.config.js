module.exports = {
  resolve: {
    fallback: {
      zlib: false,
      querystring: false,
      path: false,
      crypto: false,
      fs: false,
      http: false,
      net: false,
      stream: false,
      os: false,
      util: false,
      url: false,
      buffer: false,
    },
  },
};
