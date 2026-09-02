import ColorSettings from "./ColorSettings";
import CurrenciesSettings from "./CurrenciesSettings";

export default function SettingsList() {
  return (
    <main className="flex flex-col gap-3">
      <CurrenciesSettings />

      <ColorSettings />
    </main>
  );
}
