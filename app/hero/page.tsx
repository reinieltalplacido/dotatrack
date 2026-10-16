import { redirect } from "next/navigation";

export default function HeroRedirectPage() {
  redirect("/heroes");
}
