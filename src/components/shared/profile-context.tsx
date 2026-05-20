"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { PROFILES, type KOLProfile } from "@/lib/mock-data";

interface ProfileContextValue {
  activeProfile: KOLProfile;
  profiles: KOLProfile[];
  setActiveProfileId: (id: string) => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<string>(PROFILES[0].id);
  const activeProfile = PROFILES.find((p) => p.id === activeId) ?? PROFILES[0];

  return (
    <ProfileContext.Provider
      value={{
        activeProfile,
        profiles: PROFILES,
        setActiveProfileId: setActiveId,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used inside <ProfileProvider>");
  }
  return ctx;
}
