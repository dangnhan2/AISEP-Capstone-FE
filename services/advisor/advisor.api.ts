import axios from "../interceptor";


interface IAdvisorProfileRequest {
  fullName : string
  title : string
  bio : string
  profilePhotoURL : File
  linkedInURL : string
  mentorshipPhilosophy : string
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

export const CreateAdvisorProfile = (data: IAdvisorProfileRequest) => {
  const formData = new FormData();
  formData.append("fullName", data.fullName); 
  formData.append("title", data.title);
  formData.append("bio", data.bio);
  formData.append("profilePhotoURL", data.profilePhotoURL);
  formData.append("linkedInURL", data.linkedInURL);
  formData.append("mentorshipPhilosophy", data.mentorshipPhilosophy);
  formData.append("advisorIndustryFocus", JSON.stringify(data.advisorIndustryFocus)); 
  return axios.post("/api/advisors", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const UpdateAdvisorProfile = (data: IAdvisorProfileRequest) => {
  const formData = new FormData();
  formData.append("fullName", data.fullName); 
  formData.append("title", data.title);
  formData.append("bio", data.bio);
  formData.append("profilePhotoURL", data.profilePhotoURL);
  formData.append("linkedInURL", data.linkedInURL);
  formData.append("mentorshipPhilosophy", data.mentorshipPhilosophy);
  formData.append("advisorIndustryFocus", JSON.stringify(data.advisorIndustryFocus)); 
  return axios.put("/api/advisors/me", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const UpdateAdvisorAvailability = (data : IAdvisorAvailabilityRequest) => {
  return axios.put("/api/advisors/me/availability", data);
}

export const GetAdvisorProfile = () => {
  return axios.get<IBackendRes<IAdvisorProfile>>("/api/advisors/me");
}

// export const SearchAdvisors = (query: string) => {
//   return axios.get<IBackendRes<IPagingData<IAdvisorSearchResult>>>(`/api/advisors/${query}`);
// };

