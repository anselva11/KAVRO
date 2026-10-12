-- ==============================================================================
-- KAVRO AI BUSINESS WORKSPACE - Row Level Security (RLS) & Auth Triggers
-- Migration: 20261012000002_rls_policies.sql
-- Description: Strict isolation policies, access functions, and signup triggers
-- ==============================================================================

-- 1. SECURITY DEFINER HELPER FUNCTIONS
-- Securely checks workspace membership without infinite recursion in RLS
CREATE OR REPLACE FUNCTION public.is_workspace_member(check_workspace_id UUID, check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = check_workspace_id
      AND user_id = check_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_workspace_role(check_workspace_id UUID, check_user_id UUID)
RETURNS workspace_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.workspace_members
  WHERE workspace_id = check_workspace_id
    AND user_id = check_user_id
  LIMIT 1;
$$;

-- 2. ENABLE ROW LEVEL SECURITY ON ALL USER TABLES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. WORKSPACES POLICIES
DROP POLICY IF EXISTS "Users can view workspaces they belong to" ON public.workspaces;
CREATE POLICY "Users can view workspaces they belong to"
  ON public.workspaces FOR SELECT
  USING (
    owner_id = auth.uid() OR
    public.is_workspace_member(id, auth.uid())
  );

DROP POLICY IF EXISTS "Authenticated users can create workspaces" ON public.workspaces;
CREATE POLICY "Authenticated users can create workspaces"
  ON public.workspaces FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Owners and admins can update workspaces" ON public.workspaces;
CREATE POLICY "Owners and admins can update workspaces"
  ON public.workspaces FOR UPDATE
  USING (
    owner_id = auth.uid() OR
    public.get_user_workspace_role(id, auth.uid()) IN ('owner', 'admin')
  );

DROP POLICY IF EXISTS "Only owners can delete workspaces" ON public.workspaces;
CREATE POLICY "Only owners can delete workspaces"
  ON public.workspaces FOR DELETE
  USING (owner_id = auth.uid());

-- 5. WORKSPACE MEMBERS POLICIES
DROP POLICY IF EXISTS "Members can view other members in their workspace" ON public.workspace_members;
CREATE POLICY "Members can view other members in their workspace"
  ON public.workspace_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    public.is_workspace_member(workspace_id, auth.uid())
  );

DROP POLICY IF EXISTS "Workspace owners/admins or self can insert members" ON public.workspace_members;
CREATE POLICY "Workspace owners/admins or self can insert members"
  ON public.workspace_members FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR
    public.get_user_workspace_role(workspace_id, auth.uid()) IN ('owner', 'admin')
  );

DROP POLICY IF EXISTS "Workspace owners/admins can update member roles" ON public.workspace_members;
CREATE POLICY "Workspace owners/admins can update member roles"
  ON public.workspace_members FOR UPDATE
  USING (public.get_user_workspace_role(workspace_id, auth.uid()) IN ('owner', 'admin'));

DROP POLICY IF EXISTS "Owners can remove members or users can leave" ON public.workspace_members;
CREATE POLICY "Owners can remove members or users can leave"
  ON public.workspace_members FOR DELETE
  USING (
    user_id = auth.uid() OR
    public.get_user_workspace_role(workspace_id, auth.uid()) IN ('owner', 'admin')
  );

-- 6. CONVERSATIONS POLICIES
DROP POLICY IF EXISTS "Workspace members can view conversations" ON public.conversations;
CREATE POLICY "Workspace members can view conversations"
  ON public.conversations FOR SELECT
  USING (
    auth.uid() = user_id AND
    public.is_workspace_member(workspace_id, auth.uid())
  );

DROP POLICY IF EXISTS "Workspace members can create conversations" ON public.conversations;
CREATE POLICY "Workspace members can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    public.is_workspace_member(workspace_id, auth.uid())
  );

