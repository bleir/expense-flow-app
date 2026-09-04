import ColorsList from "./ColorsList";
import { CardAction, CardDescription } from "@/components/ui/card";
import NewColorDialog from "./NewColorDialog";

export default function ColorSettings() {
  return (
    <div>
      <div className="flex justify-between">
        <span>
          <CardDescription>Set up colors for your categories</CardDescription>
        </span>

        <CardAction>
          <NewColorDialog />
        </CardAction>
      </div>
      <div className="space-y-6">
        <ColorsList />
      </div>
    </div>
  );
}
