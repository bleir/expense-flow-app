import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function ColorSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color</CardTitle>
        <CardDescription>Set up colors for your categories</CardDescription>
        <CardAction></CardAction>
      </CardHeader>
      <CardContent>content goes here</CardContent>
      <CardFooter>
        <p>this is footer</p>
      </CardFooter>
    </Card>
  );
}
