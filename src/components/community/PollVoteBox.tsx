import React from 'react';
import styled from 'styled-components';
import axiosInstance from '../../api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce } from 'immer';
import type { Draft } from 'immer';
import type { User } from '../../types/user';

interface PollVote {
  userId: string;
  choice: number;
}
interface Post {
  id: string;
  poll?: {
    question: string;
    options: string[];
    votes?: PollVote[];
  };
  category?: { name: string };
}

interface PollVoteBoxProps {
  post: Post;
  user: Partial<User> | null;
}

const PollContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 0.7rem;
`;

const PollVoteBox: React.FC<PollVoteBoxProps> = ({ post, user }) => {
  if (!(post.category?.name === '찬반토론' && post.poll)) return null;
  
  // 로그인한 사용자의 ID만 사용하도록 수정
  const userId = user?.id;
  
  const localVotes = post.poll.votes || [];
  const myVote = userId ? localVotes.find(v => v.userId === userId) : undefined;
  const queryClient = useQueryClient();

  // 투표 mutation
  const voteMutation = useMutation({
    mutationFn: async (choiceIdx: number) => {
      if (!userId) {
        // 로그인하지 않은 사용자는 투표 불가
        throw new Error('로그인이 필요합니다.');
      }
      
      if (myVote && myVote.choice === choiceIdx) {
        // 같은 선택지 다시 누르면 투표 취소 (DELETE 요청)
        await axiosInstance.delete(`/community/posts/${post.id}/vote`);
        return { cancelled: true, choiceIdx };
      } else {
        // 새로운 투표 또는 투표 변경 (POST 요청)
        await axiosInstance.post(`/community/posts/${post.id}/vote`, { choice: choiceIdx });
        return { cancelled: false, choiceIdx };
      }
    },
    // onSuccess는 onSettled와 중복되므로 제거 가능
    onMutate: async (choiceIdx: number) => {
      if (!userId) return; // 로그인 상태가 아니면 낙관적 업데이트 실행 안 함

      await queryClient.cancelQueries({ queryKey: ['post', post.id] });
      const previousPost = queryClient.getQueryData(['post', post.id]);

      queryClient.setQueryData(['post', post.id], (old: any) =>
        produce(old, (draft: Draft<Post>) => {
          if (!draft.poll) return;
          
          let votes = draft.poll.votes || [];
          const existingVoteIndex = votes.findIndex(v => v.userId === userId);

          if (existingVoteIndex > -1) { // 이미 투표한 경우
            if (votes[existingVoteIndex].choice === choiceIdx) { // 같은 선택지: 투표 취소
              votes.splice(existingVoteIndex, 1);
            } else { // 다른 선택지: 투표 변경
              votes[existingVoteIndex].choice = choiceIdx;
            }
          } else { // 첫 투표
            votes.push({ userId, choice: choiceIdx });
          }
          draft.poll.votes = votes;
        })
      );
      return { previousPost };
    },
    onError: (err: Error, _variables, context) => {
      // 로그인 필요 에러는 사용자에게 알림
      if (err.message === '로그인이 필요합니다.') {
        alert(err.message);
      }
      if (context?.previousPost) {
        queryClient.setQueryData(['post', post.id], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', post.id] });
    }
  });

  const handleVote = (choiceIdx: number) => {
    if (!user) {
      alert('투표를 하려면 로그인이 필요합니다.');
      return;
    }
    voteMutation.mutate(choiceIdx);
  };

  return (
    <PollContainer>
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: '#52C41A' }}>
        {post.poll.question}
      </div>
      <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '1.2rem' }}>
        {post.poll.options.map((opt, idx) => {
          const totalVotes = localVotes.length;
          const votesForOption = localVotes.filter(v => v.choice === idx).length;
          const percent = totalVotes > 0 ? Math.round((votesForOption / totalVotes) * 100) : 0;
          const isMyChoice = myVote && myVote.choice === idx;
          return (
            <div key={idx} style={{ flex: 1, textAlign: 'center' }}>
              <button
                onClick={() => handleVote(idx)}
                style={{
                  width: '100%',
                  padding: '0.8rem 0',
                  borderRadius: '0.5rem',
                  border: isMyChoice ? '2px solid #52C41A' : '1px solid #52C41A',
                  background: isMyChoice ? '#e6ffe6' : '#fff',
                  color: '#52C41A',
                  fontWeight: 600,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  marginBottom: '0.5rem',
                  transition: 'all 0.2s',
                }}
              >
                {opt}
                {isMyChoice && <span style={{ marginLeft: 8, fontSize: '0.95rem', color: '#388e3c' }}>(내 선택)</span>}
              </button>
              {/* 퍼센트 바 */}
              <div style={{ height: 12, background: '#e0e0e0', borderRadius: 6, overflow: 'hidden', marginBottom: 4 }}>
                <div style={{ width: `${percent}%`, height: '100%', background: '#52C41A', transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: '0.95rem', color: '#333' }}>{votesForOption}표 ({percent}%)</div>
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: '0.92rem', color: '#888' }}>
        한 번만 투표할 수 있고, 같은 선택지를 다시 누르면 취소됩니다.
      </div>
    </PollContainer>
  );
};

export default PollVoteBox; 