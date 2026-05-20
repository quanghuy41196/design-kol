import { POST_STATUS_META, type PostStatus } from "@/lib/mock-data";

export function PostStatusBadge({ status }: { status: PostStatus }) {
  const meta = POST_STATUS_META[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap"
      style={{ background: meta.bg, color: meta.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}
