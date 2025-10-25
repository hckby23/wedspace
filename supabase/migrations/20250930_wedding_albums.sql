-- Wedding Albums System

CREATE TABLE IF NOT EXISTS public.wedding_albums (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  cover_photo_url TEXT,
  
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.album_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id UUID NOT NULL REFERENCES public.wedding_albums(id) ON DELETE CASCADE,
  
  photo_url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  order_index INTEGER DEFAULT 0,
  
  uploaded_by UUID REFERENCES auth.users(id),
  file_size INTEGER,
  dimensions TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_albums_user ON public.wedding_albums(user_id);
CREATE INDEX idx_albums_public ON public.wedding_albums(is_public);
CREATE INDEX idx_album_photos_album ON public.album_photos(album_id);

ALTER TABLE public.wedding_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their albums"
  ON public.wedding_albums FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view public albums"
  ON public.wedding_albums FOR SELECT
  USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can manage their album photos"
  ON public.album_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.wedding_albums
      WHERE id = album_id AND user_id = auth.uid()
    )
  );
