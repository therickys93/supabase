import { QueryClient, useQuery, UseQueryOptions } from '@tanstack/react-query'

import { components } from 'api-types'
import { get, handleError } from 'data/fetchers'
import { useProfile } from 'lib/profile'
import type { Organization, ResponseError } from 'types'
import { organizationKeys } from './keys'

export type OrganizationBase = components['schemas']['OrganizationResponse']

export function castOrganizationResponseToOrganization(org: OrganizationBase): Organization {
  return {
    ...org,
    billing_email: org.billing_email ?? 'Unknown',
    managed_by: org.slug.startsWith('vercel_icfg_') ? 'vercel-marketplace' : 'supabase',
    partner_id: org.slug.startsWith('vercel_') ? org.slug.replace('vercel_', '') : undefined,
  }
}

export async function getOrganizations({
  signal,
  headers,
}: {
  signal?: AbortSignal
  headers?: Record<string, string>
}): Promise<Organization[]> {
  const { data, error } = await get('/platform/organizations', { signal, headers })

  if (error) handleError(error)
  if (!Array.isArray(data)) return []

  return data
    .map(castOrganizationResponseToOrganization)
    .sort((a, b) => a.name.localeCompare(b.name))
}

export type OrganizationsData = Awaited<ReturnType<typeof getOrganizations>>
export type OrganizationsError = ResponseError

export const useOrganizationsQuery = <TData = OrganizationsData>({
  enabled = true,
  ...options
}: UseQueryOptions<OrganizationsData, OrganizationsError, TData> = {}) => {
  const { profile } = useProfile()
  return useQuery<OrganizationsData, OrganizationsError, TData>(
    organizationKeys.list(),
    ({ signal }) => getOrganizations({ signal }),
    { enabled: enabled && profile !== undefined, ...options, staleTime: 30 * 60 * 1000 }
  )
}

export function invalidateOrganizationsQuery(client: QueryClient) {
  return client.invalidateQueries(organizationKeys.list())
}
