import { useQueryClient } from "@tanstack/react-query";

interface ReactQueryStore {
  setEntitiesToReactQueryStore: <T>(entities: T[], queryKey: string) => void;
}

export const useReactQueryStore = (): ReactQueryStore => {
  const queryClient = useQueryClient();

  function setEntitiesToReactQueryStore<T>(entities: T[], queryKey: string) {
    queryClient.setQueryData<T[]>([queryKey], entities);
  }

  return {
    setEntitiesToReactQueryStore,
  };
};

export type { ReactQueryStore };
