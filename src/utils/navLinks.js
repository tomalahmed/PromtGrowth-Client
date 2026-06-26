import { getDashboardPath } from "@/utils/roleRedirect";

const HOME = { href: "/", label: "Home", exact: true };
const MARKETPLACE = { href: "/prompts", label: "Marketplace" };
const CREATORS = { href: "/#top-creators", label: "Creators", hash: true };
const PREMIUM = { href: "/pricing", label: "Premium" };

export const PUBLIC_NAV_LINKS = [HOME, MARKETPLACE, CREATORS, PREMIUM];

export function getMainNavLinks(user) {
  if (!user) return PUBLIC_NAV_LINKS;

  const base = [HOME, MARKETPLACE];
  const premiumLink = user.isPremium ? [] : [PREMIUM];

  switch (user.role) {
    case "admin":
      return [
        ...base,
        { href: "/admin", label: "Admin", exact: true },
        { href: "/admin/prompts", label: "Moderation" },
        { href: "/admin/users", label: "Users" },
        { href: "/admin/reports", label: "Reports" },
      ];
    case "creator":
      return [
        ...base,
        { href: "/creator", label: "Creator Hub", exact: true },
        {
          href: "/creator/my-prompts",
          label: "My Prompts",
          matchPrefixes: ["/creator/my-prompts", "/creator/add-prompt", "/creator/edit-prompt"],
        },
        ...premiumLink,
      ];
    default:
      return [
        ...base,
        { href: "/user", label: "My Account", exact: true },
        { href: "/user/bookmarks", label: "Saved" },
        { href: "/user/reviews", label: "Reviews" },
        ...premiumLink,
      ];
  }
}

export function getDashboardLabel(role) {
  switch (role) {
    case "admin":
      return "Admin Panel";
    case "creator":
      return "Creator Hub";
    default:
      return "My Dashboard";
  }
}

export function getPrimaryAccountAction(user) {
  if (!user) return null;

  if (user.role === "creator") {
    return { href: "/creator/add-prompt", label: "Post Prompt" };
  }

  if (user.role === "user" && !user.isPremium) {
    return { href: "/pricing", label: "Upgrade" };
  }

  return null;
}

export function getDashboardHref(user) {
  if (!user) return "/user";
  return getDashboardPath(user.role);
}

export function isNavLinkActive(pathname, link) {
  if (link.hash) return false;
  if (link.exact) return pathname === link.href;

  if (link.matchPrefixes?.length) {
    return link.matchPrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
  }

  if (link.href === "/prompts") {
    return pathname === "/prompts" || pathname.startsWith("/prompts/");
  }

  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}
