import DiaryApp from "./DiaryApp";
import DiaryGuard from "./DiaryGuard";

export default function DiaryPage() {
  return (
    <DiaryGuard>
      <DiaryApp />
    </DiaryGuard>
  );
}
