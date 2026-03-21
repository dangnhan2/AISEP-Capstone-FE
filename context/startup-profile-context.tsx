"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { GetStartupProfile, UpdateStartupProfile } from "@/services/startup/startup.api";

interface StartupProfileContextType {
    profile: IStartupProfile | null;
    loading: boolean;
    saving: boolean;
    error: string | null;
    saveError: string | null;
    saveSuccess: boolean;
    fetchProfile: () => Promise<void>;
    updateProfile: (data: FormData) => Promise<boolean>;
    updateLocal: (partial: Partial<IStartupProfile>) => void;
    clearSaveStatus: () => void;
}

const StartupProfileContext = createContext<StartupProfileContextType | null>(null);

export function StartupProfileProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<IStartupProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await GetStartupProfile() as unknown as IBackendRes<IStartupProfile>;
            if ((res.success || res.isSuccess) && res.data) {
                setProfile(res.data);
            } else {
                setProfile(null);
                setError(res.message || "Không thể tải hồ sơ startup");
            }
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            if (status === 404) {
                // Profile not created yet — this is valid
                setProfile(null);
                setError(null);
            } else {
                setError("Lỗi kết nối. Vui lòng thử lại.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (data: FormData): Promise<boolean> => {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);
        try {
            const res = await UpdateStartupProfile(data) as unknown as IBackendRes<IStartupProfile>;
            if ((res.success || res.isSuccess) && res.data) {
                setProfile(res.data);
                setSaveSuccess(true);
                return true;
            } else {
                setSaveError(res.message || "Lưu thất bại");
                return false;
            }
        } catch {
            setSaveError("Lỗi kết nối. Vui lòng thử lại.");
            return false;
        } finally {
            setSaving(false);
        }
    }, []);

    const updateLocal = useCallback((partial: Partial<IStartupProfile>) => {
        setProfile(prev => prev ? { ...prev, ...partial } : null);
    }, []);

    const clearSaveStatus = useCallback(() => {
        setSaveError(null);
        setSaveSuccess(false);
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return (
        <StartupProfileContext.Provider value={{
            profile, loading, saving, error, saveError, saveSuccess,
            fetchProfile, updateProfile, updateLocal, clearSaveStatus,
        }}>
            {children}
        </StartupProfileContext.Provider>
    );
}

export function useStartupProfile() {
    const ctx = useContext(StartupProfileContext);
    if (!ctx) throw new Error("useStartupProfile must be used within StartupProfileProvider");
    return ctx;
}
