"use client";

import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDefaultCurrency } from "@/lib/defaultCurrency";
import ColorsList from "./Colors/ColorsList";
import NewColorDialog from "./Colors/NewColorDialog";
import CurrenciesList from "./Currencies/CurrenciesList";
import NewCurrencyDialog from "./Currencies/NewCurrencyDialog";
import SettingsItemWrapper from "./SettingsItemWrapper";

function CurrenciesSection() {
  const { currencyId, currencies, setDefaultCurrencyId } = useDefaultCurrency();

  const selectedId = currencies?.some((currency) => currency.id === currencyId)
    ? currencyId
    : undefined;

  const handleChange = (id: string) => {
    setDefaultCurrencyId(id);
    toast.success("Default currency updated");
  };

  return (
    <SettingsItemWrapper
      modal={<NewCurrencyDialog />}
      list={
        <>
          <div className="space-y-2">
            <Label htmlFor="default-currency">Default currency</Label>
            <Select
              value={selectedId}
              onValueChange={handleChange}
              disabled={!currencies?.length}
            >
              <SelectTrigger id="default-currency" className="w-full">
                <SelectValue placeholder="Select a default currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies?.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    {currency.code} · {currency.currency} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CurrenciesList />
        </>
      }
    />
  );
}

const sections = [
  {
    name: "currencies",
    label: "Currencies",
    component: <CurrenciesSection />,
    description: (
      <CardDescription>Set up your favourite currencies</CardDescription>
    ),
  },
  {
    name: "color",
    label: "Color",
    component: (
      <SettingsItemWrapper list={<ColorsList />} modal={<NewColorDialog />} />
    ),
    description: (
      <CardDescription>Set up colors for your categories</CardDescription>
    ),
  },
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
                  <div>
                    {section.label}
                    {section.description}
                  </div>
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
