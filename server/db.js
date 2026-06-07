import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'gym.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    sub_muscles TEXT NOT NULL DEFAULT '[]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS workouts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    notes TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS workout_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
  );

  CREATE TABLE IF NOT EXISTS sets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_exercise_id INTEGER NOT NULL,
    reps INTEGER NOT NULL DEFAULT 0,
    weight REAL NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
  );
`);

try { db.exec(`ALTER TABLE exercises ADD COLUMN sub_muscles TEXT NOT NULL DEFAULT '[]'`); } catch {}
try { db.exec(`ALTER TABLE exercises ADD COLUMN gif_url TEXT DEFAULT ''`); } catch {}
try { db.exec(`ALTER TABLE exercises ADD COLUMN equipment TEXT DEFAULT ''`); } catch {}

// Migrate exercises unique constraint: name → (name, category)
// so exercises can appear in multiple categories
try {
  db.exec('CREATE TABLE _migration_flag (dummy INTEGER)');
  db.exec(`CREATE TABLE exercises_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT '',
    sub_muscles TEXT NOT NULL DEFAULT '[]',
    gif_url TEXT DEFAULT '',
    equipment TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, category)
  )`);
  const count = db.prepare('SELECT COUNT(*) as c FROM exercises').get();
  if (count.c > 0) {
    db.exec(`
      INSERT OR IGNORE INTO exercises_new (id, name, category, sub_muscles, gif_url, equipment, created_at)
        SELECT id, name, category, sub_muscles, COALESCE(gif_url, ''), COALESCE(equipment, ''), created_at FROM exercises;
      DROP TABLE exercises;
      ALTER TABLE exercises_new RENAME TO exercises;
    `);
  }
} catch {};

db.exec(`
  CREATE TABLE IF NOT EXISTS fitness_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT '',
    age INTEGER DEFAULT 0,
    gender TEXT DEFAULT '',
    height REAL DEFAULT 0,
    weight REAL DEFAULT 0,
    target_weight REAL DEFAULT 0,
    level TEXT DEFAULT '',
    goal TEXT DEFAULT '',
    frequency INTEGER DEFAULT 0,
    location TEXT DEFAULT '',
    equipment TEXT DEFAULT '[]',
    onboarding_completed INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    target_value REAL DEFAULT 0,
    current_value REAL DEFAULT 0,
    start_date TEXT DEFAULT '',
    target_date TEXT DEFAULT '',
    status TEXT DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS progress_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    weight REAL DEFAULT 0,
    chest REAL DEFAULT 0,
    waist REAL DEFAULT 0,
    arm REAL DEFAULT 0,
    thigh REAL DEFAULT 0,
    body_fat REAL DEFAULT 0,
    notes TEXT DEFAULT '',
    photo_url TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL DEFAULT 'workout',
    day TEXT NOT NULL DEFAULT '',
    time TEXT NOT NULL DEFAULT '18:00',
    enabled INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS workout_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    day TEXT NOT NULL,
    estimated_duration INTEGER DEFAULT 0,
    notes TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS workout_plan_exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plan_id INTEGER NOT NULL,
    exercise_id INTEGER NOT NULL,
    target_sets INTEGER DEFAULT 3,
    target_reps INTEGER DEFAULT 10,
    target_weight REAL DEFAULT 0,
    rest_time INTEGER DEFAULT 90,
    sort_order INTEGER DEFAULT 0,
    FOREIGN KEY (plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id)
  );
`);

// Seed single default profile row if none exists
const profileCount = db.prepare('SELECT COUNT(*) as c FROM fitness_profile').get();
if (profileCount.c === 0) {
  db.prepare('INSERT INTO fitness_profile (id) VALUES (1)').run();
}

const seedExercises = db.prepare(`
  INSERT OR IGNORE INTO exercises (name, category, equipment) VALUES (?, ?, ?)
