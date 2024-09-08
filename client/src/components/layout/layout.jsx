import { AppShell, Burger, em } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from '@mantine/hooks';
import '@mantine/core/styles/AppShell.css';
import Logo from "../common/Logo";
export function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery(`(max-width: ${em(780)})`);
  console.log('Layout component rendered');
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
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      </AppShell.Header>

      <AppShell.Navbar p="md">{isMobile ? <div>Mobile</div> : <div>Desktop</div>}</AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
