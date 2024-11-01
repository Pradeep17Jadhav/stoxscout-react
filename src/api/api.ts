export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

interface ApiRequestOptions {
  body?: any;
  headers?: Record<string, string>;
  method?: HttpMethod;
}

export const request = async (url: string, options: ApiRequestOptions = {}) => {
  const { body, headers, method = HttpMethod.GET } = options;
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
  if (method !== "GET" && body) {
    config.body = JSON.stringify(body);
  }
  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error during API request:", error);
    throw error;
  }
};

export const authRequest = async (url: string, options: ApiRequestOptions = {}) => {
  const token = localStorage.getItem('token');
  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return request(url, options);
};