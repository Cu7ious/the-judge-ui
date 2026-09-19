import { NewEvaluationForm } from "@/components/runs/NewEvaluationForm";
import { PageTitle } from "@/components/ui/primitives";

export default function NewEvaluationPage() {
  return (
    <div>
      <PageTitle>New evaluation</PageTitle>
      <NewEvaluationForm />
    </div>
  );
}
