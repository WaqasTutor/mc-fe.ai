export interface WriteForMe {
  input_language: string;
  output_language: string;
  project_uuid: string;
  tool_uuid: string;
  template_name: string;
  data: KeyValue[];
}

export interface KeyValue {
  key: string;
  value: string;
}

export interface WriteForMeFormInterface {
  topic: string;
  context: string;
  keywords: string[];
  tone: string;
  no_of_chars: number;
  creativity: number;
}

export interface DocumentInterface {
  created_on: string,
  last_updated: string,
  name: string,
  text: string,
  uuid: string
}
