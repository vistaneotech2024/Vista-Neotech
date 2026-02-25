/**
 * Page Database Queries
 * Type-safe database operations for pages
 */

import { prisma } from '../prisma';
import type { ContentStatus } from '@prisma/client';

export interface CreatePageData {
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
  parentId?: string;
  authorId?: string;
  template?: string;
  customFields?: Record<string, any>;
  publishedAt?: Date;
}

export interface UpdatePageData extends Partial<CreatePageData> {
  id: string;
}

/**
 * Get all pages with filters
 */
export async function getPages(filters?: {
  status?: ContentStatus;
  contentType?: string;
  parentId?: string | null;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const where: any = {};

  if (filters?.status) {
    where.status = filters.status;
  }

  if (filters?.contentType) {
    where.contentType = filters.contentType;
  }

  if (filters?.parentId !== undefined) {
    where.parentId = filters.parentId;
  }

  if (filters?.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { content: { contains: filters.search, mode: 'insensitive' } },
      { slug: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  const [pages, total] = await Promise.all([
    prisma.page.findMany({
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
        parent: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        _count: {
          select: {
            contentBlocks: true,
            revisions: true,
          },
        },
      },
      orderBy: [
        { menuOrder: 'asc' },
        { createdAt: 'desc' },
      ],
      take: filters?.limit,
      skip: filters?.offset,
    }),
    prisma.page.count({ where }),
  ]);

  return { pages, total };
}

/**
 * Get page by ID
 */
export async function getPageById(id: string) {
  return prisma.page.findUnique({
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
      parent: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      children: {
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
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
 * Get page by slug
 */
export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          displayName: true,
        },
      },
      featuredImage: true,
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
 * Create a new page
 */
export async function createPage(data: CreatePageData) {
  const page = await prisma.page.create({
    data: {
      ...data,
      publishedAt: data.publishedAt || (data.status === 'published' ? new Date() : null),
      version: 1,
    },
    include: {
      author: {
        select: {
          displayName: true,
        },
      },
      featuredImage: true,
    },
  });

  // Create initial revision
  await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      version: 1,
      title: page.title,
      content: page.content,
      excerpt: page.excerpt,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      customFields: page.customFields as any,
      createdBy: data.authorId,
    },
  });

  return page;
}

/**
 * Update a page
 */
export async function updatePage(data: UpdatePageData) {
  const existingPage = await prisma.page.findUnique({
    where: { id: data.id },
    select: { version: true },
  });

  if (!existingPage) {
    throw new Error('Page not found');
  }

  const newVersion = existingPage.version + 1;
  const updateData: any = { ...data };
  delete updateData.id;

  // Set publishedAt if status changed to published
  if (data.status === 'published' && !updateData.publishedAt) {
    const currentPage = await prisma.page.findUnique({
      where: { id: data.id },
      select: { publishedAt: true },
    });
    if (!currentPage?.publishedAt) {
      updateData.publishedAt = new Date();
    }
  }

  updateData.version = newVersion;

  const page = await prisma.page.update({
    where: { id: data.id },
    data: updateData,
    include: {
      author: {
        select: {
          displayName: true,
        },
      },
      featuredImage: true,
    },
  });

  // Create revision
  await prisma.pageRevision.create({
    data: {
      pageId: page.id,
      version: newVersion,
      title: page.title,
      content: page.content,
      excerpt: page.excerpt,
      metaTitle: page.metaTitle,
      metaDescription: page.metaDescription,
      customFields: page.customFields as any,
      createdBy: data.authorId,
    },
  });

  return page;
}

/**
 * Delete a page
 */
export async function deletePage(id: string) {
  return prisma.page.delete({
    where: { id },
  });
}

/**
 * Get page revisions
 */
export async function getPageRevisions(pageId: string) {
  return prisma.pageRevision.findMany({
    where: { pageId },
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
 * Restore page from revision
 */
export async function restorePageFromRevision(pageId: string, version: number) {
  const revision = await prisma.pageRevision.findUnique({
    where: {
      pageId_version: {
        pageId,
        version,
      },
    },
  });

  if (!revision) {
    throw new Error('Revision not found');
  }

  return updatePage({
    id: pageId,
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
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  const existing = await prisma.page.findFirst({
    where: {
      slug,
      ...(excludeId && { id: { not: excludeId } }),
    },
  });

  return !existing;
}
