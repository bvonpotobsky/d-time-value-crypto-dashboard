import Link from "next/link";
import {useState} from "react";
import {useTheme} from "next-themes";
import {useMountEffect} from "hooks/useMountEffect";

import {WordmarkLogoWhite, WordmarkLogoBlack, Moon, Sun, WalletIcon, LogoutIcon} from "@/assets/svg";

import {useAccount, useConnect, useDisconnect} from "wagmi";
import {InjectedConnector} from "wagmi/connectors/injected";
import Text from "./Text";

const Header: React.FC = (): JSX.Element | null => {
  const {address, isConnected, connector, status} = useAccount();
  const {connect} = useConnect({connector: new InjectedConnector()});
  const {disconnect} = useDisconnect();

  const {resolvedTheme} = useTheme();
  // When mounted on client, now we can show the UI. This is a workaround for the hydration issue.
  const [isMounted, setIsMounted] = useState(false);
  useMountEffect(() => setIsMounted(true));

  if (!isMounted) return null;

  return (
    <header className="w-full flex items-center justify-end gap-x-3 p-2 md:p-4">
      <Link href="/">
        <a className="mr-auto">{resolvedTheme === "dark" ? <WordmarkLogoWhite /> : <WordmarkLogoBlack />}</a>
      </Link>

      {isConnected ? (
        <div className="relative flex items-center">
          <p
            className="w-28 hover:w-36 xs:hover:w-60 sm:hover:w-96 transition-all truncate cursor-default"
            title={address}
          >
            Connected to {address}
          </p>
          <button onClick={() => disconnect()} title="Log out">
            <LogoutIcon />
          </button>
        </div>
      ) : (
        <button onClick={() => connect()} title="Connect to your wallet">
          <WalletIcon />
        </button>
      )}

      <ThemeToggle />
    </header>
  );
};

const ThemeToggle: React.FC = (): JSX.Element => {
  const {resolvedTheme, setTheme} = useTheme();

  // When mounted on client, now we can show the UI. This is a workaround for the hydration issue.
  const [isMounted, setIsMounted] = useState(false);
  useMountEffect(() => setIsMounted(true));

  return (
    <button
      aria-label="Toggle Dark Mode or Light Mode"
      className="p-1.5 rounded bg-black/10"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {isMounted && (resolvedTheme === "dark" ? <Sun /> : <Moon />)}
    </button>
  );
};

export default Header;
