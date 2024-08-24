import { ApiSearchParams, ApiSearchResponse, searchApi } from '@/services/api'
import { extractErrorMessage } from '@/services/api/utils'
import { UseQueryOptions, useQuery } from '@tanstack/react-query'

export type UseSearchParams = ApiSearchParams
export type UseSearchResponse = ApiSearchResponse

export const useSearch = (
  params: UseSearchParams,
  opts: Partial<UseQueryOptions<UseSearchResponse>> = {},
) => {
  return useQuery<UseSearchResponse>({
    queryKey: ['search', params.query],
    queryFn: async () => {
      try {
        return await searchApi(params)
      } catch (error) {
        throw new Error(extractErrorMessage(error))
      }
    },
    ...opts,
  })
}
