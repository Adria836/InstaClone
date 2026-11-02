import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Post, Story, Comment } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import confetti from 'canvas-confetti';

interface CreatePostInput {
  imageUrl: string;
  caption: string;
  filter?: string;
  location?: string;
}

interface PostContextType {
  posts: Post[];
  stories: Story[];
  savedPosts: Post[];
  selectedPost: Post | null;
  activeStoryIndex: number | null;
  isLoading: boolean;
  setSelectedPost: (post: Post | null) => void;
  setActiveStoryIndex: (index: number | null) => void;
  toggleLike: (postId: string) => Promise<void>;
  toggleSave: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  createPost: (input: CreatePostInput) => Promise<boolean>;
  addStory: (mediaUrl: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  markStoryAsViewed: (storyId: string) => void;
  refreshPosts: () => Promise<void>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load all posts from Supabase
  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);

      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          id,
          caption,
          image_url,
          filter,
          location,
          likes_count,
          comments_count,
          created_at,
          user_id,
          profiles:user_id (id, username, full_name, avatar_url, is_verified),
          likes (user_id),
          comments (
            id,
            content,
            created_at,
            likes_count,
            user_id,
            profiles:user_id (id, username, full_name, avatar_url)
          )
        `)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Error loading posts from Supabase:', postsError);
        return;
      }

      // Check saved posts for the current user
      let savedPostIdSet = new Set<string>();
      if (user) {
        const { data: savedData } = await supabase
          .from('saved_posts')
          .select('post_id')
          .eq('user_id', user.id);

        if (savedData) {
          savedPostIdSet = new Set(savedData.map((s) => s.post_id));
        }
      }

      if (postsData) {
        const formatted: Post[] = postsData.map((item: any) => {
          const isLikedByMe = Boolean(user && item.likes?.some((l: any) => l.user_id === user.id));
          const isSavedByMe = savedPostIdSet.has(item.id);

          const formattedComments: Comment[] = (item.comments || []).map((c: any) => ({
            id: c.id,
            postId: item.id,
            userId: c.user_id,
            user: {
              id: c.profiles?.id || c.user_id,
              username: c.profiles?.username || 'usuario',
              fullName: c.profiles?.full_name || 'Usuário',
              avatarUrl: c.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              followersCount: 0,
              followingCount: 0,
            },
            content: c.content,
            likesCount: c.likes_count || 0,
            createdAt: new Date(c.created_at).toLocaleDateString('pt-BR'),
          }));

          return {
            id: item.id,
            userId: item.user_id,
            user: {
              id: item.profiles?.id || item.user_id,
              username: item.profiles?.username || 'usuario',
              fullName: item.profiles?.full_name || 'Usuário',
              avatarUrl: item.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              isVerified: item.profiles?.is_verified,
              followersCount: 0,
              followingCount: 0,
            },
            imageUrl: item.image_url,
            filter: item.filter || 'normal',
            location: item.location,
            caption: item.caption || '',
            likesCount: item.likes?.length ?? item.likes_count ?? 0,
            commentsCount: item.comments?.length ?? item.comments_count ?? 0,
            createdAt: new Date(item.created_at).toLocaleDateString('pt-BR'),
            isLiked: isLikedByMe,
            isSaved: isSavedByMe,
            comments: formattedComments,
          };
        });

        setPosts(formatted);
        setSavedPosts(formatted.filter((p) => p.isSaved));
      }
    } catch (err) {
      console.error('Unexpected error loading posts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load active stories from Supabase
  const loadStories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select(`
          id,
          media_url,
          media_type,
          created_at,
          user_id,
          profiles:user_id (id, username, full_name, avatar_url)
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stories from Supabase:', error);
        return;
      }

      if (data) {
        const formattedStories: Story[] = data.map((s: any) => ({
          id: s.id,
          userId: s.user_id,
          user: {
            id: s.profiles?.id || s.user_id,
            username: s.profiles?.username || 'usuario',
            fullName: s.profiles?.full_name || 'Usuário',
            avatarUrl: s.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            followersCount: 0,
            followingCount: 0,
          },
          mediaUrl: s.media_url,
          mediaType: s.media_type || 'image',
          createdAt: new Date(s.created_at).toLocaleDateString('pt-BR'),
          viewed: false,
        }));
        setStories(formattedStories);
      }
    } catch (err) {
      console.error('Error fetching stories:', err);
    }
  }, []);

  useEffect(() => {
    loadPosts();
    loadStories();
  }, [loadPosts, loadStories]);

  const toggleLike = async (postId: string) => {
    if (!user) return;

    let willLike = false;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          willLike = !post.isLiked;
          return {
            ...post,
            isLiked: willLike,
            likesCount: willLike ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
          };
        }
        return post;
      })
    );

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              isLiked: !prev.isLiked,
              likesCount: !prev.isLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1),
            }
          : null
      );
    }

    if (willLike) {
      try {
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.7 },
          colors: ['#ff3040', '#ed4956'],
        });
      } catch {}
    }

    try {
      if (willLike) {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id });
      } else {
        await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', user.id);
      }
    } catch (err) {
      console.error('Error updating like in Supabase:', err);
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) return;

    let willSave = false;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          willSave = !post.isSaved;
          return { ...post, isSaved: willSave };
        }
        return post;
      })
    );

    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost((prev) => (prev ? { ...prev, isSaved: !prev.isSaved } : null));
    }

    try {
      if (willSave) {
        await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id });
      } else {
        await supabase.from('saved_posts').delete().eq('post_id', postId).eq('user_id', user.id);
      }
      setSavedPosts((prev) => {
        if (willSave) {
          const postToSave = posts.find((p) => p.id === postId);
          return postToSave ? [postToSave, ...prev] : prev;
        } else {
          return prev.filter((p) => p.id !== postId);
        }
      });
    } catch (err) {
      console.error('Error updating saved post in Supabase:', err);
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!content.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: content.trim(),
        })
        .select(`
          id,
          content,
          created_at,
          likes_count,
          user_id,
          profiles:user_id (id, username, full_name, avatar_url)
        `)
        .single();

      if (error) {
        console.error('Error adding comment to Supabase:', error);
        return;
      }

      if (data) {
        const newComment: Comment = {
          id: data.id,
          postId,
          userId: user.id,
          user,
          content: data.content,
          likesCount: 0,
          createdAt: 'AGORA',
          isLiked: false,
        };

        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                commentsCount: post.commentsCount + 1,
                comments: [...(post.comments || []), newComment],
              };
            }
            return post;
          })
        );

        if (selectedPost && selectedPost.id === postId) {
          setSelectedPost((prev) =>
            prev
              ? {
                  ...prev,
                  commentsCount: prev.commentsCount + 1,
                  comments: [...(prev.comments || []), newComment],
                }
              : null
          );
        }
      }
    } catch (err) {
      console.error('Error in addComment:', err);
    }
  };

  const createPost = async (input: CreatePostInput): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          caption: input.caption,
          image_url: input.imageUrl,
          filter: input.filter || 'normal',
          location: input.location,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating post in Supabase:', error);
        alert(`Erro ao criar publicação no Supabase: ${error.message}`);
        return false;
      }

      if (data) {
        const newPost: Post = {
          id: data.id,
          userId: user.id,
          user,
          imageUrl: data.image_url,
          caption: data.caption,
          filter: data.filter,
          location: data.location,
          likesCount: 0,
          commentsCount: 0,
          createdAt: 'AGORA',
          isLiked: false,
          isSaved: false,
          comments: [],
        };

        setPosts((prev) => [newPost, ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Unexpected error in createPost:', err);
      return false;
    }
  };

  const addStory = async (mediaUrl: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          media_url: mediaUrl,
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding story in Supabase:', error);
        return;
      }

      if (data) {
        const newStory: Story = {
          id: data.id,
          userId: user.id,
          user,
          mediaUrl: data.media_url,
          createdAt: 'AGORA',
          viewed: false,
        };
        setStories((prev) => [newStory, ...prev]);
      }
    } catch (err) {
      console.error('Error in addStory:', err);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase.from('posts').delete().eq('id', postId);
      if (error) {
        console.error('Error deleting post in Supabase:', error);
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      if (selectedPost?.id === postId) setSelectedPost(null);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const markStoryAsViewed = (storyId: string) => {
    setStories((prev) =>
      prev.map((s) => (s.id === storyId ? { ...s, viewed: true } : s))
    );
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        stories,
        savedPosts,
        selectedPost,
        activeStoryIndex,
        isLoading,
        setSelectedPost,
        setActiveStoryIndex,
        toggleLike,
        toggleSave,
        addComment,
        createPost,
        addStory,
        deletePost,
        markStoryAsViewed,
        refreshPosts: loadPosts,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) throw new Error('usePosts must be used within a PostProvider');
  return context;
};
