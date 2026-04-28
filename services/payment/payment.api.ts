import axios from "../interceptor";

export enum TargetPlan {
  Free = 0,
  Pro = 1,
  Fundraising = 2
}

export const CreatePaymentLink = (amount: number, mentorshipId: number) => {
  return axios.post<IBackendRes<IPaymentInfo>>(
    "/api/Payment/create-payment-link",
    { amount, mentorshipId }
  );
};

export const CreatePaymentLinkForSubscription = (targetPlan: TargetPlan, amount: number) => {
  return axios.post<IBackendRes<IPaymentInfo>>(
    "/api/Payment/subscription/create-payment-link",
    { targetPlan, amount }
  );
};

export const Cashout = (transactionId : number) => {
  return axios.post<IBackendRes<string>>(`/api/Transfer/cashout`, {
    transactionId
  })
}

export const SyncPayment = (orderCode: number | string, mentorshipId?: number | string) => {
  const url = mentorshipId 
    ? `/api/Payment/sync/${orderCode}?mentorshipId=${mentorshipId}`
    : `/api/Payment/sync/${orderCode}`;
  return axios.post<IBackendRes<string>>(url);
};
