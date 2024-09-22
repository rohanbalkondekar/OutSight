// "use client";

// import { useState, useEffect } from 'react';
// import { createSupabaseBrowser } from '@/lib/supabase/client';
// import { User } from '@supabase/supabase-js';

// const supabase = createSupabaseBrowser();

// const useUser = () => {
// 	const [data, setData] = useState<User | null>(null);

//   useEffect(() => {
//     const getSession = async () => {
//       // Fetch current session asynchronously
//       const { data: { session } } = await supabase.auth.getSession();
//       setData(session?.user ?? null);
//     };

//     getSession();

//     // Listen for session changes
//     const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
//       if (event === 'SIGNED_OUT') {
//         setData(null);
//       } else if (event === 'SIGNED_IN') {
//         setData(session?.user ?? null);
//       }
//     });

//     return () => {
//       authListener?.subscription.unsubscribe();
//     };
//   }, []);

//   return { data };
// };

// export default useUser;


"use client";

import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

const supabase = createSupabaseBrowser();

const useUser = () => {
	const [data, setData] = useState<User | null>(null);
	const [isFetching, setIsFetching] = useState<boolean>(true); // Track loading state

	useEffect(() => {
		const getSession = async () => {
			setIsFetching(true); // Start fetching
			try {
				// Fetch current session asynchronously
				const { data: { session } } = await supabase.auth.getSession();
				setData(session?.user ?? null);
			} finally {
				setIsFetching(false); // Stop fetching once the session is fetched
			}
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

	return { data, isFetching }; // Return both data and isFetching
};

export default useUser;
