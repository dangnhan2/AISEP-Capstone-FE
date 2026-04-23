import axios from "../interceptor";

export const GetMe = (): Promise<IBackendRes<IUser>> => {
    return axios.get(`/api/users/me`);
};
