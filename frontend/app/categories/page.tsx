import Heading from "@/components/Heading";
import CategoriesList from "./components/CategoriesList";
import NewCategoryDialog from "./components/NewCategoryDialog";

export default function CategoriesPage() {
  return (
    <main className="p-6">
      <section className="flex justify-between">
        <Heading title="Categories & budgets">
          Monthly budgets, this month's pace.
        </Heading>
        <NewCategoryDialog />
      </section>
      <section>
        <CategoriesList />
      </section>
    </main>
  );
}
