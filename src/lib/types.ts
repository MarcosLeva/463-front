

export type User = {
  id: string;
  name: string;
  login: string;
  avatar: string;
  balance: number;
  deposits: number;
  withdrawals: number;
  winnings: number;
  game: string;
  createdAt: string;
};

export type BalanceHistoryEntry = {
  id: number;
  operation: string;
  deposit: number;
  withdraw: number;
  wager: number;
  betLimit: number;
  balanceBefore: number;
  currency: string;
  date: string;
  time: string;
  initiator: string;
  fromUser: string;
  system: string;
  toUser: string;
  ip: string;
};

export type ProviderStatistic = {
  provider: string;
  seal: string;
  bet: number;
  win: number;
  winnings: number;
  wager: number;
  addedBet: number;
  rtp: number;
};

export type StatisticsEntry = User;

export type FilterCondition = {
  field: string;
  fieldLabel: string;
  operator: string;
  operatorLabel: string;
  value: string;
  forRow: boolean;
};

export type ChangeLogEntry = {
  id: number;
  initiator: string;
  user: string;
  page: string;
  action: string;
  changes: object | null;
  ip: string;
  date: string;
  time: string;
};

export type IntersectionIpEntry = {
  user: string;
  dateTime: string;
  ip: string;
};

export type HierarchyUser = {
  id: string;
  name: string;
  type: string;
  currency: string;
  balance: number;
  createdUsersCount: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalProfit: number;
  avgRtp: number;
  children: HierarchyUser[];
  level: number;
  isExpanded?: boolean;
};
    
