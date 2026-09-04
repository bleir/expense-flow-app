"use client";

import { toast } from "sonner";

import CurrenciesList from "./CurrenciesList";
import NewCurrencyDialog from "./NewCurrencyDialog";
import { CardAction, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDefaultCurrency } from "@/lib/defaultCurrency";

export default function CurrenciesSettings() {
  const { currencyId, currencies, setDefaultCurrencyId } = useDefaultCurrency();

  const selectedId = currencies?.some((currency) => currency.id === currencyId)
    ? currencyId
    : undefined;

  const handleChange = (id: string) => {
    setDefaultCurrencyId(id);
    toast.success("Default currency updated");
  };

  return (
    <>
      <div className="flex justify-between">
        <span>
          <CardDescription>Set up your favourite currencies</CardDescription>
        </span>

        <CardAction>
          <NewCurrencyDialog />
        </CardAction>
      </div>
      <div className="space-y-6 mt-4">
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
      </div>
    </>
  );
}
