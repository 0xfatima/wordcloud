const nextConfig = {
  rewrites: async () => {
    console.log("Environment:", process.env.NODE_ENV); // Log the environment
    return [
      {
        source: "/api/py/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/py/:path*"
            : "/api/py/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
