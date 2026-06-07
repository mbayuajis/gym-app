import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// === EXERCISES ===

app.get('/api/exercises', (req, res) => {
  const exercises = db.prepare('SELECT * FROM exercises ORDER BY name').all();
  res.json(exercises.map(e => ({ ...e, sub_muscles: JSON.parse(e.sub_muscles) })));
});

app.post('/api/exercises', (req, res) => {
  const { name, category, sub_muscles, gif_url, equipment } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Nama exercise wajib diisi' });
  }
  try {
    const stmt = db.prepare('INSERT INTO exercises (name, category, sub_muscles, gif_url, equipment) VALUES (?, ?, ?, ?, ?)');
    const sm = sub_muscles ? JSON.stringify(sub_muscles) : '[]';
    const result = stmt.run(name.trim(), category?.trim() || '', sm, gif_url || '', equipment || '');
    const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(result.lastInsertRowid);
    if (exercise) exercise.sub_muscles = JSON.parse(exercise.sub_muscles);
    res.status(201).json(exercise);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(400).json({ error: 'Exercise sudah ada' });
    }
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/exercises/:id', (req, res) => {
  const { sub_muscles, gif_url } = req.body;
  try {
    const sm = sub_muscles ? JSON.stringify(sub_muscles) : undefined;
    const params = [];
    const sets = [];
    if (sm !== undefined) { sets.push('sub_muscles = ?'); params.push(sm); }
    if (gif_url !== undefined) { sets.push('gif_url = ?'); params.push(gif_url); }
    if (sets.length > 0) {
      params.push(req.params.id);
      db.prepare(`UPDATE exercises SET ${sets.join(', ')} WHERE id = ?`).run(...params);
    }
    const exercise = db.prepare('SELECT * FROM exercises WHERE id = ?').get(req.params.id);
    if (exercise) exercise.sub_muscles = JSON.parse(exercise.sub_muscles);
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/exercises/:id', (req, res) => {
  db.prepare('DELETE FROM exercises WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// === WORKOUTS ===

app.get('/api/workouts', (req, res) => {
  const workouts = db.prepare(`
    SELECT w.*,
      COALESCE(
        json_group_array(
          DISTINCT json_object(
            'id', we.id,
            'exercise_id', we.exercise_id,
            'name', e.name,
            'category', e.category,
            'sub_muscles', e.sub_muscles,
            'sort_order', we.sort_order,
            'sets', (
              SELECT json_group_array(
                json_object('id', s.id, 'reps', s.reps, 'weight', s.weight, 'sort_order', s.sort_order)
                ORDER BY s.sort_order
              ) FROM sets s WHERE s.workout_exercise_id = we.id
            )
          )
        ), '[]'
      ) as exercises
    FROM workouts w
    LEFT JOIN workout_exercises we ON we.workout_id = w.id
    LEFT JOIN exercises e ON e.id = we.exercise_id
    GROUP BY w.id
    ORDER BY w.date DESC, w.id DESC
  `).all();

  res.json(workouts.map(w => ({
    ...w,
    exercises: JSON.parse(w.exercises).filter(e => e.id).map(e => ({
      ...e,
      sub_muscles: JSON.parse(e.sub_muscles || '[]')
    }))
  })));
});

app.post('/api/workouts', (req, res) => {
  const { date, notes, exercises } = req.body;
  if (!date) {
    return res.status(400).json({ error: 'Tanggal wajib diisi' });
  }

  const insertWorkout = db.prepare('INSERT INTO workouts (date, notes) VALUES (?, ?)');
  const insertWorkoutExercise = db.prepare(
    'INSERT INTO workout_exercises (workout_id, exercise_id, sort_order) VALUES (?, ?, ?)'
  );
  const insertSet = db.prepare(
    'INSERT INTO sets (workout_exercise_id, reps, weight, sort_order) VALUES (?, ?, ?, ?)'
  );

  const transaction = db.transaction(() => {
    const { lastInsertRowid: workoutId } = insertWorkout.run(date, notes || '');

    if (exercises) {
      exercises.forEach((ex, exIdx) => {
        const { lastInsertRowid: weId } = insertWorkoutExercise.run(workoutId, ex.exercise_id, exIdx);
        if (ex.sets) {
          ex.sets.forEach((set, setIdx) => {
            insertSet.run(weId, set.reps || 0, set.weight || 0, setIdx);
          });
        }
      });
    }

    return workoutId;
  });

  const workoutId = transaction();

  const workout = db.prepare(`
    SELECT w.*,
      COALESCE(
        json_group_array(
          DISTINCT json_object(
            'id', we.id,
            'exercise_id', we.exercise_id,
            'name', e.name,
            'category', e.category,
            'sub_muscles', e.sub_muscles,
            'sort_order', we.sort_order,
            'sets', (
              SELECT json_group_array(
                json_object('id', s.id, 'reps', s.reps, 'weight', s.weight, 'sort_order', s.sort_order)
                ORDER BY s.sort_order
              ) FROM sets s WHERE s.workout_exercise_id = we.id
            )
          )
        ), '[]'
      ) as exercises
    FROM workouts w
    LEFT JOIN workout_exercises we ON we.workout_id = w.id
    LEFT JOIN exercises e ON e.id = we.exercise_id
    WHERE w.id = ?
    GROUP BY w.id
  `).get(workoutId);

  res.status(201).json({
    ...workout,
    exercises: JSON.parse(workout.exercises).filter(e => e.id).map(e => ({
      ...e,
      sub_muscles: JSON.parse(e.sub_muscles || '[]')
    }))
  });
});

app.delete('/api/workouts/:id', (req, res) => {
  db.prepare('DELETE FROM workouts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// === STATISTICS ===

app.get('/api/stats', (req, res) => {
  // Workouts per week (last 8 weeks)
  const weeklyWorkouts = db.prepare(`
    SELECT date(date, 'weekday 1', '-7 days') as week_start,
      COUNT(*) as count
    FROM workouts
    WHERE date >= date('now', '-56 days')
    GROUP BY week_start
    ORDER BY week_start
  `).all();

  // Total volume per workout (last 10)
  const workoutVolumes = db.prepare(`
    SELECT w.id, w.date,
      COALESCE(SUM(s.reps * s.weight), 0) as total_volume,
      COUNT(DISTINCT we.id) as exercise_count,
      COUNT(s.id) as set_count
    FROM workouts w
    LEFT JOIN workout_exercises we ON we.workout_id = w.id
    LEFT JOIN sets s ON s.workout_exercise_id = we.id
    GROUP BY w.id
    ORDER BY w.date ASC
    LIMIT 10
  `).all();

  // Category distribution
  const categoryDist = db.prepare(`
    SELECT e.category, COUNT(*) as count
    FROM workout_exercises we
    JOIN exercises e ON e.id = we.exercise_id
    GROUP BY e.category
    ORDER BY count DESC
  `).all();

  res.json({
    weeklyWorkouts,
    workoutVolumes,
    categoryDist,
  });
});

// === FITNESS PROFILE ===

app.get('/api/profile', (req, res) => {
  const profile = db.prepare('SELECT * FROM fitness_profile WHERE id = 1').get();
  if (profile) {
    profile.equipment = JSON.parse(profile.equipment || '[]');
  }
  res.json(profile || {});
});

app.put('/api/profile', (req, res) => {
  const { name, age, gender, height, weight, target_weight, level, goal, frequency, location, equipment } = req.body;
  const eq = equipment ? JSON.stringify(equipment) : '[]';
  db.prepare(`
    UPDATE fitness_profile SET
      name = ?, age = ?, gender = ?, height = ?, weight = ?,
      target_weight = ?, level = ?, goal = ?, frequency = ?,
      location = ?, equipment = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).run(
    name || '', age || 0, gender || '', height || 0, weight || 0,
    target_weight || 0, level || '', goal || '', frequency || 0,
    location || '', eq
  );
  const profile = db.prepare('SELECT * FROM fitness_profile WHERE id = 1').get();
  if (profile) profile.equipment = JSON.parse(profile.equipment || '[]');
  res.json(profile);
});

app.post('/api/onboarding', (req, res) => {
  const { name, age, gender, height, weight, target_weight, level, goal, frequency, location, equipment } = req.body;
  const eq = equipment ? JSON.stringify(equipment) : '[]';
  db.prepare(`
    UPDATE fitness_profile SET
      name = ?, age = ?, gender = ?, height = ?, weight = ?,
      target_weight = ?, level = ?, goal = ?, frequency = ?,
      location = ?, equipment = ?, onboarding_completed = 1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
  `).run(
    name || '', age || 0, gender || '', height || 0, weight || 0,
    target_weight || 0, level || '', goal || '', frequency || 0,
    location || '', eq
  );
  const profile = db.prepare('SELECT * FROM fitness_profile WHERE id = 1').get();
  if (profile) profile.equipment = JSON.parse(profile.equipment || '[]');
  res.json(profile);
});

// === GOALS ===

app.get('/api/goals', (req, res) => {
  const goals = db.prepare('SELECT * FROM goals ORDER BY created_at DESC').all();
  res.json(goals);
});

app.post('/api/goals', (req, res) => {
  const { type, target_value, current_value, start_date, target_date } = req.body;
  if (!type) return res.status(400).json({ error: 'Tipe goal wajib diisi' });
  const stmt = db.prepare(
    'INSERT INTO goals (type, target_value, current_value, start_date, target_date) VALUES (?, ?, ?, ?, ?)'
  );
  const result = stmt.run(type, target_value || 0, current_value || 0, start_date || '', target_date || '');
  const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(goal);
});

app.patch('/api/goals/:id', (req, res) => {
  const { target_value, current_value, target_date, status } = req.body;
  const updates = [];
  const params = [];
  if (target_value !== undefined) { updates.push('target_value = ?'); params.push(target_value); }
  if (current_value !== undefined) { updates.push('current_value = ?'); params.push(current_value); }
  if (target_date !== undefined) { updates.push('target_date = ?'); params.push(target_date); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (updates.length > 0) {
    params.push(req.params.id);
    db.prepare(`UPDATE goals SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }
  const goal = db.prepare('SELECT * FROM goals WHERE id = ?').get(req.params.id);
  res.json(goal);
});

app.delete('/api/goals/:id', (req, res) => {
  db.prepare('DELETE FROM goals WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// === PROGRESS LOGS ===

app.get('/api/progress', (req, res) => {
  const logs = db.prepare('SELECT * FROM progress_logs ORDER BY date ASC').all();
  res.json(logs);
});

app.post('/api/progress', (req, res) => {
  const { date, weight, chest, waist, arm, thigh, body_fat, notes } = req.body;
  if (!date) return res.status(400).json({ error: 'Tanggal wajib diisi' });
  const stmt = db.prepare(`
    INSERT INTO progress_logs (date, weight, chest, waist, arm, thigh, body_fat, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    date, weight || 0, chest || 0, waist || 0,
    arm || 0, thigh || 0, body_fat || 0, notes || ''
  );
  const log = db.prepare('SELECT * FROM progress_logs WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(log);
});

app.delete('/api/progress/:id', (req, res) => {
  db.prepare('DELETE FROM progress_logs WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// === PERSONAL RECORDS (computed from sets) ===

app.get('/api/personal-records', (req, res) => {
  // Best weight per exercise
  const bestWeight = db.prepare(`
    SELECT e.id as exercise_id, e.name as exercise_name, e.category,
      MAX(s.weight) as best_weight,
      s.reps as best_reps,
      w.date as achieved_date
    FROM sets s
    JOIN workout_exercises we ON we.id = s.workout_exercise_id
    JOIN exercises e ON e.id = we.exercise_id
    JOIN workouts w ON w.id = we.workout_id
    WHERE s.weight > 0
    GROUP BY e.id
    ORDER BY best_weight DESC
  `).all();

  // Best volume (weight * reps) per exercise
  const bestVolume = db.prepare(`
    SELECT e.id as exercise_id, e.name as exercise_name, e.category,
      MAX(s.reps * s.weight) as best_volume,
      w.date as achieved_date
    FROM sets s
    JOIN workout_exercises we ON we.id = s.workout_exercise_id
    JOIN exercises e ON e.id = we.exercise_id
    JOIN workouts w ON w.id = we.workout_id
    WHERE s.weight > 0 AND s.reps > 0
    GROUP BY e.id
    ORDER BY best_volume DESC
  `).all();

  // Max reps with any weight per exercise
  const bestReps = db.prepare(`
    SELECT e.id as exercise_id, e.name as exercise_name, e.category,
      MAX(s.reps) as best_reps,
      s.weight as reps_weight,
      w.date as achieved_date
    FROM sets s
    JOIN workout_exercises we ON we.id = s.workout_exercise_id
    JOIN exercises e ON e.id = we.exercise_id
    JOIN workouts w ON w.id = we.workout_id
    WHERE s.reps > 0
    GROUP BY e.id
    ORDER BY best_reps DESC
  `).all();

  res.json({ bestWeight, bestVolume, bestReps });
});

// === REMINDERS ===

app.get('/api/reminders', (req, res) => {
  const reminders = db.prepare('SELECT * FROM reminders ORDER BY day, time').all();
  res.json(reminders);
});

app.post('/api/reminders', (req, res) => {
  const { type, day, time, enabled } = req.body;
  if (!day || !time) return res.status(400).json({ error: 'Hari dan jam wajib diisi' });
  const result = db.prepare(
    'INSERT INTO reminders (type, day, time, enabled) VALUES (?, ?, ?, ?)'
  ).run(type || 'workout', day, time, enabled !== undefined ? (enabled ? 1 : 0) : 1);
  const reminder = db.prepare('SELECT * FROM reminders WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(reminder);
});

app.patch('/api/reminders/:id', (req, res) => {
  const { day, time, enabled, type } = req.body;
  const updates = []; const params = [];
  if (day !== undefined) { updates.push('day = ?'); params.push(day); }
  if (time !== undefined) { updates.push('time = ?'); params.push(time); }
  if (enabled !== undefined) { updates.push('enabled = ?'); params.push(enabled ? 1 : 0); }
  if (type !== undefined) { updates.push('type = ?'); params.push(type); }
  if (updates.length > 0) {
    params.push(req.params.id);
    db.prepare(`UPDATE reminders SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  }
  const reminder = db.prepare('SELECT * FROM reminders WHERE id = ?').get(req.params.id);
  res.json(reminder);
});

app.delete('/api/reminders/:id', (req, res) => {
  db.prepare('DELETE FROM reminders WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// === WORKOUT PLANS ===

app.get('/api/workout-plans', (req, res) => {
  const plans = db.prepare(`
    SELECT wp.*,
      COALESCE(
        json_group_array(
          json_object(
            'id', wpe.id,
            'exercise_id', wpe.exercise_id,
            'name', e.name,
            'category', e.category,
            'target_sets', wpe.target_sets,
            'target_reps', wpe.target_reps,
            'target_weight', wpe.target_weight,
            'rest_time', wpe.rest_time,
            'sort_order', wpe.sort_order
          )
          ORDER BY wpe.sort_order
        ), '[]'
      ) as exercises
    FROM workout_plans wp
    LEFT JOIN workout_plan_exercises wpe ON wpe.plan_id = wp.id
    LEFT JOIN exercises e ON e.id = wpe.exercise_id
    GROUP BY wp.id
    ORDER BY wp.sort_order, wp.day
  `).all();

  const parsed = plans.map(p => ({
    ...p,
    exercises: JSON.parse(p.exercises).filter(e => e.exercise_id)
  }));

  // Group by day
  const grouped = {};
  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  for (const day of DAYS) {
    const dayPlans = parsed.filter(p => p.day === day);
    if (dayPlans.length > 0) grouped[day] = dayPlans;
  }
  res.json({ plans: parsed, grouped });
});

app.post('/api/workout-plans', (req, res) => {
  const { name, day, estimated_duration, notes, exercises } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Nama plan wajib diisi' });
  if (!day) return res.status(400).json({ error: 'Hari wajib diisi' });

  const txn = db.transaction(() => {
    const planResult = db.prepare(
      'INSERT INTO workout_plans (name, day, estimated_duration, notes) VALUES (?, ?, ?, ?)'
    ).run(name.trim(), day, estimated_duration || 0, notes || '');

    const planId = planResult.lastInsertRowid;

    if (exercises && exercises.length > 0) {
      const insertEx = db.prepare(
        'INSERT INTO workout_plan_exercises (plan_id, exercise_id, target_sets, target_reps, target_weight, rest_time, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      exercises.forEach((ex, i) => {
        insertEx.run(planId, ex.exercise_id, ex.target_sets || 3, ex.target_reps || 10, ex.target_weight || 0, ex.rest_time || 90, i);
      });
    }

    return planId;
  });

  const planId = txn();
  const plan = db.prepare('SELECT * FROM workout_plans WHERE id = ?').get(planId);
  res.status(201).json(plan);
});

app.patch('/api/workout-plans/:id', (req, res) => {
  const { name, day, estimated_duration, notes, exercises } = req.body;

  const txn = db.transaction(() => {
    if (name || day || estimated_duration !== undefined || notes !== undefined) {
      const updates = []; const params = [];
      if (name !== undefined) { updates.push('name = ?'); params.push(name); }
      if (day !== undefined) { updates.push('day = ?'); params.push(day); }
      if (estimated_duration !== undefined) { updates.push('estimated_duration = ?'); params.push(estimated_duration); }
      if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }
      if (updates.length > 0) {
        params.push(req.params.id);
        db.prepare(`UPDATE workout_plans SET ${updates.join(', ')} WHERE id = ?`).run(...params);
      }
    }

    if (exercises !== undefined) {
      db.prepare('DELETE FROM workout_plan_exercises WHERE plan_id = ?').run(req.params.id);
      const insertEx = db.prepare(
        'INSERT INTO workout_plan_exercises (plan_id, exercise_id, target_sets, target_reps, target_weight, rest_time, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
      );
      exercises.forEach((ex, i) => {
        insertEx.run(req.params.id, ex.exercise_id, ex.target_sets || 3, ex.target_reps || 10, ex.target_weight || 0, ex.rest_time || 90, i);
      });
    }
  });

  txn();
  const plan = db.prepare('SELECT * FROM workout_plans WHERE id = ?').get(req.params.id);
  res.json(plan);
});

app.delete('/api/workout-plans/:id', (req, res) => {
  db.prepare('DELETE FROM workout_plans WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// === WORKOUT PLAN SUGGESTION ===

const WORKOUT_TEMPLATES = {
  turun_berat: {
    label: 'Turun Berat Badan',
    days: {
      2: [
        {
          name: 'Full Body Circuit A',
          exercises: [
            { name: 'Jumping Jack', sets: 3, reps: 20, weight: 0, rest: 30 },
            { name: 'Squat', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Push Up', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Mountain Climber', sets: 3, reps: 20, weight: 0, rest: 30 },
            { name: 'Plank', sets: 3, reps: 12, weight: 0, rest: 30 },
          ],
          duration: 30,
          notes: 'Lakukan circuit: 3 ronde, rest 30 detik antar exercise. Fokus pada kecepatan dan konsistensi.',
        },
        {
          name: 'Full Body Circuit B',
          exercises: [
            { name: 'Burpee', sets: 3, reps: 10, weight: 0, rest: 30 },
            { name: 'Lunge', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Dumbbell Row', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Bicycle Crunch', sets: 3, reps: 20, weight: 0, rest: 30 },
            { name: 'Jump Rope', sets: 3, reps: 60, weight: 0, rest: 30 },
          ],
          duration: 30,
          notes: 'Lakukan circuit: 3 ronde. Jaga heart rate tetap tinggi untuk pembakaran kalori maksimal.',
        },
      ],
      3: [
        {
          name: 'Full Body Circuit A',
          exercises: [
            { name: 'Jumping Jack', sets: 3, reps: 20, weight: 0, rest: 30 },
            { name: 'Squat', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Push Up', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Mountain Climber', sets: 3, reps: 20, weight: 0, rest: 30 },
            { name: 'Plank', sets: 3, reps: 12, weight: 0, rest: 30 },
          ],
          duration: 30,
          notes: 'Circuit: 3 ronde, rest 30 detik.',
        },
        {
          name: 'Full Body Circuit B',
          exercises: [
            { name: 'Burpee', sets: 3, reps: 10, weight: 0, rest: 30 },
            { name: 'Lunge', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Dumbbell Row', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Bicycle Crunch', sets: 3, reps: 20, weight: 0, rest: 30 },
            { name: 'Jump Rope', sets: 3, reps: 60, weight: 0, rest: 30 },
          ],
          duration: 30,
          notes: 'Circuit: 3 ronde.',
        },
        {
          name: 'Kardio & Core',
          exercises: [
            { name: 'Treadmill Run', sets: 1, reps: 20, weight: 0, rest: 60 },
            { name: 'Russian Twist', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Leg Raise', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Plank', sets: 3, reps: 45, weight: 0, rest: 30 },
            { name: 'Mountain Climber', sets: 3, reps: 20, weight: 0, rest: 30 },
          ],
          duration: 25,
          notes: 'Fokus pada kardio dan penguatan core.',
        },
      ],
      4: [
        {
          name: 'Upper Body Circuit',
          exercises: [
            { name: 'Push Up', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Dumbbell Row', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Overhead Press', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Dumbbell Curl', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 0, rest: 30 },
          ],
          duration: 30,
          notes: 'Circuit upper body, rest 30 detik antar set.',
        },
        {
          name: 'Lower Body Circuit',
          exercises: [
            { name: 'Squat', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Lunge', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Romanian Deadlift', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Calf Raise', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Glute Bridge', sets: 3, reps: 15, weight: 0, rest: 30 },
          ],
          duration: 30,
          notes: 'Circuit lower body.',
        },
        {
          name: 'Full Body Circuit A',
          exercises: [
            { name: 'Jumping Jack', sets: 3, reps: 20, weight: 0, rest: 30 },
            { name: 'Squat', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Push Up', sets: 3, reps: 12, weight: 0, rest: 30 },
            { name: 'Mountain Climber', sets: 3, reps: 20, weight: 0, rest: 30 },
            { name: 'Plank', sets: 3, reps: 12, weight: 0, rest: 30 },
          ],
          duration: 30,
          notes: 'Circuit: 3 ronde.',
        },
        {
          name: 'Kardio & Core',
          exercises: [
            { name: 'Treadmill Run', sets: 1, reps: 20, weight: 0, rest: 60 },
            { name: 'Russian Twist', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Leg Raise', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Plank', sets: 3, reps: 45, weight: 0, rest: 30 },
          ],
          duration: 25,
          notes: 'Kardio + core.',
        },
      ],
    },
  },
  naik_otot: {
    label: 'Menambah Massa Otot',
    days: {
      2: [
        {
          name: 'Upper Body',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: 10, weight: 0, rest: 90 },
            { name: 'Dumbbell Row', sets: 4, reps: 10, weight: 0, rest: 90 },
            { name: 'Overhead Press', sets: 3, reps: 10, weight: 0, rest: 90 },
            { name: 'Barbell Curl', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 0, rest: 60 },
          ],
          duration: 45,
          notes: 'Fokus pada progressive overload. Tambah beban jika bisa mencapai reps dengan mudah.',
        },
        {
          name: 'Lower Body',
          exercises: [
            { name: 'Squat', sets: 4, reps: 10, weight: 0, rest: 90 },
            { name: 'Romanian Deadlift', sets: 4, reps: 10, weight: 0, rest: 90 },
            { name: 'Leg Press', sets: 3, reps: 12, weight: 0, rest: 90 },
            { name: 'Leg Curl', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Calf Raise', sets: 3, reps: 15, weight: 0, rest: 60 },
          ],
          duration: 45,
          notes: 'Lower body hypertrophy.',
        },
      ],
      3: [
        {
          name: 'Push Day',
          exercises: [
            { name: 'Bench Press', sets: 4, reps: 10, weight: 0, rest: 90 },
            { name: 'Incline Dumbbell Press', sets: 3, reps: 10, weight: 0, rest: 90 },
            { name: 'Overhead Press', sets: 3, reps: 10, weight: 0, rest: 90 },
            { name: 'Lateral Raise', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Tricep Pushdown', sets: 3, reps: 12, weight: 0, rest: 60 },
          ],
          duration: 45,
          notes: 'Push: Chest, Shoulders, Triceps.',
        },
        {
          name: 'Pull Day',
          exercises: [
            { name: 'Pull Up', sets: 4, reps: 8, weight: 0, rest: 90 },
            { name: 'Barbell Row', sets: 4, reps: 10, weight: 0, rest: 90 },
            { name: 'Face Pull', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Barbell Curl', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Hammer Curl', sets: 3, reps: 12, weight: 0, rest: 60 },
          ],
          duration: 45,
          notes: 'Pull: Back, Biceps, Rear Delts.',
        },
        {
          name: 'Leg Day',
          exercises: [
            { name: 'Squat', sets: 4, reps: 10, weight: 0, rest: 120 },
            { name: 'Romanian Deadlift', sets: 4, reps: 10, weight: 0, rest: 90 },
            { name: 'Leg Press', sets: 3, reps: 12, weight: 0, rest: 90 },
            { name: 'Leg Curl', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Calf Raise', sets: 3, reps: 15, weight: 0, rest: 60 },
          ],
          duration: 50,
          notes: 'Legs: Quads, Hamstrings, Calves.',
        },
      ],
    },
  },
  naik_kekuatan: {
    label: 'Meningkatkan Kekuatan',
    days: {
      2: [
        {
          name: 'Full Body Strength A',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5, weight: 0, rest: 180 },
            { name: 'Bench Press', sets: 5, reps: 5, weight: 0, rest: 180 },
            { name: 'Barbell Row', sets: 4, reps: 6, weight: 0, rest: 150 },
            { name: 'Plank', sets: 3, reps: 30, weight: 0, rest: 60 },
          ],
          duration: 50,
          notes: 'StrongLifts 5×5 style. Fokus pada beban berat dan teknik yang baik.',
        },
        {
          name: 'Full Body Strength B',
          exercises: [
            { name: 'Deadlift', sets: 5, reps: 5, weight: 0, rest: 180 },
            { name: 'Overhead Press', sets: 5, reps: 5, weight: 0, rest: 180 },
            { name: 'Pull Up', sets: 4, reps: 6, weight: 0, rest: 150 },
            { name: 'Farmer Walk', sets: 3, reps: 30, weight: 0, rest: 60 },
          ],
          duration: 50,
          notes: 'StrongLifts 5×5 style. Tambah 2.5kg setiap sesi.',
        },
      ],
      3: [
        {
          name: 'Squat Day',
          exercises: [
            { name: 'Squat', sets: 5, reps: 5, weight: 0, rest: 180 },
            { name: 'Bench Press', sets: 5, reps: 5, weight: 0, rest: 180 },
            { name: 'Barbell Row', sets: 4, reps: 6, weight: 0, rest: 150 },
            { name: 'Plank', sets: 3, reps: 30, weight: 0, rest: 60 },
          ],
          duration: 50,
          notes: 'Squat 5×5, Bench 5×5, Row 4×6.',
        },
        {
          name: 'Deadlift Day',
          exercises: [
            { name: 'Deadlift', sets: 5, reps: 5, weight: 0, rest: 180 },
            { name: 'Overhead Press', sets: 5, reps: 5, weight: 0, rest: 180 },
            { name: 'Pull Up', sets: 4, reps: 6, weight: 0, rest: 150 },
          ],
          duration: 50,
          notes: 'Deadlift 5×5, OHP 5×5, Pull Up 4×6.',
        },
        {
          name: 'Bench Day',
          exercises: [
            { name: 'Bench Press', sets: 5, reps: 5, weight: 0, rest: 180 },
            { name: 'Squat', sets: 4, reps: 6, weight: 0, rest: 150 },
            { name: 'Barbell Row', sets: 4, reps: 8, weight: 0, rest: 120 },
          ],
          duration: 45,
          notes: 'Bench 5×5, Squat 4×6, Row 4×8.',
        },
      ],
    },
  },
  jaga_kebugaran: {
    label: 'Menjaga Kebugaran',
    days: {
      2: [
        {
          name: 'Full Body A',
          exercises: [
            { name: 'Squat', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Push Up', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Dumbbell Row', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Plank', sets: 3, reps: 30, weight: 0, rest: 30 },
          ],
          duration: 30,
          notes: 'Full body maintenance. Moderate intensity.',
        },
        {
          name: 'Full Body B',
          exercises: [
            { name: 'Deadlift', sets: 3, reps: 10, weight: 0, rest: 90 },
            { name: 'Overhead Press', sets: 3, reps: 10, weight: 0, rest: 60 },
            { name: 'Pull Up', sets: 3, reps: 8, weight: 0, rest: 60 },
            { name: 'Lunge', sets: 3, reps: 10, weight: 0, rest: 60 },
          ],
          duration: 30,
          notes: 'Full body maintenance.',
        },
      ],
      3: [
        {
          name: 'Full Body A',
          exercises: [
            { name: 'Squat', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Push Up', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Dumbbell Row', sets: 3, reps: 12, weight: 0, rest: 60 },
            { name: 'Plank', sets: 3, reps: 30, weight: 0, rest: 30 },
          ],
          duration: 30,
          notes: 'Full body maintenance.',
        },
        {
          name: 'Full Body B',
          exercises: [
            { name: 'Deadlift', sets: 3, reps: 10, weight: 0, rest: 90 },
            { name: 'Overhead Press', sets: 3, reps: 10, weight: 0, rest: 60 },
            { name: 'Pull Up', sets: 3, reps: 8, weight: 0, rest: 60 },
            { name: 'Lunge', sets: 3, reps: 10, weight: 0, rest: 60 },
          ],
          duration: 30,
          notes: 'Full body maintenance.',
        },
        {
          name: 'Active Recovery',
          exercises: [
            { name: 'Treadmill Walk', sets: 1, reps: 30, weight: 0, rest: 0 },
            { name: 'Mountain Climber', sets: 3, reps: 15, weight: 0, rest: 30 },
            { name: 'Plank', sets: 3, reps: 30, weight: 0, rest: 30 },
            { name: 'Glute Bridge', sets: 3, reps: 15, weight: 0, rest: 30 },
          ],
          duration: 25,
          notes: 'Active recovery & mobility.',
        },
      ],
    },
  },
  naik_stamina: {
    label: 'Meningkatkan Stamina',
    days: {
      2: [
        {
          name: 'Endurance Circuit A',
          exercises: [
            { name: 'Jumping Jack', sets: 4, reps: 30, weight: 0, rest: 20 },
            { name: 'Squat', sets: 4, reps: 20, weight: 0, rest: 20 },
            { name: 'Push Up', sets: 4, reps: 15, weight: 0, rest: 20 },
            { name: 'Mountain Climber', sets: 4, reps: 30, weight: 0, rest: 20 },
            { name: 'Burpee', sets: 4, reps: 10, weight: 0, rest: 20 },
          ],
          duration: 35,
          notes: 'High intensity circuit. 4 ronde, rest 20 detik. Push your limits!',
        },
        {
          name: 'Endurance Circuit B',
          exercises: [
            { name: 'Jump Rope', sets: 4, reps: 60, weight: 0, rest: 20 },
            { name: 'Lunge', sets: 4, reps: 15, weight: 0, rest: 20 },
            { name: 'Plank', sets: 4, reps: 45, weight: 0, rest: 20 },
            { name: 'Kettlebell Swing', sets: 4, reps: 15, weight: 0, rest: 20 },
            { name: 'Treadmill Run', sets: 1, reps: 15, weight: 0, rest: 0 },
          ],
          duration: 35,
          notes: 'High intensity circuit. Jaga ritme pernapasan.',
        },
      ],
      3: [
        {
          name: 'Endurance Circuit A',
          exercises: [
            { name: 'Jumping Jack', sets: 4, reps: 30, weight: 0, rest: 20 },
            { name: 'Squat', sets: 4, reps: 20, weight: 0, rest: 20 },
            { name: 'Push Up', sets: 4, reps: 15, weight: 0, rest: 20 },
            { name: 'Mountain Climber', sets: 4, reps: 30, weight: 0, rest: 20 },
            { name: 'Burpee', sets: 4, reps: 10, weight: 0, rest: 20 },
          ],
          duration: 35,
          notes: 'High intensity circuit.',
        },
        {
          name: 'Endurance Circuit B',
          exercises: [
            { name: 'Jump Rope', sets: 4, reps: 60, weight: 0, rest: 20 },
            { name: 'Lunge', sets: 4, reps: 15, weight: 0, rest: 20 },
            { name: 'Plank', sets: 4, reps: 45, weight: 0, rest: 20 },
            { name: 'Kettlebell Swing', sets: 4, reps: 15, weight: 0, rest: 20 },
          ],
          duration: 35,
          notes: 'High intensity circuit.',
        },
        {
          name: 'Cardio Day',
          exercises: [
            { name: 'Treadmill Run', sets: 1, reps: 20, weight: 0, rest: 0 },
            { name: 'Rowing Machine', sets: 1, reps: 10, weight: 0, rest: 0 },
            { name: 'Stationary Bike', sets: 1, reps: 10, weight: 0, rest: 0 },
            { name: 'Jump Rope', sets: 3, reps: 60, weight: 0, rest: 30 },
          ],
          duration: 40,
          notes: 'Cardio mix untuk meningkatkan VO2 max.',
        },
      ],
    },
  },
};

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

app.post('/api/workout-plans/preview', (req, res) => {
  const profile = db.prepare('SELECT * FROM fitness_profile WHERE id = 1').get();
  if (!profile) return res.status(400).json({ error: 'Profil belum diisi. Lengkapi profil terlebih dahulu.' });

  const goal = profile.goal || 'jaga_kebugaran';
  const frequency = profile.frequency || 3;

  const templates = WORKOUT_TEMPLATES[goal];
  if (!templates) return res.status(400).json({ error: 'Tidak ada template untuk goal ini' });

  const availFreqs = Object.keys(templates.days).map(Number).sort((a, b) => a - b);
  const bestFreq = availFreqs.reduce((prev, curr) =>
    Math.abs(curr - frequency) < Math.abs(prev - frequency) ? curr : prev
  );

  const dayTemplates = templates.days[bestFreq];

  const assignDays = [];
  if (bestFreq === 2) assignDays.push('monday', 'thursday');
  else if (bestFreq === 3) assignDays.push('monday', 'wednesday', 'friday');
  else if (bestFreq === 4) assignDays.push('monday', 'tuesday', 'thursday', 'friday');
  else { const step = Math.floor(7 / bestFreq); for (let i = 0; i < bestFreq; i++) assignDays.push(DAY_ORDER[i * step]); }

  const userEquipment = JSON.parse(profile.equipment || '[]');
  const equipmentSet = new Set(userEquipment);

  const exerciseLookup = {};
  const allExercises = db.prepare('SELECT id, name, category, equipment FROM exercises').all();
  for (const ex of allExercises) exerciseLookup[ex.name.toLowerCase().trim()] = ex;

  const preview = dayTemplates.map((template, idx) => ({
    name: template.name,
    day: assignDays[idx] || DAY_ORDER[idx % 7],
    estimated_duration: template.duration || 30,
    notes: template.notes || '',
    exercises: template.exercises.map((exDef) => {
      const match = exerciseLookup[exDef.name.toLowerCase().trim()];
      if (!match) return null;
      const needsEquipment = match.equipment && match.equipment.trim() !== '';
      if (needsEquipment && !equipmentSet.has(match.equipment)) return null;
      return {
        exercise_id: match.id,
        name: exDef.name,
        category: match.category,
        target_sets: exDef.sets,
        target_reps: exDef.reps,
        target_weight: exDef.weight,
        rest_time: exDef.rest,
      };
    }).filter(e => e !== null),
  }));

  res.json({ preview, goal_label: templates.label, frequency: bestFreq });
});

app.post('/api/workout-plans/suggest', (req, res) => {
  const { plans } = req.body;
  if (!plans || !Array.isArray(plans) || plans.length === 0) {
    return res.status(400).json({ error: 'Data plan tidak valid' });
  }

  const txn = db.transaction(() => {
    db.prepare('DELETE FROM workout_plan_exercises').run();
    db.prepare('DELETE FROM workout_plans').run();

    const insertPlan = db.prepare(
      'INSERT INTO workout_plans (name, day, estimated_duration, notes) VALUES (?, ?, ?, ?)'
    );
    const insertEx = db.prepare(
      'INSERT INTO workout_plan_exercises (plan_id, exercise_id, target_sets, target_reps, target_weight, rest_time, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    plans.forEach((plan) => {
      const pr = insertPlan.run(plan.name, plan.day, plan.estimated_duration || 30, plan.notes || '');
      const planId = pr.lastInsertRowid;
      (plan.exercises || []).forEach((ex, i) => {
        insertEx.run(planId, ex.exercise_id, ex.target_sets || 3, ex.target_reps || 10, ex.target_weight || 0, ex.rest_time || 60, i);
      });
    });
  });

  txn();
  res.json({ message: `${plans.length} plan berhasil dibuat!` });
});

app.post('/api/workout-plans/:id/complete', (req, res) => {
  const { date, notes } = req.body;
  console.log('COMPLETE DEBUG:', { body: req.body, date, notes });
  const plan = db.prepare(`
    SELECT wp.*,
      COALESCE(
        json_group_array(
          json_object(
            'exercise_id', wpe.exercise_id,
            'target_sets', wpe.target_sets,
            'target_reps', wpe.target_reps,
            'target_weight', wpe.target_weight
          )
          ORDER BY wpe.sort_order
        ), '[]'
      ) as exercises
    FROM workout_plans wp
    LEFT JOIN workout_plan_exercises wpe ON wpe.plan_id = wp.id
    WHERE wp.id = ?
    GROUP BY wp.id
  `).get(req.params.id);

  if (!plan) return res.status(404).json({ error: 'Plan not found' });

  const exercises = JSON.parse(plan.exercises).filter(e => e.exercise_id);
  const workoutDate = date && date.trim() ? date : new Date().toISOString().slice(0, 10);
  const workoutNotes = notes && notes.trim() ? notes : `Dari plan: ${plan.name}`;

  const txn = db.transaction(() => {
    const { lastInsertRowid: workoutId } = db.prepare('INSERT INTO workouts (date, notes) VALUES (?, ?)').run(workoutDate, workoutNotes);

    const insertWE = db.prepare('INSERT INTO workout_exercises (workout_id, exercise_id, sort_order) VALUES (?, ?, ?)');
    const insertSet = db.prepare('INSERT INTO sets (workout_exercise_id, reps, weight, sort_order) VALUES (?, ?, ?, ?)');

    exercises.forEach((ex, exIdx) => {
      const { lastInsertRowid: weId } = insertWE.run(workoutId, ex.exercise_id, exIdx);
      for (let s = 0; s < ex.target_sets; s++) {
        insertSet.run(weId, ex.target_reps, ex.target_weight, s);
      }
    });

    return workoutId;
  });

  const workoutId = txn();
  res.status(201).json({ workout_id: workoutId, message: 'Workout created from plan' });
});


app.post('/api/exercises/auto-fetch-youtube', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const q = encodeURIComponent(name + ' latihan tutorial');
    const resp = await fetch(`https://www.youtube.com/results?search_query=${q}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    const html = await resp.text();
    const match = html.match(/ytInitialData\s*=\s*({.+?});\s*<\/script>/);
    if (!match) return res.json({ videoUrl: null });
    const data = JSON.parse(match[1]);
    const contents = data?.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents;
    if (!contents) return res.json({ videoUrl: null });
    for (const section of contents) {
      const items = section?.itemSectionRenderer?.contents || [];
      for (const item of items) {
        if (item?.videoRenderer?.videoId) {
          return res.json({ videoUrl: `https://www.youtube.com/watch?v=${item.videoRenderer.videoId}`, title: item.videoRenderer.title?.runs?.[0]?.text });
        }
      }
    }
    res.json({ videoUrl: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
