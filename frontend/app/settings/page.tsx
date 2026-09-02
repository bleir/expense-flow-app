import Heading from "@/components/Heading";
import SettingsList from "./components/SettingsList";

export default function SettingsPage() {
  return (
    <main className="p-6">
      <section>
        <Heading title="Settings">
          Manage your account and app preferences.
        </Heading>
      </section>
      <section>
        <SettingsList />
      </section>
    </main>
  );
}
