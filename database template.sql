-- ===============================================================
-- Complete Schema with Tables, RLS, Functions, and Triggers
-- (with added image_link columns for resources and blogs)
-- ===============================================================

-- -----------------------------
-- 0. Helper Function: is_admin()
-- -----------------------------
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- -----------------------------
-- 1. Profiles Table
-- -----------------------------
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone_number text,
  avatar_url text,
  ratings jsonb NOT NULL DEFAULT '[]'::jsonb,
  flight_hours jsonb NOT NULL DEFAULT '[]'::jsonb,
  aggregated_stats jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id)
      REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_rls ON public.profiles
  FOR ALL
  USING ( public.is_admin() OR id = auth.uid() )
  WITH CHECK ( public.is_admin() OR id = auth.uid() );
CREATE POLICY profiles_select_rls ON public.profiles
  FOR SELECT
  USING (true);

-- -----------------------------
-- 2. Admins Table
-- -----------------------------
DROP TABLE IF EXISTS public.admins CASCADE;
CREATE TABLE public.admins (
  id uuid PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admins_profile_fkey FOREIGN KEY (id)
      REFERENCES public.profiles(id)
      ON DELETE CASCADE
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY admins_rls ON public.admins
  FOR ALL
  USING ( id = auth.uid() )
  WITH CHECK ( id = auth.uid() );

-- -----------------------------
-- 3. Notices Table
-- -----------------------------
DROP TABLE IF EXISTS public.notices CASCADE;
CREATE TABLE public.notices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    time_off_incident TIMESTAMP with time zone,
    submitted_by uuid NOT NULL DEFAULT auth.uid(),
    extra_parameters JSONB,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fk_notices_submitted_by FOREIGN KEY (submitted_by)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) TABLESPACE pg_default;

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY notices_rls ON public.notices
  FOR ALL
  USING ( public.is_admin() OR submitted_by = auth.uid() )
  WITH CHECK ( public.is_admin() OR submitted_by = auth.uid() );

-- -----------------------------
-- 4. Instructors Table
-- -----------------------------
DROP TABLE IF EXISTS public.instructors CASCADE;
CREATE TABLE public.instructors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL,
    rating_level VARCHAR(50),
    availability TEXT,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fk_instructor_profile FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) TABLESPACE pg_default;

ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
CREATE POLICY instructors_rls ON public.instructors
  FOR ALL
  USING ( public.is_admin() OR profile_id = auth.uid() )
  WITH CHECK ( public.is_admin() OR profile_id = auth.uid() );
CREATE POLICY instructors_select_rls ON public.instructors
  FOR SELECT
  USING (true);

-- -----------------------------
-- 5. Resources Table (with image_link column)
-- -----------------------------
DROP TABLE IF EXISTS public.resources CASCADE;
CREATE TABLE public.resources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('aircraft','simulator','classroom')),
    name VARCHAR(255) NOT NULL,
    image_link text,  -- Added image link for resources
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available','maintenance','INOP')),
    total_hours NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    hourly_rate NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    last_service NUMERIC(5,2) DEFAULT 0.0,
    next_service NUMERIC(5,2) DEFAULT 0.0,
    persons_responsible jsonb,
    location text,
    details jsonb,
    notes text,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now()
) TABLESPACE pg_default;

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY resources_select_rls ON public.resources
  FOR SELECT
  USING (true);
CREATE POLICY resources_write_rls ON public.resources
  FOR ALL
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- -----------------------------
-- 6. Logbook Table
-- -----------------------------
DROP TABLE IF EXISTS public.logbook CASCADE;
CREATE TABLE public.logbook (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL DEFAULT auth.uid(),
  resource_id uuid NOT NULL,
  flight_date DATE NOT NULL,
  flight_time NUMERIC(5,2) NOT NULL,      -- flight time in hours
  notes TEXT,
  block_off_time TIME NOT NULL,
  takeoff_time TIME NOT NULL,
  landing_time TIME NOT NULL,
  block_on_time TIME NOT NULL,
  block_time NUMERIC(5,2) NOT NULL,       -- block time in hours
  landings INT NOT NULL,
  flight_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  fuel_left NUMERIC(5,2),
  billing_info TEXT,
  pax INT NOT NULL,
  departure_place TEXT NOT NULL,
  arrival_place TEXT NOT NULL,
  flight_type TEXT NOT NULL,
  pic_id uuid NOT NULL,
  student_id uuid,
  created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
  updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
  CONSTRAINT logbook_pkey PRIMARY KEY (id),
  CONSTRAINT fk_logbook_profile FOREIGN KEY (profile_id)
      REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_logbook_resource FOREIGN KEY (resource_id)
      REFERENCES public.resources(id) ON DELETE CASCADE,
  CONSTRAINT fk_logbook_pic FOREIGN KEY (pic_id)
      REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT fk_logbook_student FOREIGN KEY (student_id)
      REFERENCES public.profiles(id) ON DELETE CASCADE
) TABLESPACE pg_default;

