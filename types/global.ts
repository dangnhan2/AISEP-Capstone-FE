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

    interface IInvestorProfile {
        investorID: number
        userID: number
        fullName: string
        title: string
        bio: string
        profilePhotoURL: string
        firmName: string
        organization: string
        investorType: string
        investmentThesis: string
        connectionGuidance: string
        supportOffered: string[]
        preferredStages: string[]
        preferredIndustries: string[]
        preferredGeographies: string[]
        preferredMarketScopes: string[]
        preferredProductMaturity: string[]
        preferredValidationLevel: string[]
        preferredStrengths: string[]
        preferredAIScoreRange: string
        aiScoreImportance: string
        acceptingConnections: boolean
        website: string
        linkedInURL: string
        country: string
        location: string
        profileStatus: string
        createdAt: string
        updatedAt: string
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
        documentType: string
        version: string
        fileUrl: string
        isArchived: boolean
        isAnalyzed: boolean
        analysisStatus: string
        uploadedAt: string
        proofStatus: string
        fileHash: string
        transactionHash: string
    }

    interface IBlockchainVerification {
        documentID: number
        computedHash: string
        onChainVerified: boolean
        status: string
    }

    interface IBlockchainChecking {
        documentID: number
        transactionHash: string
        status: string
        blockNumber: string
        confirmedAt: string
    }

    interface IPaginatedRes<T> {
        items: T[]
        paging: {
            page: number
            pageSize: number
            totalPages: number
            totalItems: number
        }
    }

    interface IConnectionItem {
        connectionID: number
        startupID: number
        startupName: string
        investorID: number
        investorName: string
        connectionStatus: string
        personalizedMessage: string | null
        matchScore: number | null
        requestedAt: string
        respondedAt: string | null
    }

    interface IConnectionDetail extends IConnectionItem {}

    interface ICreateConnection {
        investorId: number
        message: string
    }

    interface ICreateInfoRequest {
        title: string
        description: string
    }

    interface IInfoRequest {
        requestId: number
        connectionId: number
        title: string
        description: string
        status: string
        createdAt: string
        fulfilledAt: string | null
    }

    interface IFulfillInfoRequest {
        response: string
    }

    interface IConversation {
        conversationId: number
        connectionId: number
        participantRole: string
        participantName?: string
        participantAvatarUrl?: string
        title?: string
        status?: string
        unreadCount?: number
        lastMessageAt?: string
        lastMessagePreview?: string
        createdAt: string
    }

    interface ICreateConversationBody {
        connectionId: number
    }

    interface IConversationDetail extends IConversation {}

    interface IMessage {
        messageId?: number | string
        conversationId?: number
        content: string
        sentAt: string
        isMine: boolean
        senderUserId?: number
        senderDisplayName?: string
        attachmentUrls?: string | null
        isRead?: boolean
        readAt?: string | null
        _failed?: boolean
    }

    interface IIncomingMessage {
        messageId: number | string
        conversationId: number
        content: string
        sentAt: string
        createdAt?: string
        senderId: number
        attachmentUrl?: string
    }

    interface ISendMessageBody {
        conversationId: number
        content: string
        attachmentUrl?: string | null
    }

    interface INotificationItem {
        notificationId: number
        title: string
        createdAt: string
        isRead: boolean
        notificationType?: string
        messagePreview?: string
        actionUrl?: string
    }

    interface INotificationDetail {
        title: string
        content?: string
        message?: string
        createdAt: string
        readAt?: string | null
        actionUrl?: string
    }

    interface IInvestorSearchItem {
        investorID: number
        fullName: string
        title: string
        firmName?: string
        profilePhotoURL?: string
        investorType: string
        acceptingConnections: boolean
        preferredIndustries: string[]
        portfolioCount?: number | null
        ticketSizeMin?: number | null
        ticketSizeMax?: number | null
        matchScore?: number | null
    }

    interface ICreateInvestor {
        fullName: string
        title?: string
        bio?: string
        investorType?: string
        linkedInURL?: string
    }

    interface IWatchlistItem {
        watchlistId: number
        startupID: number
        startupName: string
        addedAt: string
    }

    interface ICreateWatchlistItem {
        startupId: number
    }

    interface IStartupSearchItem {
        startupID: number
        companyName: string
        oneLiner: string
        industryName: string
        stage: string | number
        logoURL: string | null
        profileStatus: string
    }

    interface IKYCStatus {
        status: string
        submittedAt: string | null
        reviewedAt: string | null
        reason: string | null
    }

    interface IRole {
        roleId: number
        roleName: string
        description?: string
    }

    interface IPermission {
        permissionId: number
        permissionName: string
        category?: string
    }

    interface IAdminUser {
        userId: number
        email: string
        userType: string
        isActive: boolean
        emailVerified: boolean
        roles: string[]
        createdAt: string
        lastLoginAt: string
        reactivationRequest?: {
            activeFlags: string[]
            reason?: string
        }
    }
}