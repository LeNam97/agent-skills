import { Button } from "@workspace/ui/components/button";
import { PM01_QUAN_LY_BOOKING } from "@workspace/permissions";
import { EntityStatus } from "@ac/models/types";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold">Agent Skills Monorepo</h1>
      <p className="text-zinc-600">
        Packages wired: UI, permissions, shared DTOs, and API models.
      </p>
      <dl className="grid gap-2 text-sm text-zinc-700">
        <div>
          <dt className="font-medium">Permission sample</dt>
          <dd>{PM01_QUAN_LY_BOOKING}</dd>
        </div>
        <div>
          <dt className="font-medium">Entity status</dt>
          <dd>{EntityStatus.ACTIVE}</dd>
        </div>
      </dl>
      <Button type="button">@workspace/ui Button</Button>
    </main>
  );
}
