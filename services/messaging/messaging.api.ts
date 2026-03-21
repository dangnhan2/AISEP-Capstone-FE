import instance from "@/services/interceptor";

// Interceptor trả response.data trực tiếp nên cast về IBackendRes<T>
type R<T> = Promise<IBackendRes<T>>;

export const GetConversations = (status?: string, page = 1, pageSize = 20): R<IPaginatedRes<IConversation>> =>
    instance.get("/api/conversations", { params: { status, page, pageSize } }) as any;

export const CreateConversation = (body: ICreateConversationBody): R<IConversation> =>
    instance.post("/api/conversations", body) as any;

export const GetConversation = (id: number): R<IConversationDetail> =>
    instance.get(`/api/conversations/${id}`) as any;

export const GetMessages = (conversationId: number, page = 1, pageSize = 50): R<IPaginatedRes<IMessage>> =>
    instance.get(`/api/conversations/${conversationId}/messages`, { params: { page, pageSize } }) as any;

export const MarkConversationRead = (conversationId: number): R<null> =>
    instance.put(`/api/conversations/${conversationId}/read`) as any;

export const CloseConversation = (id: number): R<IConversation> =>
    instance.post(`/api/conversations/${id}/close`) as any;
