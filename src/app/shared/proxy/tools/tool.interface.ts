export interface ToolInterface {
  uuid?: string;
  name?: string;
  description?: string;
  favourite?: boolean;
  logo?: string;
  function_call?: string;
  inputs?: any[];
  categories?: Category[];
}

export interface Category {
  name?: string;
}

export interface ToolUpdateInterface {
  favourite: string;
}
