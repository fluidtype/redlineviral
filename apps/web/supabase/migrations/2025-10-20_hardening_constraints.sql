-- Hardening constraints, indexing, and policy alignment

-- Ensure analysis_result.analysis_id is unique
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'analysis_result_analysis_id_key'
      AND conrelid = 'public.analysis_result'::regclass
  ) THEN
    ALTER TABLE public.analysis_result
      ADD CONSTRAINT analysis_result_analysis_id_key UNIQUE (analysis_id);
  END IF;
END
$$;

-- Kits versioning support (allows multiple revisions per analysis)
ALTER TABLE public.kits
  ADD COLUMN IF NOT EXISTS version integer NOT NULL DEFAULT 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'kits_analysis_id_version_key'
      AND conrelid = 'public.kits'::regclass
  ) THEN
    ALTER TABLE public.kits
      ADD CONSTRAINT kits_analysis_id_version_key UNIQUE (analysis_id, version);
  END IF;
END
$$;

-- Self-referencing parent pointer for analysis versioning
ALTER TABLE public.analysis
  ADD COLUMN IF NOT EXISTS parent_analysis_id uuid
    REFERENCES public.analysis (id)
    ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_analysis_parent_created_at
  ON public.analysis (parent_analysis_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_analysis_video_created_at
  ON public.analysis (video_id, started_at DESC);

-- Trends cache strengthening
ALTER TABLE public.trends_cache
  ALTER COLUMN hours SET DEFAULT 12,
  ALTER COLUMN hours SET NOT NULL;

ALTER TABLE public.trends_cache
  ALTER COLUMN query DROP DEFAULT;

DROP INDEX IF EXISTS trends_cache_lookup_idx;
CREATE INDEX IF NOT EXISTS trends_cache_lookup_idx
  ON public.trends_cache (platform, region, hours, (COALESCE(query, '')), cached_at DESC);

-- Defensive policies (recreate to ensure symmetry)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_result ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS analysis_result_user_is_owner ON public.analysis_result;
CREATE POLICY analysis_result_user_is_owner
  ON public.analysis_result
  USING (
    EXISTS (
      SELECT 1
      FROM public.analysis a
      JOIN public.videos v ON v.id = a.video_id
      WHERE a.id = analysis_result.analysis_id
        AND v.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.analysis a
      JOIN public.videos v ON v.id = a.video_id
      WHERE a.id = analysis_result.analysis_id
        AND v.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS kits_user_is_owner ON public.kits;
CREATE POLICY kits_user_is_owner
  ON public.kits
  USING (
    EXISTS (
      SELECT 1
      FROM public.analysis a
      JOIN public.videos v ON v.id = a.video_id
      WHERE a.id = kits.analysis_id
        AND v.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.analysis a
      JOIN public.videos v ON v.id = a.video_id
      WHERE a.id = kits.analysis_id
        AND v.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS notifications_user_is_owner ON public.notifications;
CREATE POLICY notifications_user_is_owner
  ON public.notifications
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS videos_user_is_owner ON public.videos;
CREATE POLICY videos_user_is_owner
  ON public.videos
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS analysis_user_is_owner ON public.analysis;
CREATE POLICY analysis_user_is_owner
  ON public.analysis
  USING (
    EXISTS (
      SELECT 1
      FROM public.videos v
      WHERE v.id = analysis.video_id
        AND v.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.videos v
      WHERE v.id = analysis.video_id
        AND v.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS profiles_user_is_owner ON public.profiles;
CREATE POLICY profiles_user_is_owner
  ON public.profiles
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Notifications isolation index for recency (supports caching)
CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON public.notifications (user_id, created_at DESC);
