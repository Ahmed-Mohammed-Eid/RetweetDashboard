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
                protocol: 'https',
                hostname: 'api.retweet.com'
            },
            {
                protocol: 'http',
                hostname: 'api.retweet.com'
            },
            {
                protocol: 'https',
                hostname: 'localhost'
            },
            {
                protocol: 'http',
                hostname: 'localhost'
            }
        ]
    }
}

module.exports = nextConfig
