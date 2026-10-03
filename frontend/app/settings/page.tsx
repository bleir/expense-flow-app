import Heading from "@/components/Heading";
import Page from "@/components/Page";
import SettingsList from "./components/SettingsList";

export default function SettingsPage() {
  return (
    <Page>
      <Heading title="Settings">Manage your account and app preferences.</Heading>
      <SettingsList />
    </Page>
  );
}
