import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import axiosInstance from '../../api/axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { produce, Draft } from 'immer';
import type { Post, PollVote } from '../../types/post';
import type { User } from '../../types/user';
import ErrorModal from '../common/ErrorModal';

interface PollVoteBoxProps {
  post: Post;
  user: User | null;
}

const PollContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 0.7rem;
`;

const PollVoteBox: React.FC<PollVoteBoxProps> = React.memo(({ post, user }) => {
  if (!(post.category?.name === '찬반토론' && post.poll)) return null;
  
  const userId = user?.id;
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  
  const localVotes = useMemo(() => post.poll?.votes || [], [post.poll?.votes]);
  const myVote = useMemo(() => 
    userId ? localVotes.find((v: PollVote) => v.userId === userId) : undefined,
    [userId, localVotes]
  );

  const voteMutation = useMutation({
    mutationFn: async (choiceIdx: number) => {
      if (!userId) {
        throw new Error('로그인이 필요합니다.');
      }
      await axiosInstance.post(`/community/posts/${post.id}/vote`, { choice: choiceIdx });
      return { choiceIdx };
    },
    onMutate: async (choiceIdx: number) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: ['post', post.id] });
      const previousPost = queryClient.getQueryData(['post', post.id]);

      queryClient.setQueryData(['post', post.id], (old: any) =>
        produce(old, (draft: Draft<Post>) => {
          if (!draft.poll) return;

          const choiceValue = choiceIdx;
          let votes = draft.poll.votes || [];
          const existingVoteIndex = votes.findIndex((v: PollVote) => v.userId === userId);

          if (existingVoteIndex > -1) {
            if (votes[existingVoteIndex].choice === choiceValue) {
              votes.splice(existingVoteIndex, 1);
            } else {
              votes[existingVoteIndex].choice = choiceValue;
            }
          } else {
            votes.push({ userId, choice: choiceValue });
          }
          draft.poll.votes = votes;
        })
      );
      return { previousPost };
    },
    onError: (err: Error, _variables, context) => {
      setError(err.message);
      if (context?.previousPost) {
        queryClient.setQueryData(['post', post.id], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['post', post.id] });
    }
  });

  const handleVote = useCallback((choiceIdx: number) => {
    if (!user) {
      alert('투표를 하려면 로그인이 필요합니다.');
      return;
    }
    voteMutation.mutate(choiceIdx);
  }, [user, voteMutation]);

  const renderVoteOptions = useMemo(() => 
    post.poll?.options.map((opt, idx) => {
      const totalVotes = localVotes.length;
      const votesForOption = localVotes.filter((v: PollVote) => v.choice === idx).length;
      const percent = totalVotes > 0 ? Math.round((votesForOption / totalVotes) * 100) : 0;
      const isMyChoice = myVote && myVote.choice === idx;
      
      return (
        <div key={opt.id} style={{ flex: 1, textAlign: 'center' }}>
          <button
            onClick={() => handleVote(idx + 1)}
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
            {opt.text}
            {isMyChoice && <span style={{ marginLeft: 8, fontSize: '0.95rem', color: '#388e3c' }}>(내 선택)</span>}
          </button>
          <div style={{ height: 12, background: '#e0e0e0', borderRadius: 6, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{ width: `${percent}%`, height: '100%', background: '#52C41A', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: '0.95rem', color: '#333' }}>{votesForOption}표 ({percent}%)</div>
        </div>
      );
    }),
    [post.poll?.options, localVotes, myVote, handleVote]
  );

  return (
    <PollContainer>
      <ErrorModal open={!!error} message={error || ''} onClose={() => setError(null)} />
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: '#52C41A' }}>
        {post.poll.question}
      </div>
      <div style={{ display: 'flex', gap: '1.2rem', marginBottom: '1.2rem' }}>
        {renderVoteOptions}
      </div>
      <div style={{ fontSize: '0.92rem', color: '#888' }}>
        한 번만 투표할 수 있고, 같은 선택지를 다시 누르면 취소됩니다.
      </div>
    </PollContainer>
  );
});

export default PollVoteBox; 