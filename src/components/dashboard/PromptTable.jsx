import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCopyCount } from "@/lib/promptConstants";
import { formatPromptDate } from "@/lib/promptUtils";

const STATUS_VARIANT = {
  pending: "muted",
  approved: "primary",
  rejected: "default",
};

export default function PromptTable({
  prompts = [],
  showCreator = false,
  showActions = false,
  onApprove,
  onReject,
  onFeature,
  onDelete,
  onView,
  actionPending = false,
}) {
  if (prompts.length === 0) {
    return (
      <div className="rounded-2xl border border-outline-variant/15 bg-white p-8 text-center text-on-surface-variant">
        No prompts found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-outline-variant/15 bg-white shadow-sm">
      <table className="min-w-full text-left text-[14px]">
        <thead className="border-b border-outline-variant/15 bg-surface-container-low/50 text-[12px] uppercase tracking-wide text-on-surface-variant">
          <tr>
            <th className="px-4 py-3 font-semibold">Title</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            {showCreator && <th className="px-4 py-3 font-semibold">Creator</th>}
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Copies</th>
            <th className="px-4 py-3 font-semibold">Updated</th>
            {showActions && <th className="px-4 py-3 font-semibold">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {prompts.map((prompt) => (
            <tr key={prompt._id} className="border-b border-outline-variant/10 last:border-0">
              <td className="px-4 py-3 font-medium text-on-surface">{prompt.title}</td>
              <td className="px-4 py-3 text-on-surface-variant">{prompt.category}</td>
              {showCreator && (
                <td className="px-4 py-3 text-on-surface-variant">
                  {prompt.creator?.name || "—"}
                </td>
              )}
              <td className="px-4 py-3">
                <Badge variant={STATUS_VARIANT[prompt.status] || "muted"}>
                  {prompt.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-on-surface-variant">
                {formatCopyCount(prompt.copyCount)}
              </td>
              <td className="px-4 py-3 text-on-surface-variant">
                {formatPromptDate(prompt.updatedAt || prompt.createdAt)}
              </td>
              {showActions && (
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {onView && (
                      <Button size="sm" variant="outline" onClick={() => onView(prompt)}>
                        View
                      </Button>
                    )}
                    {onApprove && prompt.status === "pending" && (
                      <Button
                        size="sm"
                        onClick={() => onApprove(prompt)}
                        disabled={actionPending}
                      >
                        Approve
                      </Button>
                    )}
                    {onReject && prompt.status === "pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReject(prompt)}
                        disabled={actionPending}
                      >
                        Reject
                      </Button>
                    )}
                    {onFeature && prompt.status === "approved" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onFeature(prompt)}
                        disabled={actionPending}
                      >
                        {prompt.featured ? "Unfeature" : "Feature"}
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(prompt)}
                        disabled={actionPending}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
