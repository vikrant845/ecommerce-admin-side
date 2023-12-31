"use client";

import { cn } from "@/lib/utils";
import { onOpen } from "@/states/slices/modalSlice";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";

const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const pathName = usePathname();
  const params = useParams();
  const dispatch = useDispatch();
  const routes = [
    {
      href: `/${ params.storeId }`,
      label: 'Overview',
      active: pathName === `/${ params.storeId }`,
    },
    {
      href: `/${ params.storeId }/billboards`,
      label: 'Billboards',
      active: pathName === `/${ params.storeId }/billboards`,
    },
    {
      href: `/${ params.storeId }/settings`,
      label: 'Settings',
      active: pathName === `/${ params.storeId }/settings`
    },
    {
      href: `/${ params.storeId }/categories`,
      label: 'Categories',
      active: pathName === `/${ params.storeId }/categories`,
    },
    {
      href: `/${ params.storeId }/sizes`,
      label: 'Sizes',
      active: pathName === `/${ params.storeId }/sizes`,
    },
    {
      href: `/${ params.storeId }/colors`,
      label: 'Colors',
      active: pathName === `/${ params.storeId }/colors`,
    },
    {
      href: `/${ params.storeId }/products`,
      label: 'Products',
      active: pathName === `/${ params.storeId }/products`,
    },
    {
      href: `/${ params.storeId }/orders`,
      label: 'Orders',
      active: pathName === `/${ params.storeId }/orders`,
    }
  ];
  
  return (
    <nav
      className={ cn('flex items-center space-x-4 lg:space-x-6', className) }
    >
      { routes.map(route => (
        <Link
          href={ route.href }
          key={ route.href }
          className={ cn('text-sm font-medium transition-colors hover:text-primary', route.active ? 'text-black dark:text-white' : 'text-muted-foreground') }
        >
          { route.label }
        </Link>
      )) }
      <p className="underline cursor-pointer" onClick={ () => dispatch(onOpen()) }>Show Project Info</p>
    </nav>
  );
}

export default MainNav;