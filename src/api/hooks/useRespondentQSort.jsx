import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";
import { kAPI_URL } from "../utils/constants";

export function useRespondentQSort() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchQSort = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const endpoints = [
          `${kAPI_URL}/api/respondent/${user.id}/qsort`,
          `${kAPI_URL}/api/qsort/${user.id}`,
        ];

        let items = [];
        let lastError = null;

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, { headers });
            if (!response.ok) {
              lastError = new Error(`Error: ${response.status} ${response.statusText}`);
              continue;
            }
            const result = await response.json();
            if (result.Error) {
              lastError = new Error(result.Message || "Failed to load qsort data");
              continue;
            }
            items = Array.isArray(result.data) ? result.data : Array.isArray(result) ? result : [];
            if (items.length) break;
          } catch (err) {
            lastError = err;
          }
        }

        if (!items.length && lastError) {
          throw lastError;
        }

        setData(items);
      } catch (err) {
        setError(err.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQSort();
  }, [user?.id]);

  return { data, loading, error };
}