`);

const defaultExercises = [
  // ===== DADA (Chest) =====
  ['Bench Press', 'Dada', 'Barbel'],
  ['Incline Bench Press', 'Dada', 'Barbel'],
  ['Decline Bench Press', 'Dada', 'Barbel'],
  ['Dumbbell Bench Press', 'Dada', 'Dumbbel'],
  ['Incline Dumbbell Press', 'Dada', 'Dumbbel'],
  ['Decline Dumbbell Press', 'Dada', 'Dumbbel'],
  ['Dumbbell Fly', 'Dada', 'Dumbbel'],
  ['Incline Dumbbell Fly', 'Dada', 'Dumbbel'],
  ['Cable Crossover', 'Dada', 'Cable Machine'],
  ['Low Cable Crossover', 'Dada', 'Cable Machine'],
  ['High Cable Crossover', 'Dada', 'Cable Machine'],
  ['Push Up', 'Dada', ''],
  ['Decline Push Up', 'Dada', ''],
  ['Incline Push Up', 'Dada', ''],
  ['Diamond Push Up', 'Dada', ''],
  ['Wide Push Up', 'Dada', ''],
  ['Dips', 'Dada', ''],
  ['Machine Chest Press', 'Dada', 'Mesin Gym'],
  ['Pec Deck Machine', 'Dada', 'Mesin Gym'],
  ['Pullover', 'Dada', 'Dumbbel'],
  ['Smith Machine Bench Press', 'Dada', 'Mesin Gym'],
  ['Floor Press', 'Dada', 'Barbel'],
  ['Svend Press', 'Dada', 'Dumbbel'],

  // ===== PUNGGUNG (Back) =====
  ['Pull Up', 'Punggung', 'Pull Up Bar'],
  ['Wide Grip Pull Up', 'Punggung', 'Pull Up Bar'],
  ['Chin Up', 'Punggung', 'Pull Up Bar'],
  ['Lat Pulldown', 'Punggung', 'Cable Machine'],
  ['Wide Grip Lat Pulldown', 'Punggung', 'Cable Machine'],
  ['Close Grip Lat Pulldown', 'Punggung', 'Cable Machine'],
  ['Barbell Row', 'Punggung', 'Barbel'],
  ['Pendlay Row', 'Punggung', 'Barbel'],
  ['Dumbbell Row', 'Punggung', 'Dumbbel'],
  ['T-Bar Row', 'Punggung', 'Barbel'],
  ['Seated Cable Row', 'Punggung', 'Cable Machine'],
  ['Single Arm Cable Row', 'Punggung', 'Cable Machine'],
  ['Deadlift', 'Punggung', 'Barbel'],
  ['Sumo Deadlift', 'Punggung', 'Barbel'],
  ['Trap Bar Deadlift', 'Punggung', 'Barbel'],
  ['Rack Pull', 'Punggung', 'Barbel'],
  ['Face Pull', 'Punggung', 'Cable Machine'],
  ['Straight Arm Pulldown', 'Punggung', 'Cable Machine'],
  ['Reverse Fly', 'Punggung', 'Dumbbel'],
  ['Machine Row', 'Punggung', 'Mesin Gym'],
  ['Chest Supported Row', 'Punggung', 'Dumbbel'],
  ['Meadows Row', 'Punggung', 'Barbel'],
  ['Inverted Row', 'Punggung', 'Pull Up Bar'],
  ['Superman Hold', 'Punggung', ''],
  ['Good Morning', 'Punggung', 'Barbel'],

  // ===== KAKI (Legs) =====
  ['Squat', 'Kaki', 'Barbel'],
  ['Front Squat', 'Kaki', 'Barbel'],
  ['Goblet Squat', 'Kaki', 'Dumbbel'],
  ['Bulgarian Split Squat', 'Kaki', 'Dumbbel'],
  ['Leg Press', 'Kaki', 'Mesin Gym'],
  ['Hack Squat', 'Kaki', 'Mesin Gym'],
  ['Romanian Deadlift', 'Kaki', 'Barbel'],
  ['Leg Curl', 'Kaki', 'Mesin Gym'],
  ['Seated Leg Curl', 'Kaki', 'Mesin Gym'],
  ['Lying Leg Curl', 'Kaki', 'Mesin Gym'],
  ['Leg Extension', 'Kaki', 'Mesin Gym'],
  ['Lunges', 'Kaki', 'Dumbbel'],
  ['Reverse Lunge', 'Kaki', 'Dumbbel'],
  ['Walking Lunge', 'Kaki', 'Dumbbel'],
  ['Curtsy Lunge', 'Kaki', 'Dumbbel'],
  ['Side Lunge', 'Kaki', ''],
  ['Step Up', 'Kaki', 'Bench'],
  ['Box Jump', 'Kaki', ''],
  ['Hip Thrust', 'Kaki', 'Barbel'],
  ['Glute Bridge', 'Kaki', ''],
  ['Single Leg Glute Bridge', 'Kaki', ''],
  ['Calf Raise', 'Kaki', 'Barbel'],
  ['Seated Calf Raise', 'Kaki', 'Mesin Gym'],
  ['Donkey Calf Raise', 'Kaki', 'Mesin Gym'],
  ['Sissy Squat', 'Kaki', ''],
  ['Pistol Squat', 'Kaki', ''],
  ['Prowler Push', 'Kaki', ''],
  ['Nordic Curl', 'Kaki', ''],

  // ===== BAHU (Shoulders) =====
  ['Overhead Press', 'Bahu', 'Barbel'],
  ['Seated Dumbbell Press', 'Bahu', 'Dumbbel'],
  ['Arnold Press', 'Bahu', 'Dumbbel'],
  ['Lateral Raise', 'Bahu', 'Dumbbel'],
  ['Cable Lateral Raise', 'Bahu', 'Cable Machine'],
  ['Front Raise', 'Bahu', 'Dumbbel'],
  ['Rear Delt Fly', 'Bahu', 'Dumbbel'],
  ['Reverse Pec Deck', 'Bahu', 'Mesin Gym'],
  ['Face Pull', 'Bahu', 'Cable Machine'],
  ['Shrugs', 'Bahu', 'Barbel'],
  ['Dumbbell Shrugs', 'Bahu', 'Dumbbel'],
  ['Upright Row', 'Bahu', 'Barbel'],
  ['Cable Upright Row', 'Bahu', 'Cable Machine'],
  ['Landmine Press', 'Bahu', 'Barbel'],
  ['Push Press', 'Bahu', 'Barbel'],
  ['Single Arm Cable Raise', 'Bahu', 'Cable Machine'],
  ['Machine Shoulder Press', 'Bahu', 'Mesin Gym'],
  ['Plate Raise', 'Bahu', ''],
  ['Y Raise', 'Bahu', 'Dumbbel'],
  ['T Raise', 'Bahu', 'Dumbbel'],
  ['W Raise', 'Bahu', 'Dumbbel'],
  ['Clean and Press', 'Bahu', 'Barbel'],

  // ===== BICEPS =====
  ['Barbell Curl', 'Biceps', 'Barbel'],
  ['EZ Bar Curl', 'Biceps', 'Barbel'],
  ['Dumbbell Curl', 'Biceps', 'Dumbbel'],
  ['Alternating Dumbbell Curl', 'Biceps', 'Dumbbel'],
  ['Hammer Curl', 'Biceps', 'Dumbbel'],
  ['Cross Body Hammer Curl', 'Biceps', 'Dumbbel'],
  ['Preacher Curl', 'Biceps', 'Barbel'],
  ['Concentration Curl', 'Biceps', 'Dumbbel'],
  ['Cable Curl', 'Biceps', 'Cable Machine'],
  ['Single Arm Cable Curl', 'Biceps', 'Cable Machine'],
  ['Incline Dumbbell Curl', 'Biceps', 'Dumbbel'],
  ['Spider Curl', 'Biceps', 'Dumbbel'],
  ['Bayesian Cable Curl', 'Biceps', 'Cable Machine'],
  ['Reverse Barbell Curl', 'Biceps', 'Barbel'],
  ['Drag Curl', 'Biceps', 'Barbel'],
  ['Zottman Curl', 'Biceps', 'Dumbbel'],
  ['21s Curl', 'Biceps', 'Barbel'],

  // ===== TRICEPS =====
  ['Tricep Pushdown', 'Triceps', 'Cable Machine'],
  ['V-Bar Pushdown', 'Triceps', 'Cable Machine'],
  ['Rope Pushdown', 'Triceps', 'Cable Machine'],
  ['Reverse Grip Pushdown', 'Triceps', 'Cable Machine'],
  ['Skull Crusher', 'Triceps', 'Barbel'],
  ['EZ Bar Skull Crusher', 'Triceps', 'Barbel'],
  ['Close Grip Bench Press', 'Triceps', 'Barbel'],
  ['Overhead Tricep Extension', 'Triceps', 'Dumbbel'],
  ['Cable Overhead Extension', 'Triceps', 'Cable Machine'],
  ['Dumbbell Kickback', 'Triceps', 'Dumbbel'],
  ['Bench Dips', 'Triceps', 'Bench'],
  ['Tricep Machine', 'Triceps', 'Mesin Gym'],
  ['Diamond Push Up', 'Triceps', ''],
  ['French Press', 'Triceps', 'Barbel'],
  ['Tate Press', 'Triceps', 'Dumbbel'],

  // ===== PERUT (Abs) =====
  ['Crunch', 'Perut', ''],
  ['Reverse Crunch', 'Perut', ''],
  ['Leg Raise', 'Perut', ''],
  ['Hanging Leg Raise', 'Perut', 'Pull Up Bar'],
  ['Plank', 'Perut', ''],
  ['Side Plank', 'Perut', ''],
  ['Russian Twist', 'Perut', ''],
  ['Bicycle Crunch', 'Perut', ''],
  ['Cable Crunch', 'Perut', 'Cable Machine'],
  ['Ab Wheel Rollout', 'Perut', ''],
  ['Mountain Climber', 'Perut', ''],
  ['Flutter Kick', 'Perut', ''],
  ['Scissor Kick', 'Perut', ''],
  ['Dead Bug', 'Perut', ''],
  ['V-Up', 'Perut', ''],
  ['Toes to Bar', 'Perut', 'Pull Up Bar'],
  ['Dragon Flag', 'Perut', ''],
  ['Pallof Press', 'Perut', 'Cable Machine'],
  ['Hollow Body Hold', 'Perut', ''],
  ['Decline Crunch', 'Perut', 'Bench'],
  ['Oblique Crunch', 'Perut', ''],
  ['Woodchopper', 'Perut', 'Cable Machine'],
  ['Medicine Ball Slam', 'Perut', 'Medicine Ball'],
  ['Farmer Walk', 'Perut', 'Dumbbel'],
  ['Suitcase Carry', 'Perut', 'Dumbbel'],

  // ===== LENGAN BAWAH (Forearms) =====
  ['Wrist Curl', 'Lengan Bawah', 'Barbel'],
  ['Reverse Wrist Curl', 'Lengan Bawah', 'Barbel'],
  ['Farmer Walk', 'Lengan Bawah', 'Dumbbel'],
  ['Dead Hang', 'Lengan Bawah', 'Pull Up Bar'],
  ['Finger Curl', 'Lengan Bawah', ''],
  ['Plate Pinch', 'Lengan Bawah', ''],
  ['Wrist Roller', 'Lengan Bawah', ''],

  // ===== BETIS (Calves) =====
  ['Standing Calf Raise', 'Betis', 'Barbel'],
  ['Seated Calf Raise', 'Betis', 'Mesin Gym'],
  ['Donkey Calf Raise', 'Betis', 'Mesin Gym'],
  ['Calf Press on Leg Press', 'Betis', 'Mesin Gym'],
  ['Single Leg Calf Raise', 'Betis', ''],
  ['Jump Rope', 'Betis', 'Jump Rope'],
  ['Box Jump', 'Betis', ''],

  // ===== GLUTES =====
  ['Hip Thrust', 'Glutes', 'Barbel'],
  ['Glute Bridge', 'Glutes', ''],
  ['Single Leg Glute Bridge', 'Glutes', ''],
  ['Cable Pull Through', 'Glutes', 'Cable Machine'],
  ['Donkey Kick', 'Glutes', ''],
  ['Fire Hydrant', 'Glutes', ''],
  ['Clamshell', 'Glutes', ''],
  ['Step Up', 'Glutes', 'Bench'],
  ['Kickback Machine', 'Glutes', 'Mesin Gym'],

  // ===== FULL BODY =====
  ['Deadlift', 'Full Body', 'Barbel'],
  ['Clean and Jerk', 'Full Body', 'Barbel'],
  ['Snatch', 'Full Body', 'Barbel'],
  ['Power Clean', 'Full Body', 'Barbel'],
  ['Clean', 'Full Body', 'Barbel'],
  ['Jerk', 'Full Body', 'Barbel'],
  ['Burpee', 'Full Body', ''],
  ['Kettlebell Swing', 'Full Body', 'Kettlebell'],
  ['Turkish Get Up', 'Full Body', 'Kettlebell'],
  ['Thruster', 'Full Body', 'Barbel'],
  ['Wall Ball', 'Full Body', 'Medicine Ball'],
  ['Battle Rope', 'Full Body', ''],
  ['Sled Push', 'Full Body', ''],
  ['Sled Pull', 'Full Body', ''],
  ['Farmer Walk', 'Full Body', 'Dumbbel'],
  ['Bear Crawl', 'Full Body', ''],
  ['Man Maker', 'Full Body', 'Dumbbel'],
  ['Dumbbell Snatch', 'Full Body', 'Dumbbel'],
  ['Medicine Ball Slam', 'Full Body', 'Medicine Ball'],
  ['Tire Flip', 'Full Body', ''],
  ['Rowing Machine', 'Full Body', 'Mesin Gym'],

  // ===== KARDIO (Cardio) =====
  ['Treadmill Run', 'Kardio', 'Mesin Gym'],
  ['Treadmill Walk', 'Kardio', 'Mesin Gym'],
  ['Stationary Bike', 'Kardio', 'Mesin Gym'],
  ['Assault Bike', 'Kardio', 'Mesin Gym'],
  ['Rowing Machine', 'Kardio', 'Mesin Gym'],
  ['Ski Erg', 'Kardio', 'Mesin Gym'],
  ['Jump Rope', 'Kardio', 'Jump Rope'],
  ['Burpee', 'Kardio', ''],
  ['Mountain Climber', 'Kardio', ''],
  ['Stair Climber', 'Kardio', 'Mesin Gym'],
  ['Elliptical', 'Kardio', 'Mesin Gym'],
  ['Swimming', 'Kardio', ''],
  ['Jumping Jack', 'Kardio', ''],
  ['High Knees', 'Kardio', ''],
  ['Box Jump', 'Kardio', ''],
  ['Battle Rope', 'Kardio', ''],
  ['Kettlebell Swing', 'Kardio', 'Kettlebell'],
  ['Sprint', 'Kardio', ''],
  ['Jogging', 'Kardio', ''],
  ['Hiking', 'Kardio', ''],

  // ===== CALISTHENICS =====
  ['Pull Up', 'Calisthenics', 'Pull Up Bar'],
  ['Chin Up', 'Calisthenics', 'Pull Up Bar'],
  ['Push Up', 'Calisthenics', ''],
  ['Dips', 'Calisthenics', ''],
  ['Squat', 'Calisthenics', ''],
  ['Lunge', 'Calisthenics', ''],
  ['Plank', 'Calisthenics', ''],
  ['Handstand Push Up', 'Calisthenics', ''],
  ['Pistol Squat', 'Calisthenics', ''],
  ['Muscle Up', 'Calisthenics', 'Pull Up Bar'],
  ['Ring Row', 'Calisthenics', 'TRX'],
  ['Ring Dip', 'Calisthenics', 'TRX'],
  ['Archer Push Up', 'Calisthenics', ''],
  ['Pike Push Up', 'Calisthenics', ''],
  ['L-Sit', 'Calisthenics', ''],
  ['Human Flag', 'Calisthenics', 'Pull Up Bar'],

  // ===== TRAPS =====
  ['Barbell Shrug', 'Trap', 'Barbel'],
  ['Dumbbell Shrug', 'Trap', 'Dumbbel'],
  ['Cable Shrug', 'Trap', 'Cable Machine'],
  ['Smith Machine Shrug', 'Trap', 'Mesin Gym'],
  ['Trap Bar Shrug', 'Trap', 'Barbel'],
  ['Overhead Shrug', 'Trap', 'Dumbbel'],
  ['Behind the Back Shrug', 'Trap', 'Barbel'],
  ['Upright Row', 'Trap', 'Barbel'],
  ['Farmer Walk', 'Trap', 'Dumbbel'],
  ['Rack Pull', 'Trap', 'Barbel'],
  ['Clean Pull', 'Trap', 'Barbel'],
  ['Snatch Pull', 'Trap', 'Barbel'],
  ['Face Pull', 'Trap', 'Cable Machine'],
  ['Power Shrug', 'Trap', 'Barbel'],
  ['Single Arm Dumbbell Shrug', 'Trap', 'Dumbbel'],

  // ===== ADDUCTOR / ABDUCTOR =====
  ['Seated Hip Adduction', 'Adductor/Abductor', 'Mesin Gym'],
  ['Seated Hip Abduction', 'Adductor/Abductor', 'Mesin Gym'],
  ['Standing Hip Adduction', 'Adductor/Abductor', 'Cable Machine'],
  ['Standing Hip Abduction', 'Adductor/Abductor', 'Cable Machine'],
  ['Cable Hip Adduction', 'Adductor/Abductor', 'Cable Machine'],
  ['Cable Hip Abduction', 'Adductor/Abductor', 'Cable Machine'],
  ['Side Lying Leg Raise', 'Adductor/Abductor', ''],
  ['Clamshell', 'Adductor/Abductor', ''],
  ['Banded Side Step', 'Adductor/Abductor', 'Resistance Band'],
  ['Lateral Lunge', 'Adductor/Abductor', ''],
  ['Cossack Squat', 'Adductor/Abductor', ''],
  ['Sumo Squat', 'Adductor/Abductor', ''],
  ['Sumo Deadlift', 'Adductor/Abductor', 'Barbel'],
  ['Frog Pump', 'Adductor/Abductor', ''],
  ['Adductor Machine', 'Adductor/Abductor', 'Mesin Gym'],
  ['Abductor Machine', 'Adductor/Abductor', 'Mesin Gym'],

  // ===== LOWER BACK =====
  ['Back Extension', 'Punggung Bawah', ''],
  ['Hyperextension', 'Punggung Bawah', ''],
  ['Reverse Hyperextension', 'Punggung Bawah', ''],
  ['Good Morning', 'Punggung Bawah', 'Barbel'],
  ['Deadlift', 'Punggung Bawah', 'Barbel'],
  ['Romanian Deadlift', 'Punggung Bawah', 'Barbel'],
  ['Supermans', 'Punggung Bawah', ''],
  ['Bird Dog', 'Punggung Bawah', ''],
  ['Cat Cow', 'Punggung Bawah', ''],
  ['Seated Forward Fold', 'Punggung Bawah', ''],
  ['Child Pose', 'Punggung Bawah', ''],
  ['Cobra Stretch', 'Punggung Bawah', ''],
  ['Jefferson Curl', 'Punggung Bawah', 'Barbel'],
  ['Kettlebell Swing', 'Punggung Bawah', 'Kettlebell'],
  ['Trap Bar Deadlift', 'Punggung Bawah', 'Barbel'],
];

const insertMany = db.transaction(() => {
  for (const [name, category, equipment] of defaultExercises) {
    seedExercises.run(name, category, equipment || '');
  }
});

insertMany();

// Update equipment for existing exercises that were seeded before equipment column existed
const equipStale = db.prepare("SELECT COUNT(*) as c FROM exercises WHERE equipment = ''").get();
if (equipStale.c > 10) {
  const updateEquip = db.prepare('UPDATE exercises SET equipment = ? WHERE name = ? AND category = ?');
  const updateAll = db.transaction(() => {
    for (const [name, category, equipment] of defaultExercises) {
      if (equipment) updateEquip.run(equipment, name, category);
    }
  });
  updateAll();
}

export default db;
