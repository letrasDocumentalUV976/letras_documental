"use client";

import Header from "@/component/Header/Header";
import { logout, setSessionUser, useV1Dispatch } from "@/store";
import { subscribeToAuthChanges } from "@/services/firebase/auth.service";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

interface IndexProps {
  children: React.ReactNode;
}

const Index = ({ children }: IndexProps) => {
  const path = usePathname();
  const dispatch = useV1Dispatch();

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      dispatch(setSessionUser(user));
      if (!user) dispatch(logout());
    });
    return unsubscribe;
  }, [dispatch]);

  return (
    <>
      {!path.includes("login") && <Header />}
      {children}
      <Toaster position="top-right" reverseOrder={true} />
    </>
  );
};

export default Index;
