export interface PlanInterface {
  starter?: Pro;
  pro?: Pro;
}

export interface Pro {
  year?: Month;
  month?: Month;
}

export interface Month {
  plan_id?: string;
  currency?: string;
  price?: number;
}
