export const POSTGRESQL_MIGRATION_SQL = `-- ====================================================================
-- POLLACHI INSTITUTE OF ENGINEERING AND TECHNOLOGY (PIE TECH)
-- PERSONALIZED LEARNING PATH RECOMMENDATION SYSTEM
-- DATABASE SCHEMA MIGRATION (SUPABASE / POSTGRESQL 15+)
-- ====================================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if needed (cascade)
-- DROP TABLE IF EXISTS path_milestones CASCADE;
-- DROP TABLE IF EXISTS learning_paths CASCADE;
-- DROP TABLE IF EXISTS student_skills CASCADE;
-- DROP TABLE IF EXISTS skills CASCADE;
-- DROP TABLE IF EXISTS students CASCADE;

-- ====================================================================
-- TABLE 1: students
-- Captures PIE Tech enrolled students, academic standing, and predictive readiness
-- ====================================================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    roll_no VARCHAR(20) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL CHECK (department IN ('CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AI_DS')),
    year VARCHAR(20) NOT NULL CHECK (year IN ('1st Year', '2nd Year', '3rd Year', 'Final Year')),
    semester VARCHAR(10) NOT NULL,
    cgpa NUMERIC(4, 2) NOT NULL DEFAULT 7.50 CHECK (cgpa >= 0.0 AND cgpa <= 10.0),
    target_career VARCHAR(150) NOT NULL,
    learning_style VARCHAR(50) NOT NULL DEFAULT 'Project-based',
    readiness_score INT NOT NULL DEFAULT 0 CHECK (readiness_score >= 0 AND readiness_score <= 100),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_students_department ON students(department);
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students(roll_no);
CREATE INDEX IF NOT EXISTS idx_students_target_career ON students(target_career);

-- ====================================================================
-- TABLE 2: skills
-- Global taxonomy of technical & domain proficiencies evaluated
-- ====================================================================
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    domain VARCHAR(100) NOT NULL,
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced')),
    category VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_domain ON skills(domain);
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);

-- ====================================================================
-- TABLE 3: student_skills
-- M:N join table tracking proficiency levels, quiz validations, and last assessment
-- ====================================================================
CREATE TABLE IF NOT EXISTS student_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    skill_id VARCHAR(50) NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INT NOT NULL DEFAULT 0 CHECK (proficiency_level >= 0 AND proficiency_level <= 100),
    industry_benchmark INT NOT NULL DEFAULT 80 CHECK (industry_benchmark >= 0 AND industry_benchmark <= 100),
    verified_by_quiz BOOLEAN NOT NULL DEFAULT FALSE,
    quiz_score INT CHECK (quiz_score IS NULL OR (quiz_score >= 0 AND quiz_score <= 100)),
    last_assessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_student_skill UNIQUE (student_id, skill_id)
);

CREATE INDEX IF NOT EXISTS idx_student_skills_student_id ON student_skills(student_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_skill_id ON student_skills(skill_id);

-- ====================================================================
-- TABLE 4: learning_paths
-- Dynamic recommended pathways generated for each student
-- ====================================================================
CREATE TABLE IF NOT EXISTS learning_paths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    target_role VARCHAR(150) NOT NULL,
    total_milestones INT NOT NULL DEFAULT 0,
    completed_milestones INT NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
    estimated_total_weeks INT NOT NULL DEFAULT 16,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_learning_paths_student_id ON learning_paths(student_id);

-- ====================================================================
-- TABLE 5: path_milestones
-- Step-by-step nodes in the branching curriculum graph
-- ====================================================================
CREATE TABLE IF NOT EXISTS path_milestones (
    id VARCHAR(50) PRIMARY KEY,
    path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    step_order INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    resource_url TEXT NOT NULL,
    resource_type VARCHAR(50) DEFAULT 'Interactive Lab',
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    relevance_percent INT NOT NULL DEFAULT 90 CHECK (relevance_percent >= 0 AND relevance_percent <= 100),
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    prerequisite_id VARCHAR(50) REFERENCES path_milestones(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_path_step UNIQUE (path_id, step_order)
);

CREATE INDEX IF NOT EXISTS idx_path_milestones_path_id ON path_milestones(path_id);
CREATE INDEX IF NOT EXISTS idx_path_milestones_prereq ON path_milestones(prerequisite_id);

-- ====================================================================
-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE path_milestones ENABLE ROW LEVEL SECURITY;

-- Allow public read for taxonomy
CREATE POLICY "Public can view skills taxonomy" ON skills FOR SELECT USING (true);

-- Allow authenticated students to read their own records
CREATE POLICY "Students can read own profile" ON students
    FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');

CREATE POLICY "Students can manage own skills" ON student_skills
    FOR ALL USING (auth.uid()::text = student_id::text OR auth.role() = 'authenticated');

CREATE POLICY "Students can manage own learning paths" ON learning_paths
    FOR ALL USING (auth.uid()::text = student_id::text OR auth.role() = 'authenticated');

CREATE POLICY "Students can update own milestones" ON path_milestones
    FOR ALL USING (EXISTS (
        SELECT 1 FROM learning_paths lp 
        WHERE lp.id = path_milestones.path_id 
        AND (lp.student_id::text = auth.uid()::text OR auth.role() = 'authenticated')
    ));

-- ====================================================================
-- AUTOMATED TRIGGER: RECALCULATE COMPLETED MILESTONES ON UPDATE
-- ====================================================================
CREATE OR REPLACE FUNCTION update_learning_path_counts()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE learning_paths
    SET 
        completed_milestones = (
            SELECT COUNT(*) FROM path_milestones 
            WHERE path_id = NEW.path_id AND is_completed = TRUE
        ),
        total_milestones = (
            SELECT COUNT(*) FROM path_milestones 
            WHERE path_id = NEW.path_id
        ),
        last_updated = NOW()
    WHERE id = NEW.path_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_recalculate_milestones
AFTER INSERT OR UPDATE OF is_completed OR DELETE ON path_milestones
FOR EACH ROW EXECUTE FUNCTION update_learning_path_counts();

-- ====================================================================
-- SEED DATA FOR POLLACHI INSTITUTE OF ENGINEERING AND TECHNOLOGY
-- ====================================================================
INSERT INTO skills (id, name, domain, difficulty_level, category) VALUES
('s_dsa', 'Data Structures & Algorithms', 'Computer Science', 'Intermediate', 'core'),
('s_js_ts', 'JavaScript & Modern TypeScript', 'Web Development', 'Beginner', 'framework'),
('s_react', 'React.js & State Architecture', 'Frontend Engineering', 'Intermediate', 'framework'),
('s_node', 'Node.js, Express & Microservices', 'Backend Engineering', 'Intermediate', 'framework'),
('s_db', 'PostgreSQL & Database Design', 'Database Systems', 'Intermediate', 'core'),
('s_docker', 'Docker Containers & CI/CD', 'Cloud DevOps', 'Intermediate', 'cloud'),
('s_emb_c', 'Embedded C & C++20', 'Embedded Systems', 'Intermediate', 'core'),
('s_mcu', 'ARM Cortex & ESP32 Microcontrollers', 'Hardware', 'Intermediate', 'hardware'),
('s_rtos', 'FreeRTOS & Real-Time Kernels', 'System Software', 'Advanced', 'core')
ON CONFLICT (id) DO NOTHING;

INSERT INTO students (id, full_name, roll_no, department, year, semester, cgpa, target_career, learning_style, readiness_score, email) VALUES
('a1111111-1111-1111-1111-111111111111', 'Karthik Subramanian', '721421104042', 'CSE', '3rd Year', 'Sem 6', 8.64, 'Full-Stack Software Engineer', 'Project-based', 74, 'karthik.s.cse@pietech.edu.in')
ON CONFLICT (roll_no) DO NOTHING;
`;
