import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SignupForm from "./signup-form";
import GoogleAuth from "@/section/auth/google-auth";

export default function SignupView() {
  return (
    <Card className="sm:w-[26rem]">
      <CardHeader>
        <CardTitle className="text-lg">Signup</CardTitle>
        <CardDescription>
          Enter your details to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleAuth />
        <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          or
        </p>
        <SignupForm />
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm">
          Already have an account?{" "}
          <Button variant="link" className="p-0" asChild>
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
