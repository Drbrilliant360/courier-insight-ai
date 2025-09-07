-- Create custom types
CREATE TYPE public.delivery_status AS ENUM ('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled');
CREATE TYPE public.anomaly_severity AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.courier_status AS ENUM ('offline', 'available', 'busy', 'on_break');

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'user',
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create couriers table
CREATE TABLE public.couriers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  status courier_status DEFAULT 'offline',
  current_location POINT,
  vehicle_type TEXT,
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_deliveries INTEGER DEFAULT 0,
  on_time_deliveries INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  pickup_location POINT NOT NULL,
  pickup_address TEXT NOT NULL,
  delivery_location POINT NOT NULL,
  delivery_address TEXT NOT NULL,
  status delivery_status DEFAULT 'pending',
  estimated_pickup_time TIMESTAMP WITH TIME ZONE,
  actual_pickup_time TIMESTAMP WITH TIME ZONE,
  estimated_delivery_time TIMESTAMP WITH TIME ZONE,
  actual_delivery_time TIMESTAMP WITH TIME ZONE,
  courier_id UUID REFERENCES public.couriers(id) ON DELETE SET NULL,
  special_instructions TEXT,
  priority_level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create delivery_tracking table for real-time updates
CREATE TABLE public.delivery_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  courier_id UUID REFERENCES public.couriers(id) ON DELETE SET NULL,
  location POINT NOT NULL,
  status delivery_status NOT NULL,
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create anomalies table
CREATE TABLE public.anomalies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  courier_id UUID REFERENCES public.couriers(id) ON DELETE SET NULL,
  anomaly_type TEXT NOT NULL,
  description TEXT NOT NULL,
  severity anomaly_severity DEFAULT 'medium',
  detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_resolved BOOLEAN DEFAULT FALSE
);

-- Create analytics_data table for storing uploaded datasets
CREATE TABLE public.analytics_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  total_records INTEGER NOT NULL,
  processed_records INTEGER DEFAULT 0,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processing_status TEXT DEFAULT 'pending',
  metadata JSONB
);

-- Create zones table for delivery zones
CREATE TABLE public.zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  boundary POLYGON NOT NULL,
  delivery_fee DECIMAL(10,2) DEFAULT 0.00,
  avg_delivery_time INTEGER, -- in minutes
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for couriers (admins can manage, couriers can view/update own)
CREATE POLICY "Everyone can view couriers" ON public.couriers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert couriers" ON public.couriers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Couriers can update own profile" ON public.couriers FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IN (SELECT user_id FROM public.profiles WHERE role = 'admin'));

-- Create RLS policies for orders (all authenticated users can view, admins can modify)
CREATE POLICY "Authenticated users can view orders" ON public.orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update orders" ON public.orders FOR UPDATE TO authenticated USING (true);

-- Create RLS policies for delivery_tracking
CREATE POLICY "Authenticated users can view tracking" ON public.delivery_tracking FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert tracking" ON public.delivery_tracking FOR INSERT TO authenticated WITH CHECK (true);

-- Create RLS policies for anomalies
CREATE POLICY "Authenticated users can view anomalies" ON public.anomalies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert anomalies" ON public.anomalies FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update anomalies" ON public.anomalies FOR UPDATE TO authenticated USING (true);

-- Create RLS policies for analytics_data
CREATE POLICY "Users can view own analytics data" ON public.analytics_data FOR SELECT USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can insert own analytics data" ON public.analytics_data FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can update own analytics data" ON public.analytics_data FOR UPDATE USING (auth.uid() = uploaded_by);

-- Create RLS policies for zones
CREATE POLICY "Everyone can view zones" ON public.zones FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage zones" ON public.zones FOR ALL TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_courier_id ON public.orders(courier_id);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_delivery_tracking_order_id ON public.delivery_tracking(order_id);
CREATE INDEX idx_delivery_tracking_timestamp ON public.delivery_tracking(timestamp);
CREATE INDEX idx_anomalies_detected_at ON public.anomalies(detected_at);
CREATE INDEX idx_anomalies_severity ON public.anomalies(severity);
CREATE INDEX idx_couriers_status ON public.couriers(status);

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_couriers_updated_at BEFORE UPDATE ON public.couriers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for development
INSERT INTO public.couriers (name, phone, email, status, vehicle_type, rating, total_deliveries, on_time_deliveries) VALUES
('John Smith', '+1234567890', 'john@example.com', 'available', 'bike', 4.8, 156, 154),
('Maria Garcia', '+1234567891', 'maria@example.com', 'busy', 'scooter', 4.9, 142, 139),
('David Chen', '+1234567892', 'david@example.com', 'available', 'car', 4.7, 138, 133),
('Sarah Johnson', '+1234567893', 'sarah@example.com', 'on_break', 'bike', 4.6, 129, 122),
('Ahmed Ali', '+1234567894', 'ahmed@example.com', 'available', 'scooter', 4.5, 134, 125);

-- Insert sample zones
INSERT INTO public.zones (name, boundary, delivery_fee, avg_delivery_time) VALUES
('Manhattan', 'POLYGON((-74.0479 40.6829, -73.9067 40.6829, -73.9067 40.8176, -74.0479 40.8176, -74.0479 40.6829))', 5.00, 22),
('Brooklyn', 'POLYGON((-74.0421 40.5707, -73.8331 40.5707, -73.8331 40.7395, -74.0421 40.7395, -74.0421 40.5707))', 4.50, 26),
('Queens', 'POLYGON((-73.9623 40.5411, -73.7004 40.5411, -73.7004 40.8007, -73.9623 40.8007, -73.9623 40.5411))', 4.00, 28);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.anomalies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.couriers;