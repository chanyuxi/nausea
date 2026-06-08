export interface DataViewResponse<
  TData,
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> {
  data: TData[]
  total: number
  meta?: TMeta
}
