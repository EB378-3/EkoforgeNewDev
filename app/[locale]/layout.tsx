import { DevtoolsProvider } from "../../providers/devtools";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import BookIcon from '@mui/icons-material/Book';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import {
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

import { ColorModeContextProvider } from "@/contexts/color-mode";
import { authProviderClient } from "../../providers/auth-provider/auth-provider.client";
import { dataProvider } from "../../providers/data-provider";
import type { Viewport } from "next";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://wingtemplate.netlify.app";

const APP_NAME = "Wing T2";
const APP_DEFAULT_TITLE = "Wing-T2";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Wing-T2 Template App";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  metadataBase: new URL(defaultUrl),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  }, // default title
  description: APP_DESCRIPTION,
  manifest: "../manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};


export default async function RootLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const cookieStore = cookies();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang={locale}>
      <body>
        <Suspense>
          <RefineKbarProvider>
            <ColorModeContextProvider defaultMode={defaultMode}>
              <NextIntlClientProvider messages={messages}>
                <RefineSnackbarProvider>
                  <DevtoolsProvider>
                    <Refine
                      routerProvider={routerProvider}
                      authProvider={authProviderClient}
                      dataProvider={dataProvider}
                      notificationProvider={useNotificationProvider}
                      resources={[
                        {
                          name: "profiles",
                          list: `/${locale}/profile`,
                          edit: `/${locale}/profile/edit/:id`,
                          meta: {
                            icon: <AccountBoxIcon />,
                            label: "Profile",
                          },
                        },
                        {
                          name: "logbook",
                          list: `/${locale}/logbook`,
                          create: `/${locale}/logbook/create`,
                          edit: `/${locale}/logbook/edit/:id`,
                          show: `/${locale}/logbook/show/:id`,
                          meta: {
                            canDelete: true,
                            icon: <BookIcon />,
                          },
                        },
                        {
                          name: "cal",
                          list: `/${locale}/booking`,
                          create: `/${locale}/booking/create`,
                          edit: `/${locale}/booking/edit/:id`,
                          show: `/${locale}/booking/show/:id`,
                          meta: {
                            canDelete: true,
                            icon: <CalendarMonthIcon />,
                            label: "Bookings",
                          },
                        },
                        {
                          name: "Admin",
                          list: `/${locale}/admin`,
                          create: `/${locale}/admin/create`,
                          edit: `/${locale}/admin/edit/:id`,
                          show: `/${locale}/admin/show/:id`,
                          meta: {
                            canDelete: true,
                            icon: <CalendarMonthIcon />,
                            label: "Admin",
                          },
                        },
                        {
                          name: "resources",
                          list: `/${locale}/resource`,
                          create: `/${locale}/resource/create`,
                          edit: `/${locale}/resource/edit/:id`,
                          show: `/${locale}/resource/show/:id`,
                          meta: {
                            canDelete: true,
                            icon: <CalendarMonthIcon />,
                          },
                        },
                      ]}
                      options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                        useNewQueryKeys: true,
                        projectId: "L5lEaP-8nnveC-aoPsCf",
                      }}
                    >
                      {children}
                      <RefineKbar />
                    </Refine>
                  </DevtoolsProvider>
                </RefineSnackbarProvider>
              </NextIntlClientProvider>
            </ColorModeContextProvider>
          </RefineKbarProvider>
        </Suspense>
      </body>
    </html>
  );
}
