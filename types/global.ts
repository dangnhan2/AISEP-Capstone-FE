export { };

declare global {
    interface IBackendRes<T> {
        success: boolean
        isSuccess: boolean   // alias — BE .NET dùng isSuccess
        statusCode: number   // alias — BE .NET trả kèm status code
        data?: T | null
        message: string
        error: IError<T> | null
    }

    interface IError<T> {
        code: string
        message: string
        details: IErrorDetail<T>[]
    }

    interface IErrorDetail<T> {
        field: string
        message: string
        isSuccess: boolean
        statusCode: number
        data: T | null
    }

    interface IPagingData<T> {
        items: T[]
        paging: IPaging
    }

    interface IPaging {
        page: number
        pageSize: number
        totalItems: number
    }

    interface IRegisterInfo {
        data: IUser
        accessToken: string
    }

    interface ILoginInfo {
        data: IUser
        accessToken: string
    }

    interface IUser {
        userId: number
        email: string
        userType: string
        isActive: boolean
        emailVerified: boolean
        createdAt: string
        lastLoginAt: string
        roles: string[]
    }

    interface IStartupProfile {
        startupID: number
        userID: number
        companyName: string
        oneLiner: string
        description: string
        industryID: number
        industryName: string
        /** Giai đoạn: số 0–6 hoặc chuỗi (API .NET). */
        stage: string | number
        foundedDate: string
        website: string
        logoURL: string
        fundingAmountSought: number
        currentFundingRaised: number
        valuation: number
        fullNameOfApplicant: string
        roleOfApplicant: string
        contactEmail: string
        contactPhone: string
        businessCode: string
        marketScope: string
        problemStatement: string
        solutionSummary: string
        isVisible: boolean
        /** Một số API trả thêm trạng thái hiển thị dạng chuỗi; ưu tiên khi có. */
        visibilityStatus?: string
        teamSize: number
        fileCertificateBusiness: string
        linkedInURL: string
        profileStatus: string
        approvedAt: string
        /** Tuỳ API (có thể không có). */
        approvedBy?: string | number
        createdAt: string
        updatedAt: string
    }

    interface IAdvisorProfile {
        advisorID: number
        userId: number
        fullName: string
        title: string
        bio: string
        profilePhotoURL: string
        mentorshipPhilosophy: string
        linkedInURL: string
        profileStatus: string
        totalMentees: number
        totalSessionHours: number
        averageRating: number
        createdAt: string
        updatedAt: string
        avalability: IAvailability
        industry: IAdvisorIndustryFocus[]
    }

    interface IAdvisorIndustryFocus {
        industryId: number
        industry: string
    }

    interface IAvailability {
        sessionFormats: string
        typicalSessionDuration: number
        weeklyAvailableHours: number
        maxConcurrentMentees: number
        responseTimeCommitment: string,
        calendarConnected: boolean
        isAcceptingNewMentees: boolean
        updatedAt: string
    }

    interface IAdvisorSearchResult {
        advisorID: number
        fullName: string
        title: string
        bio: string
        profilePhotoURL: string
        averageRating: number
        industry: IAdvisorIndustryFocus[]
    }

    interface ITeamMember {
        teamMemberID: number
        fullName: string
        role: string
        title: string
        linkedInURL: string
        bio: string
        photoURL: string
        isFounder: boolean
        yearsOfExperience: number
        createdAt: string
    }


    interface IDocument {
        documentID: number
        startupID: number
        documentType: DocumentTypes | number
        version: string
        fileUrl: string | null
        isArchived: boolean
        isAnalyzed: boolean
        analysisStatus: AnalysisStatus | number
        uploadedAt: string
        proofStatus: ProofStatus | null | number
        fileHash: string
        transactionHash: string
    }

    enum DocumentTypes {
        Pitch_Deck = 0,
        Bussiness_Plan = 1,
    }

    enum AnalysisStatus {
        NOTANALYZE = 0,
        COMPLETED = 1,
        FAILED = 2,
    }

    enum ProofStatus {
        Anchored = 0,       
        Revoked = 1,        
        HashComputed = 2,   
        Pending = 3
    }

    interface IBlockchainVerification {
        documentID: number
        transactionHash : string
        status : string
        blockNumber : boolean
        confirmedAt : string
    }

    interface IBlockchainChecking {
        documentID: number
        computedHash: string
        onChainVerified : boolean
        status: string
    }

    interface IInvestor {
        investorID: number,
        fullName : string,
        firmName : string,
        title : string,
        bio : string,
        profilePhotoURL : string,
        investmentThesis : string,
        location : string,
        country : string,
        linkedInURL : string,
        website : string,
        profileStatus : string,
        createdAt : string,
        updatedAt : string
    }

    interface IStartup {
        startupID: number,
        userID: number,     
        oneLiner: string,
        description: string,
        industryID: number,
        industryName: string,
        stage : string,
        foundedDate: string,
        logoURL: string,
        fundingAmountSought: number,
        currentFundingRaised: number,
        valuation: number,   
        contactPhone: string,   
        marketScope: string,
        problemStatement: string,
        solutionSummary: string,
        linkedInURL: string,
        teamSize: number,
        profileStatus: string,
        createdAt: string,
        updatedAt: string,
        teamMembers: ITeamMember[],    
        //KYC
        companyName: string,
        bussinessCode: string,
        fileCertificateBusiness : string,
        fullNameOfApplicant: string,
        roleOfApplicant: string,
        contactEmail: string,
        website: string,
    }
}
