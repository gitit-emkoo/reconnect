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
  const userId = user?.id || localStorage.getItem('userId') || 'guest';
  const localVotes = post.poll.votes || [];
  const myVote = localVotes.find(v => v.userId === userId);
  const queryClient = useQueryClient();

  // 투표 mutation
  const voteMutation = useMutation({
    mutationFn: async (choiceIdx: number) => {
      const option = post.poll!.options[choiceIdx];
      if (myVote && myVote.choice === choiceIdx) {
        // 같은 선택지 다시 누르면 투표 취소
        await axiosInstance.delete(`/community/posts/${post.id}/vote`);
        return { cancelled: true, choiceIdx };
      } else {
        await axiosInstance.post(`/community/posts/${post.id}/vote`, { option });
        return { cancelled: false, choiceIdx };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', post.id] });
    },
    // optimistic update 예시 (immer 활용)
    onMutate: async (choiceIdx: number) => {
      await queryClient.cancelQueries({ queryKey: ['post', post.id] });
      const previous = queryClient.getQueryData(['post', post.id]);
      queryClient.setQueryData(['post', post.id], (old: any) =>
        produce(old, (draft: Draft<Post>) => {
          if (!draft?.poll?.votes) return;
          // 투표 취소
          if (myVote && myVote.choice === choiceIdx) {
            draft.poll.votes = draft.poll.votes.filter((v: any) => v.userId !== userId);
          } else {
            // 기존 투표 제거 후 새 투표 추가
            draft.poll.votes = draft.poll.votes.filter((v: any) => v.userId !== userId);
            draft.poll.votes.push({ userId, choice: choiceIdx });
          }
        })
      );
      return { previous };
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['post', post.id], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', post.id] });
    }
  });

  const handleVote = (choiceIdx: number) => {
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