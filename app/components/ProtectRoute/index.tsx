"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import styles from "./style.module.css"; // Import SCSS styles




export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status, data } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // Redirect if not logged in
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className={styles.container}>
        Loading...
      </div>
    );
  }

  return <Fragment>{children}</Fragment>;
}