DROP POLICY IF EXISTS "Users can update their conversations" ON public.conversations;
CREATE POLICY "Users can update their conversations"
  ON public.conversations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their conversations" ON public.conversations;
CREATE POLICY "Users can delete their conversations"
  ON public.conversations FOR DELETE
  USING (auth.uid() = user_id);

-- 7. MESSAGES POLICIES
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.messages;
CREATE POLICY "Users can view messages in their conversations"
  ON public.messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND c.user_id = auth.uid()
        AND public.is_workspace_member(c.workspace_id, auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert messages in their conversations" ON public.messages;
CREATE POLICY "Users can insert messages in their conversations"
  ON public.messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
        AND c.user_id = auth.uid()
        AND public.is_workspace_member(c.workspace_id, auth.uid())
    )
  );

-- 8. DOCUMENTS POLICIES
DROP POLICY IF EXISTS "Workspace members can view documents" ON public.documents;
CREATE POLICY "Workspace members can view documents"
  ON public.documents FOR SELECT
  USING (public.is_workspace_member(workspace_id, auth.uid()));

DROP POLICY IF EXISTS "Workspace members can insert documents" ON public.documents;
CREATE POLICY "Workspace members can insert documents"
  ON public.documents FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    public.is_workspace_member(workspace_id, auth.uid())
  );

DROP POLICY IF EXISTS "Workspace members can update documents" ON public.documents;
CREATE POLICY "Workspace members can update documents"
  ON public.documents FOR UPDATE
  USING (public.is_workspace_member(workspace_id, auth.uid()))
  WITH CHECK (public.is_workspace_member(workspace_id, auth.uid()));

DROP POLICY IF EXISTS "Document owners or workspace admins can delete documents" ON public.documents;
CREATE POLICY "Document owners or workspace admins can delete documents"
  ON public.documents FOR DELETE
  USING (
    user_id = auth.uid() OR
    public.get_user_workspace_role(workspace_id, auth.uid()) IN ('owner', 'admin')
  );

-- 9. USAGE EVENTS POLICIES
DROP POLICY IF EXISTS "Users can view their usage events" ON public.usage_events;
CREATE POLICY "Users can view their usage events"
  ON public.usage_events FOR SELECT
  USING (
    user_id = auth.uid() OR
    public.get_user_workspace_role(workspace_id, auth.uid()) IN ('owner', 'admin')
  );

DROP POLICY IF EXISTS "Authenticated users or server can record usage" ON public.usage_events;
CREATE POLICY "Authenticated users or server can record usage"
  ON public.usage_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 10. SUBSCRIPTIONS POLICIES
DROP POLICY IF EXISTS "Workspace members can view their subscription" ON public.subscriptions;
CREATE POLICY "Workspace members can view their subscription"
  ON public.subscriptions FOR SELECT
  USING (public.is_workspace_member(workspace_id, auth.uid()));

-- 11. AUTOMATIC PROFILE & DEFAULT WORKSPACE SETUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user_setup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace_id UUID;
  user_name TEXT;
BEGIN
  -- Determine display name
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1), 'User');

  -- 1. Create Profile
  INSERT INTO public.profiles (id, full_name, avatar_url, theme)
  VALUES (
    NEW.id,
    user_name,
    NEW.raw_user_meta_data->>'avatar_url',
    'dark'
  )
  ON CONFLICT (id) DO NOTHING;

  -- 2. Create Default Workspace
  INSERT INTO public.workspaces (name, owner_id)
  VALUES (user_name || '''s Workspace', NEW.id)
  RETURNING id INTO new_workspace_id;

  -- 3. Add user as Workspace Owner
  INSERT INTO public.workspace_members (workspace_id, user_id, role)
  VALUES (new_workspace_id, NEW.id, 'owner');

  -- 4. Initialize Free Tier Subscription
  INSERT INTO public.subscriptions (user_id, workspace_id, plan, status)
  VALUES (NEW.id, new_workspace_id, 'free', 'active');

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_setup();
