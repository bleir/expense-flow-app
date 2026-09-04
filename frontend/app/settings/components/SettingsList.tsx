import { Card, CardContent } from "@/components/ui/card";
import ColorSettings from "./ColorSettings";
import CurrenciesSettings from "./CurrenciesSettings";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const sections = [
  {
    name: "currencies",
    label: "Currencies",
    component: <CurrenciesSettings />,
  },
  { name: "color", label: "Color", component: <ColorSettings /> },
];

export default function SettingsList() {
  return (
    <main className="flex flex-col gap-3">
      {sections.map((section) => (
        <Card key={section.name} className="py-2">
          <CardContent>
            <Accordion type="multiple">
              <AccordionItem value={section.name}>
                <AccordionTrigger className="cursor-pointer hover:no-underline">
                  {section.label}
                </AccordionTrigger>
                <AccordionContent>{section.component}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
