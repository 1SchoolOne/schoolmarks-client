import { useGetExempleQueries } from "../../data/store/queries/exempleQueries";
import { ExempleRepository } from "../repositories/exemple.repository";

export const exempleGetUsecase= (exempleRepository: ExempleRepository) => {
    function useGetexemple(){
        const {data, isFetching,isError, error}=
        useGetExempleQueries(exempleRepository);
        return {data, isFetching,isError, error};
    }