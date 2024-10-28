/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/py/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/api/py/:path*"
            : "https://wordcloud-i4a1.vercel.app/pdf-to-wordcloud/api/py/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
