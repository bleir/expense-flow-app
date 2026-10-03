import { CardAction } from "@/components/ui/card";

interface SettingsItemsWrapperProps {
  modal: React.ReactNode;
  list: React.ReactNode;
}

export default function SettingsItemWrapper({
  modal,
  list,
}: SettingsItemsWrapperProps) {
  return (
    <>
      <div className="flex justify-end">
        <CardAction>{modal}</CardAction>
      </div>
      <div className="space-y-6">{list}</div>
    </>
  );
}
