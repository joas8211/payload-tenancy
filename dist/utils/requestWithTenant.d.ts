import { PayloadRequest, Document } from "payload/types";
/** Request has a tenant when isolation strategy is "path". */
export type RequestWithTenant = PayloadRequest & {
    tenant: Document;
};
