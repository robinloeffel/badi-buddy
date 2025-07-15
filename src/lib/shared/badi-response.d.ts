export interface BadiResponseItem {
  id: string;
  name: string;
  temperature: string;
  open: boolean;
  url: string;
}

export type BadiResponse = BadiResponseItem[];
