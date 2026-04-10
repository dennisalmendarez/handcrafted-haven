'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { formatDate } from '@/lib/utils';

export default function ArtisansFeed() {
  const { posts, currentUser, toggleLikePost, addComment, deleteComment, blockUserFromCommenting } = useStore();
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const orderedPosts = useMemo(
    () => [...posts].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [posts],
  );

  function submitComment(event: React.FormEvent<HTMLFormElement>, postId: string) {
    event.preventDefault();
    const message = drafts[postId]?.trim();
    if (!message) return;
    addComment(postId, message);
    setDrafts((prev) => ({ ...prev, [postId]: '' }));
  }

  if (orderedPosts.length === 0) {
    return <div className="empty-state">No artisan posts yet.</div>;
  }

  return (
    <div className="feed-stack">
      {orderedPosts.map((post) => {
        const blocked = currentUser ? post.blockedCommentUserIds.includes(currentUser.id) : false;

        return (
          <article key={post.id} className="card feed-card">
            <div className="feed-head">
              <div>
                <h3>{post.authorName}</h3>
                <p className="muted">
                  {post.authorRole} · {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            <Image
              src={post.image}
              alt={post.message}
              width={900}
              height={700}
              className="card-image"
            />

            <div className="card-content">
              <p>{post.message}</p>

              <div className="feed-actions">
                <button
                  type="button"
                  className="btn-link btn-secondary"
                  onClick={() => toggleLikePost(post.id)}
                >
                  Like ({post.likes.length})
                </button>
                <span className="muted">Comments {post.comments.length}</span>
                <span className="muted">
                  {post.commentsEnabled ? 'Comments on' : 'Comments off'}
                </span>
              </div>

              <div className="comment-list">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div>
                      <strong>{comment.authorName}</strong>
                      <p>{comment.message}</p>
                    </div>

                    {currentUser?.id === post.authorId ? (
                      <div className="comment-tools">
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => deleteComment(post.id, comment.id)}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="text-button"
                          onClick={() => blockUserFromCommenting(post.id, comment.authorId)}
                        >
                          Block User
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {currentUser ? (
                blocked ? (
                  <p className="error-text">You cannot comment on this post.</p>
                ) : post.commentsEnabled ? (
                  <form
                    className="inline-form"
                    onSubmit={(event) => submitComment(event, post.id)}
                  >
                    <input
                      className="auth-input"
                      value={drafts[post.id] ?? ''}
                      onChange={(event) =>
                        setDrafts((prev) => ({ ...prev, [post.id]: event.target.value }))
                      }
                      placeholder="Write a comment"
                    />
                    <button type="submit" className="btn-link">Comment</button>
                  </form>
                ) : (
                  <p className="muted">Comments are turned off for this post.</p>
                )
              ) : (
                <p className="muted">Sign in to like or comment.</p>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}