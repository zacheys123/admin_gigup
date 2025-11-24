"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useFeatureFlags() {
  const flags = useQuery(api.controllers.featureFlags.getFeatureFlags);
  const initializeFlags = useMutation(
    api.controllers.featureFlags.initializeFeatureFlags
  );
  const setFlag = useMutation(api.controllers.featureFlags.setFeatureFlag);
  const deleteFlag = useMutation(
    api.controllers.featureFlags.deleteFeatureFlag
  );
  const updateRollout = useMutation(
    api.controllers.featureFlags.updateFeatureFlagRollout
  );

  const getFlagById = (flagId: string) => {
    return flags?.find((flag) => flag.id === flagId);
  };

  const getEnabledFlags = () => {
    return flags?.filter((flag) => flag.enabled) || [];
  };

  return {
    flags: flags || [],
    initializeFlags,
    setFlag,
    deleteFlag,
    updateRollout,
    getFlagById,
    getEnabledFlags,
    isLoading: flags === undefined,
  };
}
