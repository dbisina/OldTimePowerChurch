import { Navbar } from "../Navbar";
import { ThemeProvider } from "../ThemeProvider";

export default function NavbarExample() {
  return (
    <ThemeProvider>
      <Navbar onConnectClick={() => console.log("Connect clicked")} />
    </ThemeProvider>
  );
}
