import axios from "../interceptor";


interface IAdvisorProfileRequest {
  fullName : string
  title? : string
  bio? : string
  profilePhotoURL? : File
  profilePhotoFile? : File
  linkedInURL? : string
  mentorshipPhilosophy? : string
  advisorIndustryFocus : IAdvisorIndustryFocus[]
}

interface IAdvisorIndustryFocus {
  industryId: number
}

interface IAdvisorAvailabilityRequest {
  sessionFormats : string
  typicalSessionDuration: number
  weeklyAvailableHours: number
  maxConcurrentMentees: number
  responseTimeCommitment: string
  isAcceptingNewMentees: boolean
}

function buildAdvisorFormData(data: IAdvisorProfileRequest): FormData {
  const formData = new FormData();
  formData.append("fullName", data.fullName);
  if (data.title) formData.append("title", data.title);
  if (data.bio) formData.append("bio", data.bio);
  if (data.profilePhotoURL) formData.append("profilePhotoURL", data.profilePhotoURL);
  if (data.profilePhotoFile) formData.append("profilePhotoURL", data.profilePhotoFile);
  if (data.linkedInURL) formData.append("linkedInURL", data.linkedInURL);
  if (data.mentorshipPhilosophy) formData.append("mentorshipPhilosophy", data.mentorshipPhilosophy);
  formData.append("advisorIndustryFocus", JSON.stringify(data.advisorIndustryFocus));
  return formData;
}

export const CreateAdvisorProfile = (data: IAdvisorProfileRequest) => {
  return axios.post("/api/advisors", buildAdvisorFormData(data), {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const UpdateAdvisorProfile = (data: IAdvisorProfileRequest) => {
  return axios.put("/api/advisors/me", buildAdvisorFormData(data), {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

export const UpdateAdvisorAvailability = (data : IAdvisorAvailabilityRequest) => {
  return axios.put("/api/advisors/me/availability", data);
}

export const GetAdvisorProfile = () => {
  return axios.get<IBackendRes<any>>("/api/advisors/me");
}

export const GetAdvisorKYCStatus = () => {
  return axios.get<IBackendRes<any>>("/api/advisors/me/kyc/status");
}

export const SubmitAdvisorKYC = (data: any) => {
  return axios.post("/api/advisors/me/kyc/submit", data);
}

export const SaveAdvisorKYCDraft = (data: any) => {
  return axios.patch("/api/advisors/me/kyc/draft", data);
}

