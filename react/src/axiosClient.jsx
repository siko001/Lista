import axios from 'axios';

const axiosClient = axios.create({
	baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
	// Check if the request has headers
	if (config.headers) {
		const token = localStorage.getItem('ACCESS_TOKEN');

		// // Check if the Authorization header already exists
		// if (!config.headers.hasOwnProperty('Authorization') && token) {
		// 	config.headers.Authorization = `Bearer ${token}`;
		// }
	}

	return config;
});

axiosClient.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
	
		try {
			const { response } = error;
			if (response.status == 401) {
				localStorage.removeItem('ACCESS_TOKEN');
			}
		} catch (e) {
			console.error(e);
		}

		throw error;
	}
);

export default axiosClient;
