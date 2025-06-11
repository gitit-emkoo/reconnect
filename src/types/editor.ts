export interface Draft {
  title: string;
  content: string;
}

export interface CustomEditorRef {
  insertImages: (urls: string[]) => void;
}

export interface CustomRichTextEditorProps {
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
  initialTitle?: string;
  initialContent?: string;
  draftKey?: string;
} 