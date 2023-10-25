import * as React from "react";
import { useFormProcessing, useFormSubmitted } from "payload/components/forms";
import { useAuth } from "payload/components/utilities";

export const RefreshPermissionsField: React.FC = () => {
  const submitted = useFormSubmitted();
  const processing = useFormProcessing();
  const { refreshPermissions } = useAuth();
  React.useEffect(() => {
    if (submitted && !processing) {
      refreshPermissions();
    }
  }, [submitted, processing]);
  return null;
};
