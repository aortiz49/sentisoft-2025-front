import { Link } from '@heroui/link';
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/navbar';

import { ThemeSwitch } from '@/components/theme-switch';

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <a
              aria-label="logo"
              className="flex items-center space-x-2"
              href="/#home"
            >
              <div aria-hidden="true" className="flex space-x-1">
                <div className="size-4 rounded-full bg-gray-900 dark:bg-white" />
                <div className="h-6 w-2 bg-primary dark:bg-violet-500" />
              </div>
              <span
                className={'text-2xl font-bold text-gray-900 dark:text-white'}
              >
                SentiSoft
              </span>
            </a>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>
    </HeroUINavbar>
  );
};
