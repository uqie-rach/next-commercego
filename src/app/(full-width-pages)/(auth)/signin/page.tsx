import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | CommerceGo - Next.js Dashboard Template",
  description: "This is Next.js Signin Page CommerceGo Dashboard Template",
};

export default function SignIn() {
  return <SignInForm />;
}
