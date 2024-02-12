/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        API_URL: 'https://api.retweet.com/api/v1'
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'via.placeholder.com'
            },
            {
                protocol: 'https',
                hostname: 'alderwaza.kportals.net'
            },
            {
                protocol: 'http',
                hostname: 'alderwaza.kportals.net'
            },
            {
                protocol: 'http',
                hostname: 'localhost'
            }
        ]
    }
}

module.exports = nextConfig