ALTER TABLE public.logbook ENABLE ROW LEVEL SECURITY;
CREATE POLICY logbook_rls ON public.logbook
  FOR ALL
  USING ( public.is_admin() OR profile_id = auth.uid() )
  WITH CHECK ( public.is_admin() OR profile_id = auth.uid() );

-- --------------------------------------------------
-- 6.1 Function: Calculate Flight & Block Times
-- --------------------------------------------------
CREATE OR REPLACE FUNCTION public.calc_flight_block_times() 
RETURNS trigger AS $$
BEGIN
  NEW.flight_time := extract(epoch from (NEW.landing_time - NEW.takeoff_time)) / 3600.0;
  NEW.block_time := extract(epoch from (NEW.block_on_time - NEW.block_off_time)) / 3600.0;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE TRIGGER trg_calc_flight_block_times
BEFORE INSERT OR UPDATE ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.calc_flight_block_times();

-- --------------------------------------------------
-- 6.2 Function: Format Hours as "hh:mm"
-- --------------------------------------------------
CREATE OR REPLACE FUNCTION public.format_hours(total numeric)
RETURNS text AS $$
DECLARE
  hrs integer;
  mins integer;
BEGIN
  hrs := floor(total);
  mins := round((total - hrs) * 60);
  RETURN lpad(hrs::text, 2, '0') || ':' || lpad(mins::text, 2, '0');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- --------------------------------------------------
-- 6.3 Function: Aggregate Logbook Data & Update Aggregated Stats
-- --------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_aggregated_stats(profile uuid)
RETURNS void AS $$
DECLARE
  landings_json JSONB;
  flighthours_json JSONB;
BEGIN
  WITH landings_agg AS (
    SELECT 
      resource_id,
      SUM(CASE WHEN flight_date >= current_date - INTERVAL '30 days' THEN landings ELSE 0 END) AS last_month,
      SUM(CASE WHEN flight_date >= current_date - INTERVAL '90 days' THEN landings ELSE 0 END) AS last_90_days,
      SUM(CASE WHEN flight_date >= current_date - INTERVAL '180 days' THEN landings ELSE 0 END) AS last_6m,
      SUM(CASE WHEN flight_date >= current_date - INTERVAL '365 days' THEN landings ELSE 0 END) AS last_year,
      SUM(landings) AS total
    FROM public.logbook
    WHERE profile_id = profile
    GROUP BY resource_id
  )
  SELECT COALESCE(json_object_agg(resource_id, 
         json_build_object(
           'last_month', last_month,
           'last_90_days', last_90_days,
           'last_6_months', last_6m,
           'last_year', last_year,
           'total', total
         )), '{}'::jsonb)
  INTO landings_json
  FROM landings_agg;

  WITH flighthours_agg AS (
    SELECT 
      to_char(flight_date, 'YYYY-MM') AS month,
      SUM(flight_time) AS total_flight_time
    FROM public.logbook
    WHERE profile_id = profile
      AND flight_date >= current_date - INTERVAL '1 year'
    GROUP BY to_char(flight_date, 'YYYY-MM')
  )
  SELECT COALESCE(
           json_build_object(
             'monthly', json_object_agg(month, total_flight_time),
             'total_last_year', SUM(total_flight_time)
           ), '{}'::jsonb)
  INTO flighthours_json
  FROM flighthours_agg;

  UPDATE public.profiles
  SET aggregated_stats = json_build_object(
      'landings', json_build_object('resources', landings_json),
      'flightHours', flighthours_json
    )
  WHERE id = profile;
END;
$$ LANGUAGE plpgsql;

-- --------------------------------------------------
-- 6.4 Trigger Function: Update Aggregated Stats on Logbook Changes
-- --------------------------------------------------
CREATE OR REPLACE FUNCTION public.trigger_update_aggregated_stats()
RETURNS trigger AS $$
DECLARE
  v_profile uuid;
