import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { mockContents } from '../mocks/mockContents';
import PageLayout from '../components/Layout/PageLayout';
import Header from '../components/common/Header';
import { ADMIN_CONFIG } from '../config/admin';
import useAuthStore from '../store/authStore';

const AdminContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const ContentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const ContentCard = styled.div`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const ContentTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #333;
`;

const ContentChip = styled.span`
  background: #ff6fcb;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  margin-bottom: 8px;
  display: inline-block;
`;

const ContentDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin: 8px 0;
  line-height: 1.4;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  font-size: 14px;
`;

const Input = styled.input`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: #667eea;
          color: white;
          &:hover { background: #5a6fd8; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #6c757d;
          color: white;
          &:hover { background: #5a6268; }
        `;
    }
  }}
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-weight: 600;
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

interface Content {
  id: string;
  title: string;
  category: string;
  chip: string;
  description: string;
  content: string;
  thumbnail: string;
  createdAt: string;
  locked: boolean;
}

const ContentAdmin: React.FC = () => {
  const [contents, setContents] = useState<Content[]>(mockContents);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const user = useAuthStore((state) => state.user);

  const [formData, setFormData] = useState<Partial<Content>>({
    title: '',
    category: '',
    chip: '',
    description: '',
    content: '',
    thumbnail: '',
    locked: false,
  });

  // 관리자 권한 체크
  useEffect(() => {
    const checkAdminAuth = () => {
      // auth store에서 사용자 이메일 가져오기
      const userEmail = user?.email;
      
      if (userEmail && ADMIN_CONFIG.isAdmin(userEmail)) {
        setIsAuthorized(true);
      } else {
        // 권한이 없으면 대시보드로 리다이렉트
        window.location.href = '/dashboard';
      }
    };

    if (user) {
      checkAdminAuth();
    }
  }, [user]);

  // 권한이 없으면 로딩 표시
  if (!isAuthorized) {
    return (
      <PageLayout title="접근 제한">
        <Header title="접근 제한" />
        <div style={{ textAlign: 'center', padding: '50px 20px' }}>
          <h2>관리자 권한이 필요합니다</h2>
          <p>이 페이지에 접근할 권한이 없습니다.</p>
        </div>
      </PageLayout>
    );
  }

  const handleEdit = (content: Content) => {
    setSelectedContent(content);
    setFormData(content);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedContent(null);
    setFormData({
      title: '',
      category: '',
      chip: '',
      description: '',
      content: '',
      thumbnail: '',
      locked: false,
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleSave = () => {
    if (isEditing && selectedContent) {
      // 편집 모드
      setContents(prev => 
        prev.map(content => 
          content.id === selectedContent.id 
            ? { ...content, ...formData }
            : content
        )
      );
    } else {
      // 추가 모드
      const newContent: Content = {
        ...formData as Content,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setContents(prev => [...prev, newContent]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('정말로 이 컨텐츠를 삭제하시겠습니까?')) {
      setContents(prev => prev.filter(content => content.id !== id));
    }
  };

  return (
    <PageLayout title="컨텐츠 관리">
      <Header title="컨텐츠 관리" />
      <AdminContainer>
        <AddButton onClick={handleAdd}>+ 새 컨텐츠 추가</AddButton>
        
        <ContentList>
          {contents.map((content) => (
            <ContentCard key={content.id}>
              <ContentChip>{content.chip}</ContentChip>
              <ContentTitle>{content.title}</ContentTitle>
              <ContentDescription>{content.description}</ContentDescription>
              <div style={{ marginTop: 12 }}>
                <Button 
                  variant="primary" 
                  onClick={() => handleEdit(content)}
                  style={{ marginRight: 8 }}
                >
                  편집
                </Button>
                <Button 
                  variant="danger" 
                  onClick={() => handleDelete(content.id)}
                >
                  삭제
                </Button>
              </div>
            </ContentCard>
          ))}
        </ContentList>

        {showModal && (
          <Modal onClick={() => setShowModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h2>{isEditing ? '컨텐츠 편집' : '새 컨텐츠 추가'}</h2>
              <Form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <FormGroup>
                  <Label>제목</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>카테고리</Label>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">카테고리 선택</option>
                    <option value="스킨십">스킨십</option>
                    <option value="관계회복">관계회복</option>
                    <option value="소통">소통</option>
                    <option value="감정표현">감정표현</option>
                    <option value="데이트">데이트</option>
                    <option value="감정관리">감정관리</option>
                    <option value="존중">존중</option>
                    <option value="취미">취미</option>
                    <option value="감정카드">감정카드</option>
                    <option value="이벤트">이벤트</option>
                    <option value="운동">운동</option>
                    <option value="가족">가족</option>
                    <option value="화해">화해</option>
                    <option value="요리">요리</option>
                    <option value="감정공유">감정공유</option>
                    <option value="여행">여행</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>칩</Label>
                  <Input
                    value={formData.chip}
                    onChange={(e) => setFormData({ ...formData, chip: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>설명</Label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>내용</Label>
                  <TextArea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>썸네일 이미지</Label>
                  <Input
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="img1.jpg"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>
                    <input
                      type="checkbox"
                      checked={formData.locked}
                      onChange={(e) => setFormData({ ...formData, locked: e.target.checked })}
                    />
                    잠금 상태 (프리미엄 컨텐츠)
                  </Label>
                </FormGroup>

                <ButtonGroup>
                  <Button type="button" onClick={() => setShowModal(false)}>
                    취소
                  </Button>
                  <Button type="submit" variant="primary">
                    {isEditing ? '수정' : '추가'}
                  </Button>
                </ButtonGroup>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AdminContainer>
    </PageLayout>
  );
};

export default ContentAdmin; 