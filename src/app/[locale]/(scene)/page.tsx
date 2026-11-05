import { MAIN_CONTENT_ID } from "@/components/layout/SkipLink";
import { Scene } from "@/features/scene/Scene";

export default function Home() {
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1} className="outline-none">
      <Scene />
    </main>
  );
}
