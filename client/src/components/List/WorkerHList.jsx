import React, { useEffect, useState } from "react";
import BaseCarousel from "../carousel/BaseCarousel";
import { api } from "../../api/axios.config";

export default function WorkerHList() {
  const [workers, setWorkers] = useState([]);
  useEffect(() => {
    async function fetchWorkers() {
      const { data } = await api.get("/api/workers/get");
      setWorkers(data.workers);
    }
    fetchWorkers();
  }, []);
  return <BaseCarousel data={workers} />;
}