BEGIN
  IF (TG_OP = 'DELETE') THEN
    v_profile := OLD.profile_id;
  ELSE
    v_profile := NEW.profile_id;
  END IF;
  PERFORM public.update_aggregated_stats(v_profile);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_aggregated_stats_after_insert
AFTER INSERT ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_aggregated_stats();

CREATE TRIGGER trg_update_aggregated_stats_after_update
AFTER UPDATE ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_aggregated_stats();

CREATE TRIGGER trg_update_aggregated_stats_after_delete
AFTER DELETE ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_aggregated_stats();

-- --------------------------------------------------
-- 6.5 Function: Calculate Total Hours for a Resource (from Logbook)
-- --------------------------------------------------
CREATE OR REPLACE FUNCTION public.calculate_total_hours_for_resource(p_resource_id uuid)
RETURNS numeric AS $$
DECLARE
    total_hours numeric;
BEGIN
    SELECT COALESCE(SUM(flight_time), 0.0)
      INTO total_hours
      FROM public.logbook
      WHERE resource_id = p_resource_id;
    
    RETURN total_hours;
END;
$$ LANGUAGE plpgsql STABLE;

-- --------------------------------------------------
-- 6.6 Trigger Function: Update Resource.total_hours Column
-- --------------------------------------------------
CREATE OR REPLACE FUNCTION public.trigger_update_resource_total_hours()
RETURNS trigger AS $$
DECLARE
    v_resource_id uuid;
BEGIN
    IF TG_OP = 'DELETE' THEN
        v_resource_id := OLD.resource_id;
    ELSE
        v_resource_id := NEW.resource_id;
    END IF;
    
    UPDATE public.resources
    SET total_hours = public.calculate_total_hours_for_resource(v_resource_id)
    WHERE id = v_resource_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE TRIGGER trg_update_resource_total_hours_after_insert
AFTER INSERT ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_resource_total_hours();

CREATE TRIGGER trg_update_resource_total_hours_after_update
AFTER UPDATE ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_resource_total_hours();

CREATE TRIGGER trg_update_resource_total_hours_after_delete
AFTER DELETE ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_resource_total_hours();

-- -----------------------------
-- 7. Flightplans Table
-- -----------------------------
DROP TABLE IF EXISTS public.flightplans CASCADE;
CREATE TABLE public.flightplans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL DEFAULT auth.uid(),
    route TEXT NOT NULL,
    notes TEXT,
    international BOOLEAN,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fk_flightplan_creator FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) TABLESPACE pg_default;

ALTER TABLE public.flightplans ENABLE ROW LEVEL SECURITY;
CREATE POLICY flightplans_rls ON public.flightplans
  FOR ALL
  USING ( public.is_admin() OR profile_id = auth.uid() )
  WITH CHECK ( public.is_admin() OR profile_id = auth.uid() );

-- -----------------------------
-- 8. Bookings Table
-- -----------------------------
DROP TABLE IF EXISTS public.bookings CASCADE;
CREATE TABLE public.bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL DEFAULT auth.uid(),
    resource_id uuid NOT NULL,
    instructor_id uuid,
    start_time TIMESTAMP with time zone NOT NULL,
    end_time TIMESTAMP with time zone NOT NULL,
    title TEXT,
    notes TEXT,
    flight_type JSONB NOT NULL,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fk_booking_profile FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_resource FOREIGN KEY (resource_id)
        REFERENCES public.resources(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_booking_instructor FOREIGN KEY (instructor_id)
        REFERENCES public.instructors(id)
        ON DELETE CASCADE
) TABLESPACE pg_default;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY bookings_rls ON public.bookings
  FOR ALL
  USING ( public.is_admin() OR profile_id = auth.uid() )
  WITH CHECK ( public.is_admin() OR profile_id = auth.uid() );
CREATE POLICY bookings_select_rls ON public.bookings
  FOR SELECT
  USING (true);

-- -----------------------------
-- 9. Blogs Table (with image_link column)
-- -----------------------------
DROP TABLE IF EXISTS public.blogs CASCADE;
CREATE TABLE public.blogs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL DEFAULT auth.uid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    image_link text,  -- Added image link for blogs
    published_at TIMESTAMP with time zone,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fk_blog_author FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) TABLESPACE pg_default;

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY blogs_rls ON public.blogs
  FOR ALL
  USING ( public.is_admin() OR profile_id = auth.uid() )
  WITH CHECK ( public.is_admin() OR profile_id = auth.uid() );
CREATE POLICY blogs_select_rls ON public.blogs
  FOR SELECT
  USING (true);

-- ===============================================================
-- End of Schema
-- ===============================================================
