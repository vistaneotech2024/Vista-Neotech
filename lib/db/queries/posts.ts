/**
 * Post Database Queries
 * Type-safe database operations for blog posts
 */

import { prisma } from '../prisma';
import type { ContentStatus } from '@prisma/client';

export interface CreatePostData {
  slug: string;
  title: string;
  content?: string;
  excerpt?: string;
  status?: ContentStatus;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  featuredImageId?: string;
  authorId?: string;
  categoryIds?: string[];
  tagIds?: string[];
  customFields?: Record<string, any>;
  publishedAt?: Date;
}

export interface UpdatePostData extends Partial<CreatePostData> {
  id: string;
}

/**
 * Get all posts with filters
 */
export async function getPosts(filters?: {
  status?: ContentStatus;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: 'publishedAt' | 'createdAt' | 'title';
  orderDirection?: 'asc' | 'desc';
}) {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.categoryId) {
    where.categories = {
      some: {
        categoryId: filters.categoryId,
      },
    };
  }

  if (filters?.tagId) {
    where.tags = {
      some: {
        tagId: filters.tagId,
      },
    };
  }

  if (filters?.authorId) {
    where.authorId = filters.authorId;
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
      { excerpt: { contains: filters.search, mode: 'insensitive' } },
      { slug: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const orderBy: any = {};
  const orderField = filters?.orderBy || 'publishedAt';
  const orderDir = filters?.orderDirection || 'desc';
  orderBy[orderField] = orderDir;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            email: true,
          },
        },
        featuredImage: {
          select: {
            id: true,
            fileUrl: true,
            altText: true,
          },
        },
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
        _count: {
          select: {
            categories: true,
            tags: true,
            contentBlocks: true,
            revisions: true,
          },
        },
      },
      orderBy,
      take: filters?.limit,
      skip: filters?.offset,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total };
}

/**
 * Get post by ID
 */
export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          displayName: true,
          email: true,
        },
      },
      featuredImage: true,
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      contentBlocks: {
        orderBy: { orderIndex: 'asc' },
        include: {
          block: true,
        },
      },
      revisions: {
        orderBy: { version: 'desc' },
        take: 10,
        include: {
          creator: {
            select: {
              displayName: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Get post by slug
 */
export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          displayName: true,
        },
      },
      featuredImage: true,
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      contentBlocks: {
        orderBy: { orderIndex: 'asc' },
        include: {
          block: true,
        },
      },
    },
  });
}

/**
 * Get related posts
 */
export async function getRelatedPosts(postId: string, limit: number = 3) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      categories: {
        select: { categoryId: true },
      },
      tags: {
        select: { tagId: true },
      },
    },
  });

  if (!post) {
    return [];
  }

  const categoryIds = post.categories.map((pc) => pc.categoryId);
  const tagIds = post.tags.map((pt) => pt.tagId);

  return prisma.post.findMany({
    where: {
      id: { not: postId },
      status: 'published',
      OR: [
        {
          categories: {
            some: {
              categoryId: { in: categoryIds },
            },
          },
        },
        {
          tags: {
            some: {
              tagId: { in: tagIds },
            },
          },
        },
      ],
    },
    include: {
      author: {
        select: {
          displayName: true,
        },
      },
      featuredImage: {
        select: {
          fileUrl: true,
          altText: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  });
}

/**
 * Create a new post
 */
export async function createPost(data: CreatePostData) {
  const { categoryIds, tagIds, ...postData } = data;

  const post = await prisma.post.create({
    data: {
      ...postData,
      publishedAt: postData.publishedAt || (postData.status === 'published' ? new Date() : null),
      version: 1,
      categories: categoryIds
        ? {
            create: categoryIds.map((categoryId) => ({
              categoryId,
            })),
          }
        : undefined,
      tags: tagIds
        ? {
            create: tagIds.map((tagId) => ({
              tagId,
            })),
          }
        : undefined,
    },
    include: {
      author: {
        select: {
          displayName: true,
        },
      },
      featuredImage: true,
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // Create initial revision
  await prisma.postRevision.create({
    data: {
      postId: post.id,
      version: 1,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      customFields: post.customFields as any,
      createdBy: data.authorId,
    },
  });

  return post;
}

/**
 * Update a post
 */
export async function updatePost(data: UpdatePostData) {
  const existingPost = await prisma.post.findUnique({
    where: { id: data.id },
    select: { version: true },
  });

  if (!existingPost) {
    throw new Error('Post not found');
  }

  const newVersion = existingPost.version + 1;
  const { categoryIds, tagIds, id, ...updateData } = data;

  // Set publishedAt if status changed to published
  if (data.status === 'published' && !updateData.publishedAt) {
    const currentPost = await prisma.post.findUnique({
      where: { id: data.id },
      select: { publishedAt: true },
    });
    if (!currentPost?.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  (updateData as any).version = newVersion;

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...updateData,
      categories: categoryIds
        ? {
            deleteMany: {},
            create: categoryIds.map((categoryId) => ({
              categoryId,
            })),
          }
        : undefined,
      tags: tagIds
        ? {
            deleteMany: {},
            create: tagIds.map((tagId) => ({
              tagId,
            })),
          }
        : undefined,
    },
    include: {
      author: {
        select: {
          displayName: true,
        },
      },
      featuredImage: true,
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  // Create revision
  await prisma.postRevision.create({
    data: {
      postId: post.id,
      version: newVersion,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      customFields: post.customFields as any,
      createdBy: data.authorId,
    },
  });

  return post;
}

/**
 * Delete a post
 */
export async function deletePost(id: string) {
  return prisma.post.delete({
    where: { id },
  });
}

/**
 * Get post revisions
 */
export async function getPostRevisions(postId: string) {
  return prisma.postRevision.findMany({
    where: { postId },
    orderBy: { version: 'desc' },
    include: {
      creator: {
        select: {
          displayName: true,
        },
      },
    },
  });
}

/**
 * Restore post from revision
 */
export async function restorePostFromRevision(postId: string, version: number) {
  const revision = await prisma.postRevision.findUnique({
    where: {
      postId_version: {
        postId,
        version,
      },
    },
  });

  if (!revision) {
    throw new Error('Revision not found');
  }

  return updatePost({
    id: postId,
    title: revision.title || undefined,
    content: revision.content || undefined,
    excerpt: revision.excerpt || undefined,
    metaTitle: revision.metaTitle || undefined,
    metaDescription: revision.metaDescription || undefined,
    customFields: revision.customFields as any,
  });
}

/**
 * Check if slug is available
 */
export async function isPostSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.post.findFirst({
    where: {
      slug,
      ...(excludeId && { id: { not: excludeId } }),
    },
  });

  return !existing;
}
