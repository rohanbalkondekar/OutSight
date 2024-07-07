"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../../components/ui/tabs";
import SignInForm from "./SignInForm";
import RegisterForm from "./RegisterForm";
import OAuthForm from "./OAuthForm";

export function AuthForm() {
	return (
		<div className="w-full space-y-5">
			<Tabs defaultValue="signin" className="w-full">
				<TabsList className="grid w-full grid-cols-2 gap-1">
					<TabsTrigger value="signin" className="border">SignIn</TabsTrigger>
					<TabsTrigger value="register" className="border">Register</TabsTrigger>
				</TabsList>
				<TabsContent value="signin">
					<SignInForm />
				</TabsContent>
				<TabsContent value="register">
					<RegisterForm />
				</TabsContent>
			</Tabs>
			<OAuthForm />
		</div>
	);
}
