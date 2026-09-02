import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function CurrenciesSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Currencies</CardTitle>
        <CardDescription>Set up your favourite currencies</CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>content goes here</CardContent>
      <CardFooter>
        <p>this is footer</p>
      </CardFooter>
    </Card>
  );
}
