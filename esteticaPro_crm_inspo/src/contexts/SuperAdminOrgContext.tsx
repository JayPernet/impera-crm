import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface SuperAdminOrgContextType {
  selectedOrgIds: string[];
  setSelectedOrgIds: (ids: string[] | ((prev: string[]) => string[])) => void;
  hasSelectedOrgs: boolean;
}

const SuperAdminOrgContext = createContext<SuperAdminOrgContextType | undefined>(undefined);

export function SuperAdminOrgProvider({ children }: { children: ReactNode }) {
  const [selectedOrgIds, setSelectedOrgIdsState] = useState<string[]>([]);

  const setSelectedOrgIds = useCallback((idsOrUpdater: string[] | ((prev: string[]) => string[])) => {
    if (typeof idsOrUpdater === "function") {
      setSelectedOrgIdsState(idsOrUpdater);
    } else {
      setSelectedOrgIdsState(idsOrUpdater);
    }
  }, []);

  return (
    <SuperAdminOrgContext.Provider
      value={{
        selectedOrgIds,
        setSelectedOrgIds,
        hasSelectedOrgs: selectedOrgIds.length > 0,
      }}
    >
      {children}
    </SuperAdminOrgContext.Provider>
  );
}

export function useSuperAdminOrg() {
  const context = useContext(SuperAdminOrgContext);
  if (context === undefined) {
    throw new Error("useSuperAdminOrg must be used within a SuperAdminOrgProvider");
  }
  return context;
}
