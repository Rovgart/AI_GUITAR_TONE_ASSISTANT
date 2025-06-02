import { fetchAmps } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useFetchAmps = (query: string) => {
  return useQuery({
    queryKey: ["amps", query],
    queryFn: () => fetchAmps(query),
  });
};
