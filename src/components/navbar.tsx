import { useEffect, useState } from 'react';
import { Link } from '@heroui/link';
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@heroui/navbar';
import { Button } from '@heroui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeSwitch } from './theme-switch';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    setIsLoggedIn(!!token);
  }, []);

  const showLogin = !isLoggedIn && location.pathname === '/';
  const showRegister = !isLoggedIn && location.pathname === '/login';

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            aria-label="logo"
            href="/#home"
            className="hidden sm:flex items-center space-x-2"
          >
            <div aria-hidden="true" className="flex space-x-1">
              <div className="size-4 rounded-full bg-gray-900 dark:bg-white" />
              <div className="h-6 w-2 bg-primary dark:bg-violet-500" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              SentiSoft
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="basis-1/5 sm:basis-full" justify="end">
        <NavbarItem className="align-items-center justify-center gap-2">
          {showLogin && (
            <Button
              className="bg-gradient-to-tr from-[#371cff] to-[#49aff8] text-white shadow-lg self-center"
              radius="full"
              size="sm"
              variant="shadow"
              onPress={() => {
                navigate('/login');
              }}
            >
              <p className="leading-none">Login</p>
            </Button>
          )}
          {showRegister && (
            <Button
              className="bg-gradient-to-tr from-[#49aff8] to-[#371cff] text-white shadow-lg self-center"
              radius="full"
              size="sm"
              variant="shadow"
              onPress={() => {
                navigate('/');
              }}
            >
              <p className="leading-none">Register</p>
            </Button>
          )}
        </NavbarItem>
        <ThemeSwitch />
      </NavbarContent>
    </HeroUINavbar>
  );
};
