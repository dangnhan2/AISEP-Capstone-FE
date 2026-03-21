export { };

declare global {
    interface IBackendRes<T> {
        success: boolean
        isSuccess: boolean   // alias — BE .NET dùng isSuccess
        statusCode: number   // alias — BE .NET trả kèm status code
        data?: T | null
        message: string
        error: IError | null
    }

    interface IError {
        code: string
        message: string
        details: IErrorDetail[]
    }

    interface IErrorDetail {
        field: string
        message: string
    }

    interface IRegisterInfo {
        userID: number
        email: string
        userType: string
        roles: string[]
        accessToken: string
        refreshToken: string
        accessTokenExpires: string
        refreshTokenExpires: string
    }

    interface ILoginInfo {
        info: {
            userId: number
            email: string
            userType: string
            isActive: boolean
            emailVerified: boolean
            createdAt: string
            lastLoginAt: string
            roles: string[]
        }
        accessToken: string
        accessTokenExpires: string
    }

    interface IUser {
        userID: number
        email: string
        userType: string
        roles: string[]
    }

    interface IInvestorProfile {
        investorID: number
        fullName: string
        firmName: string
        investorType: "Institutional" | "Individual"
        organization?: string
        title: string
        bio: string
        profilePhotoURL: string
        investmentThesis: string
        preferredIndustries: string[]
        preferredStages: string[]
        preferredGeographies: string[]
        preferredMarketScopes: string[]
        supportOffered: string[]
        preferredProductMaturity: string[]
        preferredValidationLevel: string[]
        preferredAIScoreRange: string // e.g., "75-100"
        aiScoreImportance: "Low" | "Medium" | "High"
        preferredStrengths: string[]
        acceptingConnections: boolean
        publicProfileVisibility: boolean
        recentlyActiveDisplay: boolean
        connectionGuidance?: string
        location: string
        country: string
        linkedInURL: string
        website: string
        createdAt: string
        updatedAt: string
    }

    interface ICreateInvestor {
        fullName: string
        firmName: string
        investorType: "Institutional" | "Individual"
        organization?: string
        title: string
        bio: string
        investmentThesis: string
        preferredIndustries: string[]
        preferredStages: string[]
        preferredGeographies: string[]
        preferredMarketScopes: string[]
        supportOffered: string[]
        preferredProductMaturity: string[]
        preferredValidationLevel: string[]
        preferredAIScoreRange: string
        aiScoreImportance: "Low" | "Medium" | "High"
        preferredStrengths: string[]
        acceptingConnections: boolean
        publicProfileVisibility: boolean
        recentlyActiveDisplay: boolean
        connectionGuidance?: string
        location: string
        country: string
        linkedInURL: string
        website: string
    }

    interface IAdvisorProfile {
        advisorID: number
        userId: number
        fullName: string
        title: string
        company: string
        bio: string
        website: string
        linkedInURL: string
        mentorshipPhilosophy: string
        profilePhotoURL: string
        experienceYears: number
        items: string[]
        createdAt: string
        updatedAt: string
    }

    interface ICreateAdvisor {
        fullName: string
        title?: string
        company?: string
        bio?: string
        website?: string
        linkedInURL?: string
        mentorshipPhilosophy?: string
        profilePhotoURL?: File | string
        items?: string[]
    }

    interface IPaging {
        page: number
        pageSize: number
        totalItems: number
        totalPages: number
    }

    interface IPaginatedRes<T> {
        items: T[]
        paging: IPaging
    }

    interface IWatchlistItem {
        watchlistID: number
        startupID: number
        companyName: string
        oneLiner: string
        industry: string
        stage: string
        location: string
        logoURL: string
        watchReason: string
        priority: string
        addedAt: string
    }

    interface ICreateWatchlistItem {
        startupId: number
        watchReason: string
        priority: string
    }

    interface INotificationItem {
        notificationId: number
        notificationType: string
        title: string
        messagePreview: string
        isRead: boolean
        createdAt: string
        actionUrl: string
    }

    interface INotificationDetail {
        notificationId: number
        notificationType: string
        title: string
        message: string
        relatedEntityType: string
        relatedEntityId: number
        actionUrl: string
        isRead: boolean
        isSent: boolean
        createdAt: string
        readAt: string
    }

    interface IStartupSearchItem {
        startupID: number
        companyName: string
        oneLiner: string
        stage: string
        industry: string
        subIndustry: string
        location: string
        country: string
        logoURL: string
        fundingStage: string
        profileStatus: string
        updatedAt: string
    }

    // ── Startup Profile ──────────────────────────────────────────────────────
    interface IStartupProfile {
        startupID: number
        companyName: string
        oneLiner: string
        description: string
        industry: string
        subIndustry: string
        stage: string
        fundingStage: string
        targetFunding: number | null
        raisedAmount: number | null
        teamSize: number | null
        foundedYear: number | null
        location: string
        country: string
        logoURL: string
        website: string
        linkedInURL: string
        pitchDeckURL: string | null
        profileStatus: string
        profileCompleteness: number
        createdAt: string
        updatedAt: string
        // ── Spec fields (Business & Market) ──
        problemStatement?: string
        solutionSummary?: string
        marketScope?: string            // B2B | B2C | B2G | B2B2C
        productStatus?: string          // Concept | Prototype | MVP | Launched | Scaling
        currentNeeds?: string[]          // Funding | Mentorship | Talent | Partnership ...
        // ── Spec fields (Team & Validation) ──
        validationStatus?: string       // Not Validated | In Progress | Validated
        metricSummary?: string
        // ── Spec fields (Visibility) ──
        visibilityStatus?: string       // Visible | Hidden | PendingApproval
        // ── Spec fields (Contact & Links) ──
        contactEmail?: string
        contactPhone?: string
        productUrl?: string
        demoUrl?: string
    }

    interface IStartupTeamMember {
        memberId?: number
        name: string
        title: string
        roles: string[]
        bio: string
        status: string
        avatarUrl: string
        linkedInUrl: string
    }

    // ── Investor Search (startup xem danh sách investor) ──
    interface IInvestorSearchItem {
        investorID: number
        fullName: string
        firmName: string
        investorType: "Institutional" | "Individual"
        title: string
        bio: string
        profilePhotoURL: string
        preferredIndustries: string[]
        preferredStages: string[]
        preferredGeographies: string[]
        ticketSizeMin?: number | null
        ticketSizeMax?: number | null
        portfolioCount?: number | null
        matchScore?: number | null
        acceptingConnections: boolean
        location: string
        country: string
        linkedInURL: string
        website: string
        updatedAt: string
    }

    // ── Connection ──
    interface IConnectionItem {
        connectionID: number
        startupID: number
        startupName: string
        investorID: number
        investorName: string
        connectionStatus: string
        personalizedMessage: string
        matchScore: number
        requestedAt: string
        respondedAt: string
    }

    interface IConnectionDetail {
        connectionID: number
        startupID: number
        startupName: string
        investorID: number
        investorName: string
        connectionStatus: string
        personalizedMessage: string
        attachedDocumentIDs: string
        matchScore: number
        requestedAt: string
        respondedAt: string
        informationRequests: IInfoRequest[]
    }

    interface IInfoRequest {
        requestID: number
        connectionID: number
        investorID: number
        requestType: string
        requestMessage: string
        requestStatus: string
        responseMessage: string
        responseDocumentIDs: string
        requestedAt: string
        fulfilledAt: string
    }

    interface ICreateConnection {
        startupId?: number   // dùng khi investor kết nối với startup
        investorId?: number  // dùng khi startup kết nối với investor
        message: string
    }

    interface ICreateInfoRequest {
        requestType: string
        requestMessage: string
    }

    interface IFulfillInfoRequest {
        responseMessage: string
        responseDocumentIDs: string
    }

    // ── Admin User Management ──
    interface IAdminUser {
        userId: number
        email: string
        userType: string
        isActive: boolean
        emailVerified: boolean
        createdAt: string
        lastLoginAt: string
        roles: string[]
    }

    interface IRole {
        roleId: number
        roleName: string
        description: string
        createdAt: string
        updatedAt: string
        permissions: IPermission[]
    }

    interface IPermission {
        permissionId: number
        permissionName: string
        description: string
        category: string
    }

    interface IRegisterRequest {
        email: string
        password: string
        confirmPassword: string
        userType: string
    }

    // ── KYC Status ──
    interface IKYCStatus {
        status: "Not Submitted" | "Pending" | "Approved" | "Rejected";
        verificationLabel: "Verified Investor Entity" | "Verified Angel Investor" | "Basic Verified" | "Pending More Info" | "Verification Failed" | "None";
        explanation: string;
        lastUpdated: string;
        submissionSummary?: IKYCSubmissionSummary;
        reviewOutcome?: IKYCReviewOutcome;
        history?: IKYCCycle[];
    }

    interface IKYCSubmissionSummary {
        investorTypePath: string;
        submittedName: string;
        submissionDate: string;
        documentCount: number;
        version: number;
    }

    interface IKYCReviewOutcome {
        rejectionReason?: string;
        correctionGuidance?: string;
        nextSteps: string;
    }

    interface IKYCCycle {
        event: string;
        date: string;
        status: string;
    }

    // ── Messaging ──

    interface IConversation {
        conversationId: number;
        connectionId: number | null;
        mentorshipId: number | null;
        status: "Open" | "Closed";
        title: string;
        participantId: number;
        participantName: string;
        participantRole: "Startup" | "Investor" | "Advisor";
        participantAvatarUrl: string | null;
        lastMessagePreview: string | null;
        unreadCount: number;
        createdAt: string;
        lastMessageAt: string | null;
    }

    interface IConversationDetail {
        conversationId: number;
        connectionId: number | null;
        mentorshipId: number | null;
        status: "Open" | "Closed";
        title: string;
        participants: IParticipant[];
        createdAt: string;
        lastMessageAt: string | null;
    }

    interface IParticipant {
        userId: number;
        displayName: string;
        userType: "Startup" | "Investor" | "Advisor";
    }

    interface IMessage {
        messageId: number;
        conversationId: number;
        senderUserId: number;
        senderDisplayName: string;
        isMine: boolean;
        content: string;
        attachmentUrls: string | null;
        isRead: boolean;
        sentAt: string;
        readAt: string | null;
    }

    interface IIncomingMessage {
        messageId: number;
        conversationId: number;
        senderId: number;
        content: string;
        attachmentUrl: string | null;
        createdAt: string;
    }

    interface ICreateConversationBody {
        connectionId?: number;
        mentorshipId?: number;
    }

    interface ISendMessageBody {
        conversationId: number;
        content: string;
        attachmentUrl?: string | null;
    }
}