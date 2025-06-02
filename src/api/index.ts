import axios, { Axios, AxiosError } from "axios";
import {
  FETCH_USER_URL,
  GENERATE_TONE_URL,
  FETCH_AMPS_URL,
  REGISTER_URL,
  LOGOUT_URL,
  LOGIN_URL,
  GET_CURRENT_USER_URL,
} from "..";
import type { fetchGenerateToneT, UserApiI } from "@/types/api-types";

export const fetchGenerateTone: fetchGenerateToneT = async (data) => {
  try {
    const res = await axios.post(GENERATE_TONE_URL, { ...data });
    console.log(res);
    return res.data;
    // const mockDescription =
    //   "An iconic band known for blending emotionally rich lyrics with powerful instrumentation, capturing both the intensity and vulnerability of the human experience.";

    // await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms delay

    // const mockResponse = {
    //   status: 200,
    //   data: {
    //     band: "Opeth",
    //     description: mockDescription,
    //     amp: "Mesa Dual Rectifier", // Example tone
    //     ir: "Celestion Greenback G12M",
    //   },
    // };

    // console.log(mockResponse);

    // if (mockResponse.status === 200) {
    //   return mockResponse.data;
    // }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.message);
    }
    throw new Error("Unexpected error occurred: " + error);
  }
};

export const fetchUser = async (userId: string) => {
  try {
    const resp = await axios.get(`${FETCH_USER_URL}/${userId}`);
    return resp.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.message);
    } else {
      throw new Error("Unexpected error occurred" + error);
    }
  }
};

export const fetchAmps = async (query: string) => {
  try {
    const response = await axios.get(`${FETCH_AMPS_URL}/${query}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.message);
    } else {
      throw new Error("Failed to fetch amps");
    }
  }
};

export const userApi: UserApiI = {
  login: async (credentials) => {
    try {
      const response = await axios.post(LOGIN_URL, { ...credentials });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to login:" + error);
      }
    }
  },
  signUp: async (credentials) => {
    try {
      const response = await axios.post(REGISTER_URL, { ...credentials });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to register:" + error);
      }
    }
  },

  logout: async () => {
    try {
      const response = await axios.post(LOGOUT_URL, { method: "POST" });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to logout:" + error);
      }
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axios.get(GET_CURRENT_USER_URL);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to fetch current user:" + error);
      }
    }
  },
};
