'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { formatDate } from '@/lib/utils';

type Comment = {
  id: string;
  author_name: string;
  message: string;
  created_at: string;
};

type Post = {
  id: string;
  author_name: string;
  author_role: string;
  author_id: string;
  image: string;
  message: string;
  created_at: string;
  comments_enabled: boolean;
};

export default function ArtisansFeed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});
  // New state to hold comments for each post
  const [postComments, setPostComments] = useState<{ [postId: string]: Comment[] }>({});

  // Function to fetch comments for a specific post
  async function fetchComments(postId: string) {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`);
      const data = await res.json();
      if (res.ok) {
        setPostComments(prev => ({ ...prev, [postId]: data.comments || [] }));
      }
    } catch (error) {
      console.error("Error loading comments:", error);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      try {
        const res = await fetch('/api/posts');
        const data = await res.json();
        if (isMounted) {
          const fetchedPosts: Post[] = data.posts || [];
          setPosts(fetchedPosts);
          setLoading(false);
          
          // After loading posts, fetch comments for each post that has them enabled
          fetchedPosts.forEach(post => {
            if (post.comments_enabled) {
              fetchComments(post.id);
            }
          });
        }
      } catch (error) {
        console.error("Error loading posts:", error);
        if (isMounted) setLoading(false);
      }
    }

    loadPosts();
    return () => { isMounted = false; };
  }, []);

  async function handleCommentSubmit(postId: string) {
    if (!commentText[postId]) return;

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: commentText[postId] }),
    });

    if (res.ok) {
      setCommentText(prev => ({ ...prev, [postId]: '' }));
      // Refresh the comments list for this post
      fetchComments(postId);
    }
  }

  if (loading) return <div className="empty-state">Loading artisan stories...</div>;
  if (posts.length === 0) return <div className="empty-state">No stories shared yet.</div>;

  return (
    <div className="feed-stack">
      {posts.map((post) => (
        <article key={post.id} className="card feed-card">
          <div className="feed-head" style={{ padding: '1.5rem' }}>
            <div className="split-head">
              <div>
                <h3 style={{ margin: 0 }}>{post.author_name}</h3>
                <p className="muted" style={{ margin: 0 }}>{post.author_role}</p>
              </div>
              <p className="muted">{formatDate(post.created_at || new Date().toISOString())}</p>
            </div>
          </div>

          <Image 
            src={post.image} 
            alt="Post image" 
            width={800} 
            height={500} 
            className="card-image" 
            style={{ borderRadius: 0 }}
          />

          <div className="card-content" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>{post.message}</p>
            
            <div className="feed-actions" style={{ marginTop: '1rem', borderTop: '1px solid var(--line)', paddingTop: '1rem' }}>
               <span className="muted">
                 {post.comments_enabled ? "Comments active" : "Comments disabled"}
               </span>
            </div>

            {/* Display the list of comments */}
            {post.comments_enabled && postComments[post.id] && (
              <div className="comment-list" style={{ marginTop: '1rem' }}>
                {postComments[post.id].map((comment) => (
                  <div key={comment.id} className="comment-item" style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>
                      <strong>{comment.author_name}</strong>: {comment.message}
                    </p>
                    <small className="muted">{formatDate(comment.created_at)}</small>
                  </div>
                ))}
              </div>
            )}

            {post.comments_enabled && session && (
              <div className="inline-form" style={{ marginTop: '1rem' }}>
                <input 
                  className="auth-input"
                  placeholder="Add a comment..."
                  value={commentText[post.id] || ''}
                  onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                />
                <button 
                  onClick={() => handleCommentSubmit(post.id)} 
                  className="btn-link"
                  style={{ padding: '0.6rem 1rem' }}
                >
                  Post
                </button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}