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
  
  const localVotes = useMemo(() => Array.isArray(post.votes) ? post.votes : [], [post.votes]);
  const myVote = useMemo(() => 
    userId ? localVotes.find((v) => (v as any).userId === userId || (v as any).authorId === userId) : undefined,
    [userId, localVotes]
  );

  const voteMutation = useMutation({
    mutationFn: async (optionText: string) => {
      if (!userId) {
        throw new Error('로그인이 필요합니다.');
      }
      const { data } = await axiosInstance.post(`/community/posts/${post.id}/vote`, { choice: optionText });
      return data;
    },
    onMutate: async (optionText: string) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: ['post', post.id] });
      const previousPost = queryClient.getQueryData(['post', post.id]);

      queryClient.setQueryData(['post', post.id], (old: any) =>
        produce(old, (draft: Draft<Post>) => {
          let votes = Array.isArray(draft.votes) ? draft.votes : [];
          const existingVoteIndex = votes.findIndex((v: PollVote) => v.userId === userId);

          if (existingVoteIndex > -1) {
            if (votes[existingVoteIndex].choice === optionText) {
              votes.splice(existingVoteIndex, 1);
            } else {
              votes[existingVoteIndex].choice = optionText;
            }
          } else {
            votes.push({ userId, choice: optionText });
          }
          draft.votes = votes;
        })
      );
      return { previousPost };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', post.id] });
    },
    onError: (err: Error, _variables, context) => {
      setError(err.message);
      if (context?.previousPost) {
        queryClient.setQueryData(['post', post.id], context.previousPost);
      }
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ['post', post.id] });
    }
  });

  const handleVote = useCallback((optionText: string) => {
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }
    voteMutation.mutate(optionText);
  }, [userId, voteMutation]);

  const renderVoteOptions = useMemo(() => 
    post.poll?.options.map((opt) => {
      const totalVotes = localVotes.length;
      const votesForOption = localVotes.filter((v) => (v as any).option === opt.text).length;
      const percent = totalVotes > 0 ? Math.round((votesForOption / totalVotes) * 100) : 0;
      const isMyChoice = myVote && (myVote as any).option === opt.text;
      
      return (
        <div key={opt.id} style={{ flex: 1, textAlign: 'center' }}>
          <button
            onClick={() => { if (!isMyChoice && !voteMutation.isPending) handleVote(opt.text); }}
            disabled={voteMutation.isPending}
            style={{
              width: '100%',
              padding: '0.8rem 0',
              borderRadius: '0.5rem',
              border: isMyChoice ? '2px solid #ff69b4' : '1px solid #785cd2',
              background: isMyChoice ? '#e6ffe6' : '#fff',
              color: '#52C41A',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: voteMutation.isPending ? 'not-allowed' : 'pointer',
              marginBottom: '0.5rem',
              transition: 'all 0.2s',
            }}
          >
            {opt.text}
            {isMyChoice && <span style={{ marginLeft: 8, fontSize: '0.95rem', color: ' #785cd2' }}>(내 선택)</span>}
          </button>
          <div style={{ height: 12, background: '#e0e0e0', borderRadius: 6, overflow: 'hidden', marginBottom: 4 }}>
            <div style={{ width: `${percent}%`, height: '100%', background: ' #785cd2', transition: 'width 0.3s' }} />
          </div>
          <div style={{ fontSize: '0.95rem', color: '#333' }}>{votesForOption}표 ({percent}%)</div>
        </div>
      );
    }),
    [post.poll?.options, localVotes, myVote, handleVote, voteMutation.isPending]
  );

  return (
    <PollContainer>
      <ErrorModal open={!!error} message={error || ''} onClose={() => setError(null)} />
      <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem', color: 'rgv #785cd2' }}>
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