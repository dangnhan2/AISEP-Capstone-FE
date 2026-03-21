import axios from "../interceptor";

// ── Params ──────────────────────────────────────────────────────────────────

export interface ISearchInvestorsParams {
    page?: number;
    pageSize?: number;
    keyword?: string;
    investorType?: "Institutional" | "Individual";
    stage?: string;       // preferred stage, e.g. "Seed"
    industry?: string;    // preferred industry, e.g. "Fintech"
    sortBy?: "matchScore" | "recent";
}

// ── Startup xem danh sách Investor ──────────────────────────────────────────

export const SearchInvestors = (params: ISearchInvestorsParams = {}) => {
    return axios.get<IBackendRes<IPaginatedRes<IInvestorSearchItem>>>(
        `/api/startups/investors`,
        { params: { page: 1, pageSize: 12, ...params } }
    );
};

export const GetInvestorById = (id: number) => {
    return axios.get<IBackendRes<IInvestorProfile>>(`/api/startups/investors/${id}`);
};

// ── Startup Profile ──────────────────────────────────────────────────────────

export const GetStartupProfile = () => {
    return axios.get<IBackendRes<IStartupProfile>>(`/api/startups/me`);
};

export const CreateStartupProfile = (data: FormData) => {
    return axios.post<IBackendRes<IStartupProfile>>(`/api/startups`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const UpdateStartupProfile = (data: FormData) => {
    return axios.put<IBackendRes<IStartupProfile>>(`/api/startups/me`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// ── Visibility ──────────────────────────────────────────────────────────────

export const EnableVisibility = () => {
    return axios.post<IBackendRes<null>>(`/api/startups/me/visibility/enable`);
};

export const DisableVisibility = () => {
    return axios.post<IBackendRes<null>>(`/api/startups/me/visibility/disable`);
};

// ── Team Members ────────────────────────────────────────────────────────────

export const GetTeamMembers = () => {
    return axios.get<IBackendRes<IStartupTeamMember[]>>(`/api/startups/me/team`);
};

export const AddTeamMember = (data: FormData) => {
    return axios.post<IBackendRes<IStartupTeamMember>>(`/api/startups/me/team`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const UpdateTeamMember = (memberId: number, data: FormData) => {
    return axios.put<IBackendRes<IStartupTeamMember>>(`/api/startups/me/team/${memberId}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

export const DeleteTeamMember = (memberId: number) => {
    return axios.delete<IBackendRes<null>>(`/api/startups/me/team/${memberId}`);
};
