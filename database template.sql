-- ===============================================================
-- 1. Create the Profiles Table (without policies yet)
-- ===============================================================
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone_number text,
  avatar_url text,
  ratings jsonb NOT NULL DEFAULT '[]'::jsonb,      
  flight_hours jsonb NOT NULL DEFAULT '[]'::jsonb,   -- e.g. {"resources": "120:30"}
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id)
      REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- ===============================================================
-- Create a Trigger Function to Auto-Create a Profile for a New User
-- ===============================================================
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (NEW.id, '', '', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===============================================================
-- Create a Trigger on auth.users to Invoke the Function After Insert
-- ===============================================================
CREATE TRIGGER trg_create_profile_for_new_user
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();

-- ===============================================================
-- 2. Create the Admins Table with a foreign key to Profiles
-- ===============================================================
CREATE TABLE public.admins (
  id uuid PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT admins_profile_fkey FOREIGN KEY (id)
      REFERENCES public.profiles(id)
      ON DELETE CASCADE
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- ===============================================================
-- 3. Create Helper Function to Check Admin Status
-- ===============================================================
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admins
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- ===============================================================
-- 4. Enable RLS and add Policies for the Profiles Table
-- ===============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_rls ON public.profiles
  FOR ALL
  USING (
    public.is_admin() OR
    id = auth.uid()
  )
  WITH CHECK (
    public.is_admin() OR
    id = auth.uid()
  );

-- Allow all users to SELECT profiles.
CREATE POLICY profiles_select_rls ON public.profiles
  FOR SELECT
  USING (true);

-- ===============================================================
-- 5. Create the Notices Table and its RLS Policies
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.notices (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    time_off_incident TIMESTAMP with time zone,  -- When the time off incident occurred
    submitted_by uuid NOT NULL,                    -- Profile/User who submitted the notice
    extra_parameters JSONB DEFAULT NULL,           -- Additional parameters stored as JSON
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fk_notices_submitted_by FOREIGN KEY (submitted_by)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY notices_rls ON public.notices
  FOR ALL
  USING (
    public.is_admin() OR
    submitted_by = auth.uid()
  )
  WITH CHECK (
    public.is_admin() OR
    submitted_by = auth.uid()
  );

-- ===============================================================
-- 6. Create the Instructors Table and its RLS Policies
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.instructors (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL,
    rating_level VARCHAR(50),      -- e.g., "CFI", "CFII", etc.
    availability TEXT,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fk_instructor_profile FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY instructors_rls ON public.instructors
  FOR ALL
  USING (
    public.is_admin() OR
    profile_id = auth.uid()
  )
  WITH CHECK (
    public.is_admin() OR
    profile_id = auth.uid()
  );

-- Allow all users to SELECT instructors.
CREATE POLICY instructors_select_rls ON public.instructors
  FOR SELECT
  USING (true);

-- ===============================================================
-- 7. Create the Resources Table and its RLS Policies
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.resources (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('aircraft','simulator','classroom')),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'available' CHECK (status IN ('available','maintenance','INOP')),
    total_hours NUMERIC(5,2) NOT NULL DEFAULT 0.0,  -- Aggregated flight hours from logbook.
    hourly_rate NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    last_service NUMERIC(5,2) DEFAULT 0.0,
    next_service NUMERIC(5,2) DEFAULT 0.0,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Allow all users to read resources.
CREATE POLICY resources_select_rls ON public.resources
  FOR SELECT
  USING (true);

-- Restrict modifications to admins only.
CREATE POLICY resources_write_rls ON public.resources
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ===============================================================
-- 8. Create the Logbook Table and its RLS Policies
-- ===============================================================
CREATE TABLE public.logbook (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  resource_id uuid NOT NULL,
  
  -- Original columns
  flight_date DATE NOT NULL,            -- Date of flight
  flight_time NUMERIC(5,2) NOT NULL,      -- Total flight time (e.g. air time)
  notes TEXT NULL,
  
  -- New time-related columns
  block_off_time TIME WITHOUT TIME ZONE NOT NULL,  -- Time aircraft leaves the ramp
  takeoff_time TIME WITHOUT TIME ZONE NOT NULL,    -- Time wheels leave the ground
  landing_time TIME WITHOUT TIME ZONE NOT NULL,    -- Time wheels touch the ground
  block_on_time TIME WITHOUT TIME ZONE NOT NULL,   -- Time aircraft is parked after flight
  block_time NUMERIC(5,2) NOT NULL,       -- Total block time in hours
  
  -- Additional fields
  landings INT NOT NULL,                           -- Number of landings
  flight_details JSONB NOT NULL DEFAULT '{}',     -- JSON for night flight, IFR time, etc.
  fuel_left NUMERIC(5,2) NULL,                     -- Remaining fuel in gallons/liters
  billing_info TEXT NULL,                          -- Billing information or reference
  pax INT NOT NULL,                                -- Number of passengers
  departure_place TEXT NOT NULL,                   -- Departure airport or location
  arrival_place TEXT NOT NULL,                     -- Arrival airport or location
  flight_type TEXT NOT NULL,                       -- Type of flight (e.g. 'VFR', 'IFR', 'Training')
  
  -- References to profiles for PIC and Student (if applicable)
  pic_id uuid NOT NULL,
  student_id uuid NULL,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Primary Key
  CONSTRAINT logbook_pkey PRIMARY KEY (id),
  
  -- Foreign Keys
  CONSTRAINT fk_logbook_profile FOREIGN KEY (profile_id) REFERENCES public.profiles (id)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_logbook_resource FOREIGN KEY (resource_id) REFERENCES public.resources (id)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_logbook_pic FOREIGN KEY (pic_id) REFERENCES public.profiles (id)
      ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_logbook_student FOREIGN KEY (student_id) REFERENCES public.profiles (id)
      ON UPDATE CASCADE ON DELETE CASCADE
)
TABLESPACE pg_default;

-- ===============================================================
-- 8.1 Create a Trigger Function to Calculate Flight & Block Times
-- ===============================================================
CREATE OR REPLACE FUNCTION public.calc_flight_block_times() 
RETURNS trigger AS $$
BEGIN
  -- Calculate flight_time as difference (in hours) between landing_time and takeoff_time.
  NEW.flight_time := extract(epoch from (NEW.landing_time - NEW.takeoff_time)) / 3600.0;
  
  -- Calculate block_time as difference (in hours) between block_on_time and block_off_time.
  NEW.block_time := extract(epoch from (NEW.block_on_time - NEW.block_off_time)) / 3600.0;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calc_flight_block_times
BEFORE INSERT OR UPDATE ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.calc_flight_block_times();

ALTER TABLE public.logbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY logbook_rls ON public.logbook
  FOR ALL
  USING (
    public.is_admin() OR
    profile_id = auth.uid()
  )
  WITH CHECK (
    public.is_admin() OR
    profile_id = auth.uid()
  );

-- ===============================================================
-- 8.2 Create a Helper Function to Format Hours as "hh:mm"
-- ===============================================================
CREATE OR REPLACE FUNCTION public.format_hours(total numeric)
RETURNS text AS $$
DECLARE
  hrs integer;
  mins integer;
BEGIN
  hrs := floor(total);
  mins := round((total - hrs) * 60);
  RETURN hrs || ':' || lpad(mins::text, 2, '0');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ===============================================================
-- 8.3 Create a Trigger Function to Update Flight Hours Summary
-- ===============================================================
CREATE OR REPLACE FUNCTION public.update_flight_hours_summary()
RETURNS trigger AS $$
DECLARE
  total_profile_hours numeric;
  total_resource_hours numeric;
BEGIN
  -- Update Profile: Sum flight_time for this profile.
  SELECT COALESCE(SUM(flight_time), 0)
  INTO total_profile_hours
  FROM public.logbook
  WHERE profile_id = COALESCE(NEW.profile_id, OLD.profile_id);

  UPDATE public.profiles
  SET flight_hours = jsonb_build_object('resources', public.format_hours(total_profile_hours))
  WHERE id = COALESCE(NEW.profile_id, OLD.profile_id);

  -- Update Resource: Sum flight_time for this resource.
  SELECT COALESCE(SUM(flight_time), 0)
  INTO total_resource_hours
  FROM public.logbook
  WHERE resource_id = COALESCE(NEW.resource_id, OLD.resource_id);

  UPDATE public.resources
  SET total_hours = total_resource_hours
  WHERE id = COALESCE(NEW.resource_id, OLD.resource_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ===============================================================
-- 8.4 Create Triggers to Update Flight Hours Summary on Logbook Changes
-- ===============================================================
CREATE TRIGGER trg_update_flight_hours_summary_after_insert
AFTER INSERT ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.update_flight_hours_summary();

CREATE TRIGGER trg_update_flight_hours_summary_after_update
AFTER UPDATE ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.update_flight_hours_summary();

CREATE TRIGGER trg_update_flight_hours_summary_after_delete
AFTER DELETE ON public.logbook
FOR EACH ROW
EXECUTE FUNCTION public.update_flight_hours_summary();

-- ===============================================================
-- 9. Create the Flightplans Table and its RLS Policies
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.flightplans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL,  -- Profile who created the plan
    route text NOT NULL,
    notes text,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    international BOOLEAN NULL,
    CONSTRAINT fk_flightplan_creator FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

ALTER TABLE public.flightplans ENABLE ROW LEVEL SECURITY;

CREATE POLICY flightplans_rls ON public.flightplans
  FOR ALL
  USING (
    public.is_admin() OR
    profile_id = auth.uid()
  )
  WITH CHECK (
    public.is_admin() OR
    profile_id = auth.uid()
  );

-- ===============================================================
-- 10. Create the Bookings Table and its RLS Policies
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL,    -- The person making the booking
    resource_id uuid NOT NULL,    -- References public.resources.id
    instructor_id uuid NULL,     -- References public.instructors.id
    start_time TIMESTAMP with time zone NOT NULL,
    end_time TIMESTAMP with time zone NOT NULL,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fk_booking_profile FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_booking_resource FOREIGN KEY (resource_id)
        REFERENCES public.resources(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_booking_instructor FOREIGN KEY (instructor_id)
        REFERENCES public.instructors(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY bookings_rls ON public.bookings
  FOR ALL
  USING (
    public.is_admin() OR
    profile_id = auth.uid()
  )
  WITH CHECK (
    public.is_admin() OR
    profile_id = auth.uid()
  );

-- Allow all users to read bookings.
CREATE POLICY bookings_select_rls ON public.bookings
  FOR SELECT
  USING (true);

-- ===============================================================
-- 11. Create the Blogs Table and its RLS Policies
-- ===============================================================
CREATE TABLE IF NOT EXISTS public.blogs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id uuid NOT NULL,
    title VARCHAR(255) NOT NULL,
    content text NOT NULL,
    published_at TIMESTAMP with time zone DEFAULT NULL,
    created_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    updated_at TIMESTAMP with time zone NOT NULL DEFAULT now(),
    CONSTRAINT fk_blog_author FOREIGN KEY (profile_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

CREATE POLICY blogs_rls ON public.blogs
  FOR ALL
  USING (
    public.is_admin() OR
    profile_id = auth.uid()
  )
  WITH CHECK (
    public.is_admin() OR
    profile_id = auth.uid()
  );

-- Allow all users to read blogs.
CREATE POLICY blogs_select_rls ON public.blogs
  FOR SELECT
  USING (true);
