import axios from 'axios';
export const AxiosInstance = axios.create({
	baseURL: process.env.EXPO_PUBLIC_SERVER_URL,
});

const TIMEOUT = Number(process.env.EXPO_PUBLIC_SERVER_TIMEOUT);
const TIMEOUT_ERR = `Request timed out after ${TIMEOUT / 1000} seconds.`;

export const requestAPI = async (url: string) => {
	const source = axios.CancelToken.source();
	const timeout = setTimeout(() => {
		source.cancel(TIMEOUT_ERR);
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
			throw new Error(TIMEOUT_ERR);
		}
		throw error;
	}
};
