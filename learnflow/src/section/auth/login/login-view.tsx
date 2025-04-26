import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/section/auth/login/login-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import GoogleAuth from "@/section/auth/google-auth";

export default function LoginView() {
  return (
    <Card className="sm:w-[26rem]">
      <CardHeader>
        <CardTitle className="text-lg">Login</CardTitle>
        <CardDescription>
          Welcome back! Please sign in to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleAuth login={true} />
        <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          or
        </p>
        <LoginForm />
      </CardContent>
      <CardFooter>
        <div className="w-full text-center text-sm">
          Don&apos;t have an account?{" "}
          <Button variant="link" className="p-0" asChild>
            <Link href="/auth/signup">Signup</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
