import "./globals.css";
import { EditorProvider } from "@/src/lib/editorMode";

export const metadata = {
  title: "The (un)Stable Net",
  description: "A blog about Business, Tech, AI & Content",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <EditorProvider>
          {children}
        </EditorProvider>
      </body>
    </html>
  );
}
