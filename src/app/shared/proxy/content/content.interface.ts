import { ToolInterface } from "../tools/tool.interface";

export interface ContentInterface {
  activity_uuid?: string;
  uuid?: string;
  inputs?: string;
  text?: string;
  s3_file_path?: string;
  is_favourite?: string;
  flagged?: string;
  trashed?: string;
  saved?: string;
  tool: ToolInterface;
  created_on?: Date;
  updated_on?: Date;
  project_uuid?: string;
}


export interface ContentInputInterface {
  tool_uuid?: string;
  project_uuid?: string;
  template_name?: string;
  input_language?: string;
  output_language?: string;
  data?: Datum[];
}
export interface Datum {
  key?: string;
  value?: string;
}
export enum ContentStatus {
  selected = '1',
  notSelected = '0'
}
export interface ContentUpdateInputInterface {
  uuid?: string;
  inputs?: string;
  text?: string;
  s3_file_path?: string;
  favourite?: ContentStatus;
  flagged?: ContentStatus;
  trashed?: ContentStatus;
  saved?: ContentStatus;
  created_on?: string;
  updated_on?: string;
}
