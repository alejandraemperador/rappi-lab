import axios from "axios";
import type { CreateUserDTO, AuthenticateUserDTO } from "../types/auth.types";

const API_URL = "http://localhost:1234/api";

export const register = async (userdata: CreateUserDTO) => {
    const response = await axios.post(`${API_URL}/register`, userdata);
    return response.data;
};

export const login = async (credentials: AuthenticateUserDTO) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};
