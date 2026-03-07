import { createSignal } from "solid-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/features/ui/components/card";
import { RichTextEditor } from "~/features/ui/components/rich-text-editor";
import { createForm } from "~/features/ui/form/form-factory";

export function RichTextDemo() {
  const [standaloneHtml, setStandaloneHtml] = createSignal("<p>Start typing here...</p>");

  const form = createForm({
    defaultValues: { body: "", summary: "" },
    fields: [
      {
        name: "body" as const,
        label: "Article Body",
        type: "richtext" as const,
        placeholder: "Write your article content...",
        description: "Supports bold, italic, headings, lists, and more.",
        richtextConfig: { maxLength: 500, minHeight: "200px" },
      },
      {
        name: "summary" as const,
        label: "Summary",
        type: "textarea" as const,
        placeholder: "Short summary of the article...",
        rows: 3,
      },
    ],
    onSubmit: (values) => {
      alert(`Submitted!\n\nBody (HTML):\n${values.body}\n\nSummary:\n${values.summary}`);
    },
    submitLabel: "Publish Article",
  });

  return (
    <div class="space-y-4">
      {/* Standalone editor */}
      <Card>
        <CardHeader>
          <CardTitle>Standalone Rich Text Editor</CardTitle>
          <CardDescription>
            Controlled editor with toolbar, character count, and live HTML output.
          </CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <RichTextEditor
            value={standaloneHtml()}
            onChange={setStandaloneHtml}
            placeholder="Type something rich..."
            maxLength={300}
            minHeight="180px"
          />
          <div class="rounded-md border bg-muted p-3">
            <p class="mb-1 text-xs font-medium text-muted-foreground">HTML output:</p>
            <pre class="whitespace-pre-wrap break-all text-xs">{standaloneHtml()}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Rich text inside createForm */}
      <Card>
        <CardHeader>
          <CardTitle>Rich Text Inside createForm()</CardTitle>
          <CardDescription>
            Use <code class="rounded bg-muted px-1 text-xs">type: "richtext"</code> in the field
            config. Supports validation, required state, and error messages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.Form />
        </CardContent>
      </Card>
    </div>
  );
}
