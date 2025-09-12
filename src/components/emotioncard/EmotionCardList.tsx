import React from 'react';
import styled from 'styled-components';
import { SentMessage } from '../../pages/EmotionCard';
import EmotionCardItem from './EmotionCardItem';
import { formatInKST, isTodayKST } from '../../utils/date';

// 배열을 행 단위로 나누는 chunkCards 함수 추가
function chunkCards<T>(array: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  border-bottom: 2px solid #e5e7eb;
  width: 100%;
  max-width: 600px;
`;
const TabButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 1rem 0;
  background: none;
  border: none;
  border-bottom: 3px solid ${({ active }) => (active ? '#7C3AED' : 'transparent')};
  color: ${({ active }) => (active ? '#7C3AED' : '#888')};
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.2s, border-bottom 0.2s;
`;

const NewBadge = styled.span`
  display: inline-block;
  background: #ef4444;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 2px 7px;
  margin-left: 6px;
  vertical-align: middle;
`;

const SentCardsSection = styled.section`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 2rem;
`;

const SentCardsTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
`;

const CardGridWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: start;
  margin-top: 1.5rem;
  margin-left: 1rem;
`;
const CardRow = styled.div`
  display: flex;
  min-height: 110px;
  gap: 1rem;
  width: 100%;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
  width: 100%;
`;

const Select = styled.select`
  padding: 0.4rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 0.85rem;
  color: #4a5568;
  cursor: pointer;
  min-width: 100px;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 0.8em;
  padding-right: 2rem;
  
  &:focus {
    outline: none;
    border-color: #7C3AED;
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.1);
  }

  &:hover {
    border-color: #7C3AED;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;


interface EmotionCardListProps {
    tab: 'sent' | 'received';
    setTab: (tab: 'sent' | 'received') => void;
    sentMessages: SentMessage[];
    receivedMessages: SentMessage[];
    isLoadingSent: boolean;
    isLoadingReceived: boolean;
    openModal: (msg: SentMessage) => void;
    selectedMonth: string;
    setSelectedMonth: (month: string) => void;
    sortOrder: 'newest' | 'oldest';
    setSortOrder: (order: 'newest' | 'oldest') => void;
    hoveredCard: string | null;
    setHoveredCard: (id: string | null) => void;
}

const EmotionCardList: React.FC<EmotionCardListProps> = ({
    tab,
    setTab,
    sentMessages,
    receivedMessages,
    isLoadingSent,
    isLoadingReceived,
    openModal,
    selectedMonth,
    setSelectedMonth,
    sortOrder,
    setSortOrder,
    hoveredCard,
    setHoveredCard,
}) => {
    const CARDS_PER_ROW = 5;

    // 월별 필터링과 정렬을 위한 함수
    const getFilteredAndSortedMessages = (messages: SentMessage[]) => {
        return messages
            .filter(msg => formatInKST(msg.createdAt, 'yyyy-MM') === selectedMonth)
            .sort((a, b) => {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
    };

    // 사용 가능한 월 목록 생성 (최신순으로 정렬)
    const getAvailableMonths = (messages: SentMessage[]) => {
        const months = new Set(messages.map(msg => formatInKST(msg.createdAt, 'yyyy-MM')));
        return Array.from(months).sort().reverse();
    };

    const filteredAndSortedSentMessages = getFilteredAndSortedMessages(sentMessages);
    const filteredAndSortedReceivedMessages = getFilteredAndSortedMessages(receivedMessages);
    
    return (
        <>
            <TabsContainer>
                <TabButton active={tab === 'sent'} onClick={() => setTab('sent')}>
                    보낸 카드
                </TabButton>
                <TabButton active={tab === 'received'} onClick={() => setTab('received')}>
                    받은 카드
                    {Array.isArray(receivedMessages) && receivedMessages.some((msg) => isTodayKST(msg.createdAt)) && (
                        <NewBadge>TODAY</NewBadge>
                    )}
                </TabButton>
            </TabsContainer>

            {tab === 'sent' && !isLoadingSent && (
                <SentCardsSection>
                    <SentCardsTitle>내가 보낸 감정 카드</SentCardsTitle>
                    {sentMessages.length > 0 ? (
                        <>
                            <FilterContainer>
                                <FilterGroup>
                                    <Select
                                        value={selectedMonth}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMonth(e.target.value)}
                                    >
                                        {getAvailableMonths(sentMessages).map(month => (
                                            <option key={month} value={month}>
                                                {month.replace('-', '년 ')}월
                                            </option>
                                        ))}
                                    </Select>
                                    <Select
                                        value={sortOrder}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                    >
                                        <option value="newest">최신순</option>
                                        <option value="oldest">오래된순</option>
                                    </Select>
                                </FilterGroup>
                            </FilterContainer>
                            {filteredAndSortedSentMessages.length > 0 ? (
                                chunkCards(filteredAndSortedSentMessages, CARDS_PER_ROW).map((row, rowIndex) => (
                                    <CardGridWrapper key={rowIndex}>
                                        <CardRow>
                                            {row.map((msg, index) => {
                                                // 중요: 카드 시각적 스태킹(z-index) 로직. 최신 카드가 항상 위에 보이게 하기 위함.
                                                // 데이터 정렬 순서(최신순/오래된순)는 유지하면서 시각적으로만 겹치는 순서를 조절.
                                                const zIndex = sortOrder === 'newest' ? row.length - index : index + 1;
                                                return (
                                                    <EmotionCardItem
                                                        key={msg.id}
                                                        card={msg}
                                                        onClick={() => openModal(msg)}
                                                        onMouseEnter={() => setHoveredCard(msg.id)}
                                                        onMouseLeave={() => setHoveredCard(null)}
                                                        isHovered={hoveredCard === msg.id}
                                                        showTodayBadge={false}
                                                        zIndex={zIndex}
                                                    />
                                                );
                                            })}
                                        </CardRow>
                                    </CardGridWrapper>
                                ))
                            ) : (
                                <p>{selectedMonth.replace('-', '년 ')}월에 보낸 감정카드가 없습니다.</p>
                            )}
                        </>
                    ) : (
                        <p>아직 작성한 카드가 없습니다.</p>
                    )}
                </SentCardsSection>
            )}
            {tab === 'received' && !isLoadingReceived && (
                <SentCardsSection>
                    <SentCardsTitle>파트너가 보낸 감정 카드</SentCardsTitle>
                    {receivedMessages.length > 0 ? (
                        <>
                            <FilterContainer>
                                <FilterGroup>
                                    <Select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                    >
                                        {getAvailableMonths(receivedMessages).map(month => (
                                            <option key={month} value={month}>
                                                {month.replace('-', '년 ')}월
                                            </option>
                                        ))}
                                    </Select>
                                    <Select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                                    >
                                        <option value="newest">최신순</option>
                                        <option value="oldest">오래된순</option>
                                    </Select>
                                </FilterGroup>
                            </FilterContainer>
                            {filteredAndSortedReceivedMessages.length > 0 ? (
                                chunkCards(filteredAndSortedReceivedMessages, CARDS_PER_ROW).map((row, rowIndex) => (
                                    <CardGridWrapper key={rowIndex}>
                                        <CardRow>
                                            {row.map((msg, index) => {
                                                 // 중요: 카드 시각적 스태킹(z-index) 로직. 최신 카드가 항상 위에 보이게 하기 위함.
                                                 // 데이터 정렬 순서(최신순/오래된순)는 유지하면서 시각적으로만 겹치는 순서를 조절.
                                                 const zIndex = sortOrder === 'newest' ? row.length - index : index + 1;
                                                 return (
                                                    <EmotionCardItem
                                                        key={msg.id}
                                                        card={msg}
                                                        onClick={() => openModal(msg)}
                                                        onMouseEnter={() => setHoveredCard(msg.id)}
                                                        onMouseLeave={() => setHoveredCard(null)}
                                                        isHovered={hoveredCard === msg.id}
                                                        showTodayBadge={true}
                                                        zIndex={zIndex}
                                                    />
                                                );
                                            })}
                                        </CardRow>
                                    </CardGridWrapper>
                                ))
                            ) : (
                                <p>{selectedMonth.replace('-', '년 ')}월에 받은 감정카드가 없습니다.</p>
                            )}
                        </>
                    ) : (
                        <p>아직 받은 카드가 없습니다.</p>
                    )}
                </SentCardsSection>
            )}
        </>
    );
};

export default EmotionCardList;

