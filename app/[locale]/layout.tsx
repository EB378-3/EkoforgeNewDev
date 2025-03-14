import { DevtoolsProvider } from "../../providers/devtools";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import BookIcon from '@mui/icons-material/Book';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import BroadcastOnHomeIcon from '@mui/icons-material/BroadcastOnHome';
import Groups3Icon from '@mui/icons-material/Groups3';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SchoolIcon from '@mui/icons-material/School';
import AirplaneTicketIcon from '@mui/icons-material/AirplaneTicket';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import ConnectingAirportsIcon from '@mui/icons-material/ConnectingAirports';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import RuleIcon from '@mui/icons-material/Rule';
import PersonIcon from '@mui/icons-material/Person';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PublicIcon from '@mui/icons-material/Public';
import ConstructionIcon from '@mui/icons-material/Construction';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

import {
  RefineSnackbarProvider,
  useNotificationProvider,
} from "@refinedev/mui";
import routerProvider from "@refinedev/nextjs-router";
import { Metadata } from "next";
import { cookies } from "next/headers";
import React, { Suspense } from "react";

import { ColorModeContextProvider } from "@/contexts/color-mode";
import { authProviderClient } from "@/providers/auth-provider/auth-provider.client";
import { dataProvider } from "@/providers/data-provider";
import type { Viewport } from "next";


const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://mik.fi";

