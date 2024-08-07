export interface Environment {
  inMaintenance?: boolean;
  production: boolean;
  apiUrls: ApiUrls;
}

export interface ApiUrls {
  auth: any;
  tool: CommonActions;
  content: CommonActions;
  project: CommonActions;
  user: CommonActions;
  feedback: string;
  subscription: any;
  payments: any;
  document: CommonActions;
}

export interface AuthActions {
  login: string;
  logout?: string;
  user?: string;
}

export interface CommonActions {
  create?: string;
  delete?: string;
  details?: string;
  list?: string;
  update?: string;
  download?: string;
  usage?: string;
  writeForMe?: string;
  search?: string;
  referral?: string;
  trash?: string;
  request?: string;
}
