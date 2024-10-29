const nextConfig = {
  rewrites: async () => {
    return [
        {
            source: "/api/py/:path*",
            destination:
                process.env.NODE_ENV === "development"
                    ? "http://127.0.0.1:8000/api/py/:path*"
                    : "/api/py/:path*", // Ensure this points to the correct production URL
        },
    ];
},

};

module.exports = nextConfig;
