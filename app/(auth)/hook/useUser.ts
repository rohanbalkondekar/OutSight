"use client";

// import { createSupabaseBrowser } from "@/lib/supabase/client";
// import { User } from "@supabase/supabase-js";
// import { useQuery } from "@tanstack/react-query";

// export default function useUser() {
// 	return useQuery({
// 		queryKey: ["user"],
// 		queryFn: async () => {
// 			const supabase = createSupabaseBrowser();
// 			const { data } = await supabase.auth.getUser();
// 			if (data.user) {
// 				return data.user;
// 			}
// 			return {} as User;
// 		},
// 	});
// }

import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

const supabase = createSupabaseBrowser();

const useUser = () => {
	const [data, setData] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      // Fetch current session asynchronously
      const { data: { session } } = await supabase.auth.getSession();
      setData(session?.user ?? null);
    };

    getSession();

    // Listen for session changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setData(null);
      } else if (event === 'SIGNED_IN') {
        setData(session?.user ?? null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { data };
};

export default useUser;
