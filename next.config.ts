import type { NextConfig } from 'next';

const nextConfig: NextConfig = {};
module.exports = {
	images: {
		domains: ['lh3.googleusercontent.com'], // добавьте сюда хост, с которого хотите загружать изображения
	},
};
export default nextConfig;
