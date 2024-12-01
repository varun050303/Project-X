import React, { useEffect, useState } from "react";
import BaseCarousel from "../carousel/BaseCarousel";
import { api } from "../../api/axios.config";

export default function GenericHList({
  height,
  apiPath,
  dataKey,
  slideSize,
  CardComponent,
}) {
  const [data, setData] = useState([]); // Initializing state inside the component

  useEffect(() => {
    async function fetchData() {
      const { data } = await api.get(apiPath);
      setData(data[dataKey]); // Using state inside the component
    }
    fetchData();
  }, [apiPath]);

  return (
    <BaseCarousel
      slideSize={slideSize}
      height={height}
      data={data}
      CardComponent={CardComponent}
    />
  );
}
