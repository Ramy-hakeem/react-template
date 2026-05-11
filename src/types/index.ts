export interface GetListPayload {
  pageNumber: number;
  pageSize: number;
  filters?: {
    propertyName: string;
    values: string[];
    type: string;
    operator: string;
  }[];
  sorts?: {
    propertyName: string;
    direction: 'asc' | 'desc' | '';
  }[];
  searchTerm?: string;
  deltaToken?: string;
  id?: string;
  role?: string;
}
