import { ExempleRepository } from "../../../domain/repositories/exemple.repository";


const EXEMPLE_QUERY = `exemple_query_key`;

export const useGetExempleQueries = (
  exempleRepository : ExempleRepository,
)=> {
    return useQuery(EXEMPLE_QUERY, async () => {
        queryKey: [EXEMPLE_QUERY],
        queryFn: () => exempleRepository.getAll(),
    });
}; 