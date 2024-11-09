import { MockedObject } from 'vitest'

import { axiosInstance } from '@api/axiosInstance'

vi.mock('../api/axiosInstance')
/**
 * Permet de mocker les requêtes axios.
 *
 * @example
 *
 * mockAxios.get.mockResolvedValue({ data: [{userId: 1, first_name: 'toto' }] })
 */
export const mockAxios = axiosInstance as MockedObject<typeof axiosInstance>