const APP_NAME = "MIK";
const APP_DEFAULT_TITLE = "MIK";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Malmi Ilmailu Kerho App";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  metadataBase: new URL(defaultUrl),
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  }, // default title
  icons: {
    icon: "/icon.ico",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
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
                          name: "blogs",
                          list: `/${locale}/home`,
                          meta: {
                            icon: <BroadcastOnHomeIcon />,
                            label: "Home",
                          },
                        },
                        {
                          name: "flight school",
                          list: `/${locale}/flight_school`,
                          meta: {
                            label: "Flight School",
                            icon: <SchoolIcon />,
                          },
                        },
                        {
                          name: "aviation club",
                          list: `/${locale}/club`,
                          meta: {
                            label: "Aviation Club",
                            icon: <Groups3Icon />,
                          },
                        },
                        {
                          name: "resources",
                          list: `/${locale}/aircraft`,
                          meta: {
                            label: "Aircraft and simulators",
                            icon: <ConnectingAirportsIcon />,
                          },
                        },
                        {
                          name: "profiles",
                          identifier: "members",
                          meta: {
                            icon: <AirplanemodeActiveIcon />,
                            label: "Members",
                          },
                        },
                        {
                          name: "profiles",
                          identifier: "dashboard",
                          list: `/${locale}/members`,
                          meta: {
                            icon: <BroadcastOnHomeIcon />,
                            label: "Dashboard",
                            parent: "members",
                          },
                        },
                        {
                          name: "notice",
                          list: `/${locale}/members/saftey_notice`,
                          create: `/${locale}/members/saftey_notice/create`,
                          edit: `/${locale}/members/saftey_notice/edit/:id`,
                          show: `/${locale}/members/saftey_notice/show/:id`,
                          meta: {
                            canDelete: true,
                            icon: <GppMaybeIcon />,
                            parent: "members",
                            label: "Saftey Notice",
                          },
                        },
                        {
                          name:"flightplans",
                          identifier: "flight_planning_members",
                          meta: {
                            icon: <AirplaneTicketIcon />,
                            label: "Flight Planning",
                            parent: "members",
                          },
                        },
                        {
                          name: "flightplans",
                          list: `/${locale}/members/flight_planning`,
                          create: `/${locale}/members/flight_planning/create`,
                          edit: `/${locale}/members/flight_planning/edit/:id`,
                          show: `/${locale}/members/flight_planning/show/:id`,
                          meta: {
                            canDelete: true,
                            icon: <FlightTakeoffIcon />,
                            parent: "flight_planning_members",
                            label: "Dashboard",
                          },
                        },
                        {
                          name: "flightplans",
                          identifier: "international_flight_planning",
                          list: `/${locale}/members/international_flight_planning`,
                          create: `/${locale}/members/international_flight_planning/create`,
                          edit: `/${locale}/members/international_flight_planning/edit/:id`,
                          show: `/${locale}/members/international_flight_planning/show/:id`,
                          meta: {
                            canDelete: true,
                            icon: <PublicIcon />,
                            parent: "flight_planning_members",
                            label: "International",
                          },
                        },
                        {
                          name: "resources",
                          list: `/${locale}/members/equipment_info`,
                          create: `/${locale}/members/equipment_info/create`,
                          edit: `/${locale}/members/equipment_info/edit/:id`,
                          show: `/${locale}/members/equipment_info/show/:id`,
                          meta: {
                            icon: <ConstructionIcon />,
                            parent: "flight_planning_members",
                            label: "Equipment Hours and Information",
                          },
                        },
                        {
                          name: "profiles",
                          identifier: "members_profile_user",
                          list: `/${locale}/members/profile`,
                          edit: `/${locale}/members/profile/edit/:id`,
                          meta: {
                            icon: <AccountBoxIcon />,
                            label: "Profile",
                            parent: "members",
                          },
                        },
                        {
                          name: "bookings",
                          list: `/${locale}/members/bookings`,
                          create: `/${locale}/members/bookings/create`,
                          edit: `/${locale}/members/bookings/edit/:id`,
                          show: `/${locale}/members/bookings/show/:id`,
                          meta: {
                            canDelete: true,
                            icon: <CalendarMonthIcon />,
                            parent: "members",
                            label: "Booking Calendar",
                          },
                        },
                        {
                          name: "logbook",
                          list: `/${locale}/members/logbook`,
                          create: `/${locale}/members/logbook/create`,
                          edit: `/${locale}/members/logbook/edit/:id`,
                          show: `/${locale}/members/logbook/show/:id`,
                          meta: {
                            canDelete: true,
                            icon: <BookIcon />,
                            parent: "members",
                            label: "Logbook",
                          },
                        },
                        {
                          name: "logbook",
                          identifier: "statistics",
                          list: `/${locale}/members/statistics`,
                          show: `/${locale}/members/statistics/show/:id`,
                          meta: {
                            icon: <AnalyticsIcon />,
                            parent: "members",
                            label: "Flight Statistics",
                          },
                        },
                        {
                          name: "handbooks",
                          list: `/${locale}/members/handbooks`,
                          edit: `/${locale}/members/handbooks/show/:id`,
                          meta: {
                            icon: <LibraryBooksIcon />,
                            label: "Handbooks",
                            parent: "members",
                          },
                        },
                        {
                          name: "instructions",
                          list: `/${locale}/members/instructions`,
                          edit: `/${locale}/members/instructions/show/:id`,
                          meta: {
                            icon: <RuleIcon />,
                            label: "Instructions",
                            parent: "members",
                          },
                        },
                        {
                          name: "profiles",
                          identifier: "members_list",
                          list: `/${locale}/members/members`,
                          edit: `/${locale}/members/members/show/:id`,
                          meta: {
                            icon: <Groups3Icon />,
                            label: "Members",
                            parent: "members",
                          },
                        },
                        {
                          name: "flight_school",
                          identifier: "flight_school_members",
                          meta: {
                            icon: <SchoolIcon />,
                            label: "Flight School",
                            parent: "members",
                          },
                        },
                        {
                          name: "instructors",
                          list: `/${locale}/members/instructors`,
                          edit: `/${locale}/members/instructors/show/:id`,
                          meta: {
                            icon: <PersonIcon />,
                            label: "Instructors",
                            parent: "flight_school_members",
                          },
                        },
                        {
                          name: "students",
                          list: `/${locale}/members/student_checklist`,
                          edit: `/${locale}/members/student_checklist/show/:id`,
                          meta: {
                            icon: <ChecklistIcon />,
                            label: "Student Checklist",
                            parent: "flight_school_members",
                          },
                        },
                      ]}
                      options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                        useNewQueryKeys: true,
                        projectId: "L5lEaP-8nnveC-aoPsCf",
                        title: {
                          text: APP_DEFAULT_TITLE,
                        },
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
