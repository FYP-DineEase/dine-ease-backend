export enum ApprovalStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum InfoStatus {
  PENDING = 'pending',
}

// Combined Enum for all status
export const StatusTypes = { ...ApprovalStatus, ...InfoStatus };
export type Status = ApprovalStatus | InfoStatus;
