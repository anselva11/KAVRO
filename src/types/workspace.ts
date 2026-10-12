import { SubscriptionTier } from './database';

export interface UserProfile {
  id: string;
  email?: string;
  fullName: string;
  avatarUrl?: string;
  theme: 'dark' | 'light' | 'system';
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  role: 'owner' | 'admin' | 'member';
  plan: SubscriptionTier;
  tokenUsageThisMonth: number;
  tokenQuota: number;
}

export type DocumentTemplateId = 'email' | 'proposal' | 'report' | 'meeting' | 'plan';

export interface DocumentTemplateMeta {
  id: DocumentTemplateId;
  title: string;
  description: string;
  category: string;
  iconName: string;
  fields: {
    name: string;
    label: string;
    placeholder: string;
    type: 'text' | 'textarea' | 'select';
    required: boolean;
    options?: string[];
  }[];
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  isExternal?: boolean;
}
