-- 1. Create function to auto-create tag from procedure
CREATE OR REPLACE FUNCTION public.auto_create_tag_from_procedure()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_colors TEXT[] := ARRAY[
    '#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB',
    '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784',
    '#AED581', '#DCE775', '#FFD54F', '#FFB74D', '#FF8A65',
    '#A1887F', '#90A4AE', '#F48FB1', '#CE93D8', '#B39DDB'
  ];
  v_random_color TEXT;
BEGIN
  -- Select a random color from the palette
  v_random_color := v_colors[1 + floor(random() * array_length(v_colors, 1))::int];
  
  -- Insert tag if it doesn't exist
  INSERT INTO crm_tags (organization_id, name, procedure_name, color, active)
  VALUES (NEW.organization_id, NEW.name, NEW.name, v_random_color, TRUE)
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$;

-- 2. Create trigger on crm_procedures
DROP TRIGGER IF EXISTS trigger_auto_create_tag_from_procedure ON crm_procedures;
CREATE TRIGGER trigger_auto_create_tag_from_procedure
AFTER INSERT ON crm_procedures
FOR EACH ROW
EXECUTE FUNCTION auto_create_tag_from_procedure();

-- 3. Backfill: Create tags for existing procedures that don't have one
INSERT INTO crm_tags (organization_id, name, procedure_name, color, active)
SELECT 
  p.organization_id, 
  p.name,
  p.name,
  (ARRAY[
    '#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB',
    '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784',
    '#AED581', '#DCE775', '#FFD54F', '#FFB74D', '#FF8A65',
    '#A1887F', '#90A4AE', '#F48FB1', '#CE93D8', '#B39DDB'
  ])[1 + floor(random() * 20)::int],
  TRUE
FROM crm_procedures p
WHERE NOT EXISTS (
  SELECT 1 FROM crm_tags t 
  WHERE t.organization_id = p.organization_id 
  AND t.procedure_name = p.name
);

-- 4. Update RLS policies for crm_tags to allow user, admin, super_admin
DROP POLICY IF EXISTS "Org users access own tags" ON public.crm_tags;
DROP POLICY IF EXISTS "Super admins full access tags" ON public.crm_tags;

CREATE POLICY "Org users full access tags"
ON public.crm_tags
FOR ALL
USING (organization_id = get_user_organization_id(auth.uid()));

CREATE POLICY "Super admins full access tags"
ON public.crm_tags
FOR ALL
USING (has_role(auth.uid(), 'super_admin'::app_role));