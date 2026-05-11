"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDisplayMode } from "../ThemeProvider";

interface MenuItem {
  label: string;
  href?: string;
  external?: boolean;
  onSelect?: () => void;
  separatorBefore?: boolean;
}

interface MenuGroup {
  trigger: string;
  items: MenuItem[];
}

function MenuTrigger({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="px-2 py-0.5 text-base uppercase tracking-wider text-black hover:bg-blue-700 hover:text-white data-[state=open]:bg-blue-700 data-[state=open]:text-white"
    >
      <span className="underline-offset-2">
        <span className="underline decoration-black">{label[0]}</span>
        {label.slice(1)}
      </span>
    </button>
  );
}

export default function MenuBar() {
  const { mode, toggleMode } = useDisplayMode();

  const menus: MenuGroup[] = [
    {
      trigger: "File",
      items: [
        { label: "New Session", onSelect: () => location.reload() },
        { label: "Reload", onSelect: () => location.reload() },
        {
          label: "Admin Login...",
          href: "/admin/login",
          separatorBefore: true,
        },
      ],
    },
    {
      trigger: "Edit",
      items: [{ label: "Cut" }, { label: "Copy" }, { label: "Paste" }],
    },
    {
      trigger: "View",
      items: [
        {
          label: mode === "crt" ? "[X] CRT Effects" : "[ ] CRT Effects",
          onSelect: toggleMode,
        },
        {
          label:
            mode === "accessible"
              ? "[X] Accessible Mode"
              : "[ ] Accessible Mode",
          onSelect: toggleMode,
        },
      ],
    },
    {
      trigger: "Goto",
      items: [
        {
          label: "GitHub",
          href: "https://github.com/nikolaitandberg",
          external: true,
        },
        {
          label: "LinkedIn",
          href: "https://linkedin.com/in/nikolaitandberg",
          external: true,
        },
        {
          label: "E-Mail",
          href: "mailto:nikolai.tandbe@gmail.com",
          external: true,
        },
      ],
    },
    {
      trigger: "Help",
      items: [
        {
          label: "About NIKOLAI.SYS",
          onSelect: () =>
            alert(
              "NIKOLAI.SYS v1.0\n(c) 2026 Nikolai Tandberg\n\nPress F10 to toggle display mode.",
            ),
        },
      ],
    },
  ];

  return (
    <div className="sticky top-0 z-40 bg-muted-chrome text-black border-b-2 border-black crt-bevel-out-thin">
      <div className="flex items-center gap-0 px-1 py-0.5">
        <span className="px-2 py-0.5 text-base uppercase tracking-wider font-bold border-r border-black mr-1 select-none">
          NIKOLAI.SYS
        </span>
        {menus.map((menu) => (
          <DropdownMenu key={menu.trigger}>
            <DropdownMenuTrigger asChild>
              <span>
                <MenuTrigger label={menu.trigger} />
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={2}>
              <DropdownMenuLabel className="bg-blue-700 text-white px-2 py-0.5 uppercase">
                {menu.trigger}
              </DropdownMenuLabel>
              {menu.items.map((item, i) => (
                <RenderItem key={`${menu.trigger}-${i}`} item={item} />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    </div>
  );
}

function RenderItem({ item }: { item: MenuItem }) {
  const content = (
    <DropdownMenuItem
      onSelect={(e) => {
        if (item.onSelect) {
          e.preventDefault();
          item.onSelect();
        }
      }}
      asChild={!!item.href}
    >
      {item.href ? (
        <a
          href={item.href}
          target={item.external ? "_blank" : undefined}
          rel={item.external ? "noopener noreferrer" : undefined}
        >
          {item.label}
        </a>
      ) : (
        <span>{item.label}</span>
      )}
    </DropdownMenuItem>
  );
  return item.separatorBefore ? (
    <>
      <DropdownMenuSeparator className="bg-black my-0" />
      {content}
    </>
  ) : (
    content
  );
}
