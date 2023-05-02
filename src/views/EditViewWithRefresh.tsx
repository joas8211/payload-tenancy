import * as React from "react";
import { useAuth } from "payload/components/utilities";
import { Props } from "payload/dist/admin/components/views/collections/Edit/types";
import DefaultGlobalView from "payload/dist/admin/components/views/collections/Edit/Default";

export const EditViewWithRefresh: React.FC<Props> = (props) => {
  const { onSave } = props;
  const { refreshPermissions } = useAuth();
  const modifiedOnSave = React.useCallback(
    (...args) => {
      onSave.call(null, ...args);
      refreshPermissions();
    },
    [onSave, refreshPermissions]
  );

  return <DefaultGlobalView {...props} onSave={modifiedOnSave} />;
};
