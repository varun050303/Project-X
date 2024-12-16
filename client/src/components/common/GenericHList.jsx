import React from "react";
import BaseCarousel from "../carousel/BaseCarousel";
import { api } from "../../api/axios.config";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@mantine/core";
export default function GenericHList({
  height,
  apiPath,
  dataKey,
  slideSize,
  CardComponent,
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: [apiPath, dataKey],
    queryFn: async () => {
      const response = await api.get(apiPath);
      return response.data[dataKey];
    },
  });

  if (isLoading)
    return (
      <>
        <Skeleton h={200} w={208} visible={isLoading}></Skeleton>
      </>
    );
  if (error) return <div>Error fetching data</div>;

  return (
    <BaseCarousel
      slideSize={slideSize}
      height={height}
      data={data || []}
      CardComponent={CardComponent}
    />
  );
}
