'use server';

import createSupabaseServerClient from "../../../../../lib/supabase/server";

export async function signUpWithEmailAndPassword(data: {
	email: string;
	password: string;
	confirm: string;
}) {

	const supabase = await createSupabaseServerClient();

	const result = await supabase.auth.signUp({
		email: data.email, 
		password: data.password
	});

	return JSON.stringify(result);
}

export async function signInWithEmailAndPassword(data: {
	email: string;
	password: string;
}) {

	const supabase = await createSupabaseServerClient();

	const result = await supabase.auth.signInWithPassword({
		email: data.email, 
		password: data.password
	});

	return JSON.stringify(result);
}


// export async function signInWithEmailAndPassword(data: {
// 	email: string;
// 	password: string;
// }) {
// 	const supabase = await createSupabaseServerClient();

// 	const result = await supabase.auth.signInWithPassword({
// 		email: data.email,
// 		password: data.password
// 	});

// 	if (result.error) {
// 		return JSON.stringify({ error: result.error.message });
// 	}

// 	const token = result.data.session.access_token;
// 	const userId = result.data.user.id;

// 	return JSON.stringify({ token, userId });
// }