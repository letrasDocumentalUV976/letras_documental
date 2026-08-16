"use client";

import Header from "@/component/Header/Header";
import { selectSessionUser, setSessionUser, useV1Dispatch, useV1Selector } from "@/store";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";

interface IndexProps {
  children: React.ReactNode;
}

const Index = ({ children }: IndexProps) => {
  const path = usePathname();
  const dispatch = useV1Dispatch();
  const sessionUser = useV1Selector(selectSessionUser);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sessionUser) {
      const storedUser = localStorage.getItem("user");
      dispatch(setSessionUser(storedUser ? JSON.parse(storedUser) : null));
    }
  }, [sessionUser, dispatch]);

  return (
    <>
      {!path.includes("login") && <Header />}
      {children}
      <Toaster position="top-right" reverseOrder={true} />
    </>
  );
};

export default Index;
