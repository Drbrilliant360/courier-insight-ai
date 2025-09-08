import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface UseSupabaseDataOptions {
  table: string;
  select?: string;
  orderBy?: { column: string; ascending?: boolean };
  filters?: { column: string; operator: string; value: any }[];
  realtime?: boolean;
}

export function useSupabaseData<T = any>({
  table,
  select = "*",
  orderBy,
  filters = [],
  realtime = false,
}: UseSupabaseDataOptions) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();

    if (realtime) {
      const channel = supabase
        .channel(`public:${table}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table,
          },
          () => {
            fetchData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [table, select, JSON.stringify(orderBy), JSON.stringify(filters), realtime]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table as any).select(select);

      // Apply filters
      filters.forEach(filter => {
        query = query.filter(filter.column, filter.operator, filter.value);
      });

      // Apply ordering
      if (orderBy) {
        query = query.order(orderBy.column, { ascending: orderBy.ascending ?? true });
      }

      const { data: result, error: queryError } = await query;

      if (queryError) throw queryError;

      setData(result || []);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching data",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const insert = async (newData: any) => {
    try {
      const { data: result, error } = await supabase
        .from(table as any)
        .insert([newData])
        .select()
        .single();

      if (error) throw error;

      setData(prev => [...prev, result]);
      
      toast({
        title: "Success",
        description: "Record created successfully",
      });

      return result;
    } catch (err: any) {
      toast({
        title: "Error creating record",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const update = async (id: string, updates: any) => {
    try {
      const { data: result, error } = await supabase
        .from(table as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setData(prev => prev.map(item => 
        item.id === id ? result : item
      ));

      toast({
        title: "Success",
        description: "Record updated successfully",
      });

      return result;
    } catch (err: any) {
      toast({
        title: "Error updating record",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq('id', id);

      if (error) throw error;

      setData(prev => prev.filter(item => item.id !== id));

      toast({
        title: "Success",
        description: "Record deleted successfully",
      });
    } catch (err: any) {
      toast({
        title: "Error deleting record",
        description: err.message,
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    insert,
    update,
    remove,
  };
}