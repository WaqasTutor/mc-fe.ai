export interface ProjectInput {
  uuid?: string;
  name?: string;
  description: string;
  workspace_uuid?: string;
  selected?: boolean;
}
export interface ProjectInterface {
  uuid?: string;
  name?: string;
  description?: string;
  created_on?: Date;
  selected?: boolean;
  workspace?: Workspace;
  last_updated?: Date;
  total_contents?: number;
  default?: string;
}

export interface Workspace {
  uuid?: string;
  name?: string;
  company_id?: string;
  admin_user_id?: string;
  created_on?: Date;
}
export interface ProjectMessage {
  status?: string;
  message?: string;
  data?: Data;
}

export interface Data {
  uuid?: string;
  created_on?: Date;
  workspace_uuid?: string;
  name?: string;
  admin_uuid?: string;
  last_updated?: Date;
}

