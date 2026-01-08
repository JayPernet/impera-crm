-- SQL Update for Properties Table to support new form fields

ALTER TABLE properties
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS address_street TEXT,
ADD COLUMN IF NOT EXISTS address_number TEXT,
ADD COLUMN IF NOT EXISTS address_city TEXT,
ADD COLUMN IF NOT EXISTS address_state TEXT,
ADD COLUMN IF NOT EXISTS address_zip TEXT,
ADD COLUMN IF NOT EXISTS bathrooms NUMERIC,
ADD COLUMN IF NOT EXISTS images_urls TEXT[];

-- Ensure the storage bucket exists (if not already created)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('fotos_imoveis', 'fotos_imoveis', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload images (adjust as needed)
-- CREATE POLICY "Allow authenticated uploads"
-- ON storage.objects FOR INSERT
-- TO authenticated
-- WITH CHECK (bucket_id = 'fotos_imoveis');

-- Policy to allow public viewing
-- CREATE POLICY "Allow public viewing"
-- ON storage.objects FOR SELECT
-- TO public
-- USING (bucket_id = 'fotos_imoveis');
