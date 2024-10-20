import axios from 'axios';

export const AxiosInstance = axios.create({
	// baseURL: "http://192.168.1.234:3000/",
	baseURL: 'http://192.168.1.234:8080/',
});

const TIMEOUT = 5000; //ms

export const requestAPI = async (url: string) => {
	const source = axios.CancelToken.source();
	const timeout = setTimeout(() => {
		source.cancel('Request timed out after 5 seconds.');
	}, TIMEOUT);

	try {
		const response = await AxiosInstance.get(url, {
			cancelToken: source.token,
		});
		clearTimeout(timeout);
		return response.data;
	} catch (error) {
		clearTimeout(timeout);
		if (axios.isCancel(error)) {
			throw new Error('Request timed out after 5 seconds.');
		}
		throw error;
	}
};
