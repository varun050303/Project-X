import { AppShell, Avatar, em } from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import '@mantine/core/styles/AppShell.css';
import { useAuth } from "../../contexts/auth.context";
import Logo from "../common/Logo";
import Navbar from "../common/Navbar";

export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: ${em(780)})`);
  const { user } = useAuth()
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="lg"
      transitionDuration={400}
    >
      <AppShell.Header className="h-auto min-h-10 flex justify-between items-center px-5 py-3" withBorder>
        <Logo />
        {/* Replace Burger with Avatar */}
        <Avatar
          src={user?.profile_pic} // Replace with actual image source
          alt="User avatar"
          radius="xl"
          size="md"
          style={{ cursor: 'pointer' }}
          onClick={toggle}
          name={user?.name}
          color="initials"
        />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar user={user} toggleNavbar={toggle} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}