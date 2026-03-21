import { redirect } from "next/navigation";

export default function MentorshipRequestsPage() {
  redirect("/startup/experts?tab=requests");
}
