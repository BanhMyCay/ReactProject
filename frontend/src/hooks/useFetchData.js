import { useEffect, useState } from "react";

export const useFetchData = (url) => {
  const [data, setData] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setIsPending(true);
      try {
        const response = await fetch(url);
        const dataSource = await response.json();
        console.log(dataSource);
        setData(dataSource);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      }
      setIsPending(false);
    };

    getData();
  }, [url]);

  return { data, isPending, error };
};
