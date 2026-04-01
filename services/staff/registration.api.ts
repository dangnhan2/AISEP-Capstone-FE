import axios from "../interceptor";

export interface IPendingStartupDto {
    startupID: number;
    companyName: string;
    industryName: string;
    stage: string;
    logoURL: string | null;
    profileStatus: string;
    updatedAt: string;
}

export interface IPendingStartupResponse {
    items: IPendingStartupDto[];
    paging: {
        page: number;
        pageSize: number;
        totalItems: number;
    }
}

export const GetPendingStartups = (page: number = 1, pageSize: number = 10) => {
    return axios.get<IBackendRes<IPendingStartupResponse>>(
        `/api/registration/pending/startups?page=${page}&pageSize=${pageSize}`
    );
};

export const ApproveStartupRegistration = (staffId: number | string, startupId: number | string, score: number = 10) => {
    return axios.post<IBackendRes<any>>(`/api/registration/approve/startups/${staffId}`, {
        startupId,
        score
    });
};

export const RejectStartupRegistration = (staffId: number | string, id: number | string, reason: string) => {
    return axios.post<IBackendRes<any>>(`/api/registration/reject/startups/${staffId}`, {
        id,
        reason
    });
};