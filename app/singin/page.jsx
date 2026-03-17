import { redirect } from "next/navigation";

export default function LegacySinginRedirectPage() {
  redirect("/sign-in");
}
