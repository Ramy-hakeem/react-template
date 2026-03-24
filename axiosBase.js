import axios from "axios";
import { loadState } from "utils";

export const customInstance = axios.create({
	baseURL: process.env.REACT_APP_API_URL,
});

//request interceptor
customInstance.interceptors.request.use(
	(config) => {
		const token =
			loadState("management_user")?.access_token ??
			loadState("temp_t")?.token;

		if (token) {
			config.headers["authorization"] = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		console.log(error);
		return Promise.reject(error);
	}
);

// response interceptor
customInstance.interceptors.response.use((response) => {
	// Any status code that lie within the range of 2xx cause this function to trigger
	// Do something with response data

	// check for auth error
	if (response.data?.RESULT_CODE === 401) {
		throw new Error("ERROR:AUTHENTICATION");
	}

	return response;
});

const { get, post, put, postForm } = customInstance;

export { get, post, put, postForm };
