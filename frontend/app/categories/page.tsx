import Heading from "@/components/Heading";
import Page from "@/components/Page";
import CategoriesList from "./components/CategoriesList";
import NewCategoryDialog from "./components/NewCategoryDialog";

export default function CategoriesPage() {
  return (
    <Page>
      <section className="flex items-start justify-between gap-4">
        <Heading title="Categories & budgets">
          Monthly budgets, this month's pace.
        </Heading>
        <NewCategoryDialog />
      </section>
      <CategoriesList />
    </Page>
  );
}
