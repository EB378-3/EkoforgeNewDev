import { Header } from "@/components/header";
import { authProviderServer } from "@/providers/auth-provider/auth-provider.server";
import { ThemedLayoutV2 } from "@refinedev/mui";
import { redirect } from "next/navigation";
import React from "react";
import { CssBaseline, GlobalStyles } from "@mui/material";
import CrmNav from "@components/ui/crmNav"

export default async function Layout({ children }: React.PropsWithChildren) {
  const data = await getData();

  if (!data.authenticated) {
    return redirect(data?.redirectTo || "/login");
  }
  return (
    <ThemedLayoutV2 Header={Header}>
      <CssBaseline />
      <GlobalStyles styles={{ body: { backgroundColor: "#f5f5f5" } }}/>
      <CrmNav/>
      {children}
    </ThemedLayoutV2>
  );
}

async function getData() {
  const { authenticated, redirectTo } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
  };
}
