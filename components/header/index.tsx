"use client";

import { ColorModeContext } from "@contexts/color-mode";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useGetIdentity, useShow } from "@refinedev/core";
import { HamburgerMenu, RefineThemedLayoutV2HeaderProps } from "@refinedev/mui";
import React, { useContext } from "react";
import Lang from "@components/ui/Lang";
import { Button, Link } from "@mui/material";

type IUser = {
  id: number;
  name: string;
  avatar: string;
};

function ProfileAvatar({ profileId }: { profileId: string }) {
    const { queryResult } = useShow({
        resource: "profiles",
        id: profileId,
        meta: { select: "avatar_url" },
        queryOptions: { enabled: !!profileId },
    });
    const profileData = queryResult?.data?.data as { avatar_url: string;} | undefined;
    if (!profileData) return <span>Loading...</span>;
    return <Avatar src={profileData.avatar_url} alt={"pfp"} />;
}

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky = true,
}) => {
  const { mode, setMode } = useContext(ColorModeContext);

  const { data: user } = useGetIdentity<IUser>();

  return (
    <AppBar position={sticky ? "sticky" : "relative"}>
      <Toolbar>
        <Stack
          direction="row"
          width="100%"
          justifyContent="flex-end"
          alignItems="center"
        >
          <HamburgerMenu />
          <Stack
            direction="row"
            width="100%"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Lang />
            <IconButton
              color="inherit"
              onClick={() => {
                setMode();
              }}
            >
              {mode === "dark" ? <LightModeOutlined /> : <DarkModeOutlined />}
            </IconButton>

            {(user?.avatar || user?.name) && (
              <Stack
                direction="row"
                gap="16px"
                alignItems="center"
                justifyContent="center"
              >
                {user?.name && (
                  <Typography
                    sx={{
                      display: {
                        xs: "none",
                        sm: "inline-block",
                      },
                    }}
                    variant="subtitle2"
                  >
                    {user?.name}
                  </Typography>
                )}
                <ProfileAvatar profileId={user.id.toString()} />
              </Stack>
            )}
            {!user && (
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/login"
                sx={{ 
                }}
              >
                Login
              </Button>
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
