import axios from "../interceptor";



export const GetPendingStartups = (params: string) => {
    return axios.get<IBackendRes<IPagingData<IStartup>>>(`/api/Registration/pending/startups?${params}`);
}

export const GetPendingAdvisors = (params: string) => {
    return axios.get<IBackendRes<IPagingData<IAdvisorProfile>>>(`/api/Registration/pending/advisors?${params}`);
}

export const GetPendingInvestors = (params: string) => {
    return axios.get<IBackendRes<IPagingData<IInvestor>>>(`/api/Registration/pending/investors?${params}`);
}

export const GetPendingStartupById = (startupId : number) => {
    return axios.get<IBackendRes<IStartup>>(`/api/Registration/pending/startups/${startupId}`);
}

export const GetPendingAdvisorById = (advisorId : number) => {
    return axios.get<IBackendRes<IAdvisorProfile>>(`/api/Registration/pending/advisors/${advisorId}`);
}

export const GetPendingInvestorById = (investorId : number) => {
    return axios.get<IBackendRes<IInvestor>>(`/api/Registration/pending/investors/${investorId}`);
}

/** Backend có thể trả `data` là chuỗi hoặc bản ghi startup sau khi duyệt. */
export const ApproveStartup = (id: number, score: number) => {
    return axios.post<IBackendRes<string | IStartup>>(`/api/Registration/approve/startups`, { id, score });
}

export const GetDocumentByStaff = (params : string) => {
    return axios.get<IBackendRes<IPagingData<IDocument>>>(`/api/documents/staff/all?${params}`)
}

export const ChekOnchainHashByStaff = (documentId: number) => {
    return axios.post<IBackendRes<IBlockchainChecking>>(`/api/staff/documents/${documentId}/verify-hash`);
}