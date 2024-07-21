export default interface Pagination {
  page: number;
  perPage: number;
  orderBy: string;
  orderDirection: 'ASC' | 'DESC';
}
