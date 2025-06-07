import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import ConfirmationModal from './ConfirmationModal';

// Styled Components (화이트톤, 기존 폼과 통일)
const EditorWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  padding: 20px 16px 12px 16px;
  max-width: 100%;
  box-shadow: none;
  margin: 0;
`;
const TitleInput = styled.input`
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  background: transparent;
  color: #212529;
  margin-bottom: 12px;
  outline: none;
  padding: 4px 0;
  &::placeholder {
    color: #adb5bd;
    font-weight: 500;
  }
`;
const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;
const ToolButton = styled.button<{active?: boolean}>`
  background: ${({active}) => active ? '#e9ecef' : 'transparent'};
  color: #495057;
  border: none;
  border-radius: 4px;
  padding: 4px 7px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.15s;
  &:hover { background: #f1f3f5; }
`;
const EditorArea = styled.div`
  min-height: 160px;
  background: #fff;
  color: #212529;
  border-radius: 6px;
  border: 1px solid #dee2e6;
  padding: 12px;
  font-size: 1rem;
  outline: none;
  margin-bottom: 8px;
  white-space: pre-wrap;
  position: relative;
  transition: border 0.15s;
  &:focus {
    border-color: #FF69B4;
    box-shadow: 0 0 0 2px rgba(255, 105, 180, 0.08);
  }
`;
const Placeholder = styled.div`
  position: absolute;
  top: 12px;
  left: 16px;
  color: #adb5bd;
  pointer-events: none;
  font-size: 1rem;
`;


const HiddenInput = styled.input`
  display: none;
`;

// Helper for execCommand
const format = (command: string, value?: string) => {
  document.execCommand(command, false, value);
};

// 임시저장 키
const STORAGE_KEY = 'custom_rich_text_editor_draft';

interface Draft {
  title: string;
  content: string;
}

interface CustomRichTextEditorProps {
  onTitleChange?: (title: string) => void;
  onContentChange?: (content: string) => void;
}

const CustomRichTextEditor: React.FC<CustomRichTextEditorProps> = ({ onTitleChange, onContentChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [draftToLoad, setDraftToLoad] = useState<Draft | null>(null);

  // 임시저장: 3초마다
  useEffect(() => {
    const interval = setInterval(() => {
      const html = editorRef.current?.innerHTML || '';
      setContent(html);
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, content: html }));
    }, 3000);
    return () => clearInterval(interval);
  }, [title]);

  // 페이지 진입 시 임시저장 데이터 있으면 모달 띄우기
  useEffect(() => {
    const draft = localStorage.getItem(STORAGE_KEY);
    if (draft) {
      const { title, content } = JSON.parse(draft);
      if (title || content) {
        setDraftToLoad({ title, content });
        setShowDraftModal(true);
      }
    }
  }, []);

  // 모달에서 '예' 누르면 임시저장 불러오기
  const handleLoadDraft = () => {
    if (draftToLoad) {
      setTitle(draftToLoad.title);
      setContent(draftToLoad.content);
      if (editorRef.current) editorRef.current.innerHTML = draftToLoad.content;
    }
    setShowDraftModal(false);
  };
  // 모달에서 '아니오' 누르면 닫기
  const handleIgnoreDraft = () => {
    setShowDraftModal(false);
  };

  // 툴바 핸들러
  const handleFormat = (cmd: string, value?: string) => {
    format(cmd, value);
    editorRef.current?.focus();
  };

  // 이미지 업로드
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      format('insertImage', reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // 이미지 URL 삽입
  const handleImageUrl = () => {
    const url = prompt('이미지 URL을 입력하세요');
    if (url) handleFormat('insertImage', url);
  };

  // 링크 삽입
  const handleLink = () => {
    const url = prompt('링크 주소를 입력하세요');
    if (url) handleFormat('createLink', url);
  };

  // 정렬
  const handleAlign = (align: 'left'|'center'|'right') => {
    handleFormat('justify' + align.charAt(0).toUpperCase() + align.slice(1));
  };

  // 제목/내용 변경 시 부모로 전달
  useEffect(() => {
    if (onTitleChange) onTitleChange(title);
  }, [title, onTitleChange]);
  useEffect(() => {
    if (onContentChange) onContentChange(content);
  }, [content, onContentChange]);

  return (
    <>
      <EditorWrapper>
        <TitleInput
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={60}
        />
        <Toolbar>
          <ToolButton onClick={() => handleFormat('bold')} title="굵게"><b>B</b></ToolButton>
          <ToolButton onClick={() => handleFormat('italic')} title="이탤릭"><i>I</i></ToolButton>
          <ToolButton onClick={() => handleFormat('underline')} title="밑줄"><u>U</u></ToolButton>
          <ToolButton onClick={() => handleAlign('left')} title="왼쪽 정렬">좌</ToolButton>
          <ToolButton onClick={() => handleAlign('center')} title="가운데 정렬">중</ToolButton>
          <ToolButton onClick={() => handleAlign('right')} title="오른쪽 정렬">우</ToolButton>
          <ToolButton onClick={() => fileInputRef.current?.click()} title="이미지 업로드">🖼️</ToolButton>
          <ToolButton onClick={handleImageUrl} title="이미지 URL">🌐</ToolButton>
          <ToolButton onClick={handleLink} title="링크">🔗</ToolButton>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Toolbar>
        <div style={{position: 'relative'}}>
          <EditorArea
            ref={editorRef}
            contentEditable
            spellCheck={false}
            onInput={e => setContent((e.target as HTMLDivElement).innerHTML)}
            style={{minHeight: 160}}
          />
          {(!content || content === '<br>') && (
            <Placeholder>내용을 적어주세요</Placeholder>
          )}
        </div>
      </EditorWrapper>
      <ConfirmationModal
        isOpen={showDraftModal}
        onRequestClose={handleIgnoreDraft}
        onConfirm={handleLoadDraft}
        title="임시저장 불러오기"
        message="임시저장된 글이 있습니다. 불러올까요?"
        confirmButtonText="예"
        cancelButtonText="아니오"
      />
    </>
  );
};

export default CustomRichTextEditor; 